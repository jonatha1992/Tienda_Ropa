"""
Gestión automática de migraciones de base de datos.
"""
import os
import logging
from alembic.config import Config
from alembic import command
from app.core.config import settings

logger = logging.getLogger(__name__)

def run_migrations():
    """
    Ejecuta las migraciones automáticamente al iniciar la aplicación.
    Solo funciona en entornos development y test.
    En production las migraciones deben ser ejecutadas manualmente por seguridad.
    """
    # Solo ejecutar migraciones automáticas en development y test
    if settings.ENVIRONMENT not in ["development", "dev", "test"]:
        logger.info(f"Skipping auto-migrations in {settings.ENVIRONMENT} environment")
        return
    
    try:
        # Configurar Alembic
        alembic_cfg = Config()
        
        # Path al directorio de alembic
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        alembic_dir = os.path.join(backend_dir, "alembic")
        
        # Configurar rutas
        alembic_cfg.set_main_option("script_location", alembic_dir)
        alembic_cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
        
        logger.info("Running database migrations...")
        
        # Ejecutar upgrade head (aplicar todas las migraciones pendientes)
        command.upgrade(alembic_cfg, "head")
        
        logger.info("Database migrations completed successfully")
        
    except Exception as e:
        logger.error(f"Error running migrations: {e}")
        # En development, podemos continuar incluso si fallan las migraciones
        # En test, las migraciones fallidas podrían indicar un problema serio
        if settings.ENVIRONMENT == "test":
            raise
        else:
            logger.warning("Continuing despite migration errors in development mode")

def create_tables_if_not_exist():
    """
    Crea las tablas si no existen (fallback para casos especiales).
    Esto es útil para casos donde Alembic no está configurado correctamente.
    """
    try:
        from sqlmodel import SQLModel
        from app.db.session import engine
        
        logger.info("Creating tables if they don't exist...")
        SQLModel.metadata.create_all(engine)
        logger.info("Table creation completed")
        
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise