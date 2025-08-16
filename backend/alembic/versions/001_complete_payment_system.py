"""Add complete payment system with admin verification

Revision ID: 001_complete_payment_system
Revises: f45eddb8346a
Create Date: 2025-01-16

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = '001_complete_payment_system'
down_revision = 'f45eddb8346a'
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla PaymentConfig
    op.create_table('paymentconfig',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('config_type', sa.String(), nullable=False),
        sa.Column('config_name', sa.String(), nullable=False),
        sa.Column('config_data', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Agregar campos a Customer para datos completos de entrega
    op.add_column('customer', sa.Column('first_name', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('last_name', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('city', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('postal_code', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('province', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('country', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('address_reference', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('delivery_notes', sa.String(), nullable=True))
    op.add_column('customer', sa.Column('preferred_delivery_time', sa.String(), nullable=True))
    
    # Agregar campos a Order para transferencias
    op.add_column('order', sa.Column('bank_account_info', sa.String(), nullable=True))
    op.add_column('order', sa.Column('transfer_receipt_url', sa.String(), nullable=True))
    op.add_column('order', sa.Column('transfer_verified', sa.Boolean(), nullable=True))
    op.add_column('order', sa.Column('transfer_verification_date', sa.DateTime(), nullable=True))
    
    # Agregar campos a Order para efectivo y entregas
    op.add_column('order', sa.Column('delivery_cost', sa.Float(), nullable=True))
    op.add_column('order', sa.Column('delivery_zone', sa.String(), nullable=True))
    op.add_column('order', sa.Column('delivery_scheduled_date', sa.DateTime(), nullable=True))
    op.add_column('order', sa.Column('delivery_time_slot', sa.String(), nullable=True))
    op.add_column('order', sa.Column('delivery_status', sa.String(), nullable=True))
    op.add_column('order', sa.Column('delivery_notes', sa.String(), nullable=True))
    
    # Agregar campos a Order para administración
    op.add_column('order', sa.Column('admin_notes', sa.String(), nullable=True))
    op.add_column('order', sa.Column('verification_required', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('order', sa.Column('verified_by_admin', sa.Boolean(), nullable=True))
    op.add_column('order', sa.Column('admin_verification_date', sa.DateTime(), nullable=True))
    
    # Migrar datos existentes: dividir el campo name en first_name y last_name
    connection = op.get_bind()
    customers = connection.execute(text("SELECT id, name FROM customer WHERE name IS NOT NULL")).fetchall()
    
    for customer in customers:
        if customer.name:
            name_parts = customer.name.strip().split(' ', 1)
            first_name = name_parts[0] if name_parts else ""
            last_name = name_parts[1] if len(name_parts) > 1 else ""
            
            connection.execute(
                text("UPDATE customer SET first_name = :first_name, last_name = :last_name, country = 'AR' WHERE id = :id"),
                {"first_name": first_name, "last_name": last_name, "id": customer.id}
            )


def downgrade():
    # Eliminar campos de Order
    op.drop_column('order', 'admin_verification_date')
    op.drop_column('order', 'verified_by_admin')
    op.drop_column('order', 'verification_required')
    op.drop_column('order', 'admin_notes')
    op.drop_column('order', 'delivery_notes')
    op.drop_column('order', 'delivery_status')
    op.drop_column('order', 'delivery_time_slot')
    op.drop_column('order', 'delivery_scheduled_date')
    op.drop_column('order', 'delivery_zone')
    op.drop_column('order', 'delivery_cost')
    op.drop_column('order', 'transfer_verification_date')
    op.drop_column('order', 'transfer_verified')
    op.drop_column('order', 'transfer_receipt_url')
    op.drop_column('order', 'bank_account_info')
    
    # Eliminar campos de Customer
    op.drop_column('customer', 'preferred_delivery_time')
    op.drop_column('customer', 'delivery_notes')
    op.drop_column('customer', 'address_reference')
    op.drop_column('customer', 'country')
    op.drop_column('customer', 'province')
    op.drop_column('customer', 'postal_code')
    op.drop_column('customer', 'city')
    op.drop_column('customer', 'last_name')
    op.drop_column('customer', 'first_name')
    
    # Eliminar tabla PaymentConfig
    op.drop_table('paymentconfig')