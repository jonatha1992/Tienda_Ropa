"""add is_unique_product field

Revision ID: add_unique_product
Revises: 9594ecb80a6d
Create Date: 2025-08-07 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'add_unique_product'
down_revision: Union[str, None] = '9594ecb80a6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add is_unique_product column to product table
    op.add_column('product', sa.Column('is_unique_product', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    # Remove is_unique_product column from product table
    op.drop_column('product', 'is_unique_product')