from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from sqlmodel import SQLModel
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.customer import Customer
from app.models.inventory import Inventory
from app.models.order_item import OrderItem
from app.models.order import Order
from app.models.product import Product, ProductImage, ProductVariant
from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.master_data import Color, Category, Size

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata

# Get database URL from environment variables
database_url = os.getenv("DATABASE_URL", "sqlite:///./db.sqlite3")

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Override the sqlalchemy.url in the config
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = database_url
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, render_as_batch=True)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()