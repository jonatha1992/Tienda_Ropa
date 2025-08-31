#!/usr/bin/env python3
"""Script para eliminar todas las tablas de PostgreSQL."""

import os
import subprocess
from pathlib import Path
from sqlalchemy import create_engine, text, inspect


def load_env():
    """Carga variables de entorno desde .env.test"""
    env_file = Path(".env.dev")
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value.strip("\"'")


def main():
    """Elimina todas las tablas de la base de datos."""
    load_env()

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL no encontrada")
        return

    # Confirmación simple
    confirm = input("⚠️ Esto eliminará TODAS las tablas. Escribe 'SI': ")
    if confirm != "SI":
        print("❌ Cancelado")
        return

    try:
        engine = create_engine(database_url)

        with engine.connect() as conn:
            # Obtener todas las tablas
            inspector = inspect(engine)
            tables = inspector.get_table_names()

            if not tables:
                print("ℹ️ No hay tablas para eliminar")
                return

            print(f"🔥 Eliminando {len(tables)} tablas...")

            # Desactivar restricciones y eliminar tablas
            conn.execute(text("SET session_replication_role = replica;"))

            for table in tables:
                conn.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE;'))
                print(f"✅ {table}")

            # Eliminar tabla de Alembic
            conn.execute(text('DROP TABLE IF EXISTS "alembic_version" CASCADE;'))

            conn.execute(text("SET session_replication_role = DEFAULT;"))
            conn.commit()

            print("🎉 Todas las tablas eliminadas")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    if not Path("app").exists():
        print("❌ Ejecutar desde directorio backend")
    else:
        main()
