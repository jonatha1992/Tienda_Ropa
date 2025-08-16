#!/usr/bin/env python3
"""
Script para reiniciar completamente la base de datos.
Elimina la base de datos existente, aplica migraciones y carga datos iniciales.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Ejecuta un comando y maneja errores."""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completado")
        if result.stdout:
            print(f"   {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}")
        print(f"   {e.stderr.strip()}")
        return False

def reset_database():
    """Reinicia completamente la base de datos."""
    
    # Verificar que estamos en el directorio correcto
    if not Path("app").exists():
        print("❌ Error: Debes ejecutar este script desde el directorio backend")
        sys.exit(1)
    
    print("=" * 60)
    print("🔄 REINICIO COMPLETO DE BASE DE DATOS")
    print("=" * 60)
    print("\n⚠️  ADVERTENCIA: Esto eliminará TODOS los datos existentes")
    
    # Confirmación del usuario
    confirm = input("\n¿Estás seguro? Escribe 'SI' para continuar: ")
    if confirm != "SI":
        print("❌ Operación cancelada")
        sys.exit(0)
    
    print("\n🚀 Iniciando reinicio de base de datos...")
    
    # 1. Eliminar bases de datos SQLite existentes
    db_files = ["app.db", "test_app.db"]
    for db_file in db_files:
        if Path(db_file).exists():
            try:
                os.remove(db_file)
                print(f"🗑️  Eliminado: {db_file}")
            except Exception as e:
                print(f"⚠️  No se pudo eliminar {db_file}: {e}")
    
    # 2. Aplicar migraciones
    if not run_command("alembic upgrade head", "Aplicando migraciones"):
        print("❌ Falló al aplicar migraciones")
        sys.exit(1)
    
    # 3. Cargar datos iniciales
    if not run_command("python init_complete_data.py", "Cargando datos iniciales"):
        print("❌ Falló al cargar datos iniciales")
        sys.exit(1)
    
    print("\n🎉 ¡Base de datos reiniciada exitosamente!")
    print("   ✅ Migraciones aplicadas")
    print("   ✅ Datos iniciales cargados")
    print("   ✅ Nuevos colores estéticos incluidos")
    print("\n💡 La base de datos está lista para usar")

if __name__ == "__main__":
    reset_database()