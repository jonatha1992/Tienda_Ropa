#!/usr/bin/env python3
"""
Script para ejecutar la migración directamente en PostgreSQL
"""
import os
import sys
from sqlalchemy import create_engine, text
from alembic.config import Config
from alembic import command

# Establecer variable de entorno
os.environ['ENVIRONMENT'] = 'test'

# URL de PostgreSQL
DATABASE_URL = "postgresql://postgres:FzFzOKmypoHIhjvKOLCQSpiMHLyVPPPw@turntable.proxy.rlwy.net:48325/railway"

def check_connection():
    """Verificar conexión a PostgreSQL"""
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Conectado a PostgreSQL: {version[:50]}...")
            return True
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        return False

def check_tables():
    """Verificar qué tablas existen"""
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name;
            """))
            tables = [row[0] for row in result]
            print(f"📋 Tablas existentes: {tables if tables else 'Ninguna'}")
            return tables
    except Exception as e:
        print(f"❌ Error verificando tablas: {e}")
        return []

def clean_alembic_version():
    """Limpiar tabla alembic_version si existe"""
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS alembic_version;"))
            conn.commit()
            print("🧹 Tabla alembic_version eliminada")
    except Exception as e:
        print(f"⚠️ Error limpiando alembic_version: {e}")

def run_migration():
    """Ejecutar migración de Alembic"""
    try:
        config = Config('alembic.ini')
        command.upgrade(config, 'head')
        print("✅ Migración ejecutada exitosamente")
        return True
    except Exception as e:
        print(f"❌ Error ejecutando migración: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Iniciando proceso de migración...")
    
    # 1. Verificar conexión
    if not check_connection():
        sys.exit(1)
    
    # 2. Verificar tablas actuales
    print("\n📋 Estado inicial:")
    check_tables()
    
    # 3. Limpiar estado de Alembic
    print("\n🧹 Limpiando estado anterior...")
    clean_alembic_version()
    
    # 4. Ejecutar migración
    print("\n⚡ Ejecutando migración...")
    if run_migration():
        # 5. Verificar resultado
        print("\n✅ Verificando resultado:")
        final_tables = check_tables()
        if len(final_tables) > 0:
            print(f"🎉 ¡Migración completada! Se crearon {len(final_tables)} tablas.")
        else:
            print("⚠️ No se encontraron tablas después de la migración.")
    else:
        print("❌ La migración falló.")
        sys.exit(1)
