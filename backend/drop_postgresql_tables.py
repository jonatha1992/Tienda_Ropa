#!/usr/bin/env python3
"""
Script para eliminar TODAS las tablas de PostgreSQL en Railway.
⚠️ PELIGRO: Este script eliminará TODOS los datos de la base de datos de producción.
"""

import os
import sys
import asyncpg
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from pathlib import Path


def load_environment():
    """Carga las variables de entorno desde .env.pro"""
    env_file = Path(".env.test")
    if not env_file.exists():
        print("❌ Error: No se encontró el archivo .env.pro")
        sys.exit(1)

    # Cargar variables del archivo .env.pro
    with open(env_file, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                # Remover comillas si existen
                value = value.strip("\"'")
                os.environ[key] = value


def get_database_url():
    """Obtiene la URL de la base de datos desde las variables de entorno."""
    return os.getenv("DATABASE_URL")


def drop_all_tables():
    """Elimina todas las tablas de la base de datos PostgreSQL."""

    # Cargar configuración
    load_environment()
    database_url = get_database_url()

    if not database_url:
        print("❌ Error: No se encontró DATABASE_URL en las variables de entorno")
        sys.exit(1)

    print("=" * 70)
    print("🔥 ELIMINACIÓN DE TODAS LAS TABLAS DE POSTGRESQL (RAILWAY)")
    print("=" * 70)
    print(
        f"\n📍 Base de datos: {database_url.split('@')[1] if '@' in database_url else 'N/A'}"
    )
    print("\n⚠️  PELIGRO EXTREMO: Esto eliminará TODAS las tablas y datos")
    print("   Esta operación NO se puede deshacer")
    print("   Se perderán TODOS los datos de producción")

    # Triple confirmación para operaciones peligrosas
    print("\n" + "=" * 50)
    print("🚨 CONFIRMACIÓN REQUERIDA")
    print("=" * 50)

    confirm1 = input(
        "\n1. ¿Entiendes que esto eliminará TODOS los datos? (escribe 'ENTIENDO'): "
    )
    if confirm1 != "ENTIENDO":
        print("❌ Operación cancelada")
        sys.exit(0)

    confirm2 = input("\n2. ¿Estás ABSOLUTAMENTE seguro? (escribe 'ELIMINAR TODO'): ")
    if confirm2 != "ELIMINAR TODO":
        print("❌ Operación cancelada")
        sys.exit(0)

    confirm3 = input(
        "\n3. Confirmación final - escribe exactamente: 'SI ELIMINAR TABLAS': "
    )
    if confirm3 != "SI ELIMINAR TABLAS":
        print("❌ Operación cancelada")
        sys.exit(0)

    try:
        print("\n🔄 Conectando a la base de datos PostgreSQL...")
        engine = create_engine(database_url)

        # Probar conexión
        with engine.connect() as connection:
            print("✅ Conexión establecida exitosamente")

            # Inspeccionar tablas existentes
            inspector = inspect(engine)
            tables = inspector.get_table_names()

            if not tables:
                print("ℹ️  No se encontraron tablas en la base de datos")
                return

            print(f"\n📋 Tablas encontradas ({len(tables)}):")
            for table in tables:
                print(f"   • {table}")

            print(f"\n🔥 Eliminando {len(tables)} tablas...")

            # Eliminar tablas en orden seguro (desactivar restricciones)
            connection.execute(text("SET session_replication_role = replica;"))

            for table in tables:
                try:
                    connection.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE;'))
                    print(f"   🗑️  Eliminada: {table}")
                except Exception as e:
                    print(f"   ⚠️  Error al eliminar {table}: {e}")

            # Reactivar restricciones
            connection.execute(text("SET session_replication_role = DEFAULT;"))

            # Eliminar tabla de versiones de Alembic
            try:
                connection.execute(
                    text('DROP TABLE IF EXISTS "alembic_version" CASCADE;')
                )
                print("   🗑️  Eliminada: alembic_version")
            except Exception as e:
                print(f"   ⚠️  Error al eliminar alembic_version: {e}")

            connection.commit()

            # Verificar que se eliminaron todas las tablas
            inspector_final = inspect(engine)
            remaining_tables = inspector_final.get_table_names()

            if not remaining_tables:
                print("\n🎉 ¡TODAS LAS TABLAS HAN SIDO ELIMINADAS EXITOSAMENTE!")
                print("   ✅ Base de datos completamente limpia")
                print("   ✅ Tabla alembic_version eliminada")
                print("\n💡 Para recrear las tablas ejecuta:")
                print("   alembic upgrade head")
                print("   python init_complete_data.py")
            else:
                print(f"\n⚠️  Quedan {len(remaining_tables)} tablas:")
                for table in remaining_tables:
                    print(f"   • {table}")

    except Exception as e:
        print(f"\n❌ Error durante la eliminación: {e}")
        print(f"   Tipo de error: {type(e).__name__}")
        sys.exit(1)


if __name__ == "__main__":
    # Verificar que estamos en el directorio correcto
    if not Path("app").exists():
        print("❌ Error: Debes ejecutar este script desde el directorio backend")
        sys.exit(1)

    drop_all_tables()
