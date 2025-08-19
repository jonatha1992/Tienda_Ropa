"""Add shipping tracking fields to Order model

Revision ID: 5f8d2c39e1a4
Revises: 4a7b6872410e
Create Date: 2025-01-19 15:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5f8d2c39e1a4'
down_revision: Union[str, None] = '4a7b6872410e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add shipping tracking fields to order table
    op.add_column('order', sa.Column('tracking_number', sa.String(length=255), nullable=True))
    op.add_column('order', sa.Column('shipping_provider', sa.String(length=100), nullable=True))
    op.add_column('order', sa.Column('shipped_at', sa.DateTime(), nullable=True))
    op.add_column('order', sa.Column('estimated_delivery', sa.DateTime(), nullable=True))
    op.add_column('order', sa.Column('shipped_by', sa.Integer(), nullable=True))
    op.add_column('order', sa.Column('tracking_updated_at', sa.DateTime(), nullable=True))
    op.add_column('order', sa.Column('delivery_notes_shipping', sa.Text(), nullable=True))
    
    # Create foreign key for shipped_by referencing user table
    op.create_foreign_key('fk_order_shipped_by', 'order', 'user', ['shipped_by'], ['id'])


def downgrade() -> None:
    # Drop foreign key first
    op.drop_constraint('fk_order_shipped_by', 'order', type_='foreignkey')
    
    # Drop shipping tracking fields
    op.drop_column('order', 'delivery_notes_shipping')
    op.drop_column('order', 'tracking_updated_at')
    op.drop_column('order', 'shipped_by')
    op.drop_column('order', 'estimated_delivery')
    op.drop_column('order', 'shipped_at')
    op.drop_column('order', 'shipping_provider')
    op.drop_column('order', 'tracking_number')