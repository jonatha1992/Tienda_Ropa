#!/usr/bin/env python3
"""
Script para actualizar la base de datos con colores más estéticos y profesionales para moda.
Ejecutar desde el directorio backend.
"""

import asyncio
import sys
import os

# Agregar el directorio backend al path para importar los módulos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from app.db.session import get_session_sync
from app.models.master_data import Color

# Paleta de colores más estética y profesional para moda
AESTHETIC_COLORS = [
    # Neutros sofisticados
    ("BLANCO", "#FFFFFF"),
    ("NEGRO", "#1C1C1C"),  # Negro más suave que el puro
    ("GRIS CLARO", "#F5F5F5"),
    ("GRIS", "#9CA3AF"),
    ("GRIS OSCURO", "#374151"),
    ("BEIGE", "#F5F5DC"),
    ("CREMA", "#F7F3E9"),
    ("MARFIL", "#FFFDD0"),
    
    # Azules elegantes
    ("AZUL MARINO", "#1E3A8A"),
    ("AZUL CIELO", "#87CEEB"),
    ("AZUL DENIM", "#4F46E5"),
    ("AZUL POLVO", "#B0C4DE"),
    ("AZUL PETROLEO", "#0891B2"),
    
    # Rojos sofisticados
    ("ROJO BORGOÑA", "#800020"),
    ("ROJO CORAL", "#FF6B6B"),
    ("ROJO CARMESÍ", "#DC2626"),
    ("ROSA POLVO", "#F8BBD9"),
    ("ROSA NUDE", "#E8B4B8"),
    
    # Verdes naturales
    ("VERDE OLIVA", "#6B7280"),
    ("VERDE SALVIA", "#87A96B"),
    ("VERDE MENTA", "#B8E6B8"),
    ("VERDE BOSQUE", "#228B22"),
    ("VERDE MILITAR", "#4A5D23"),
    
    # Amarillos y naranjas suaves
    ("AMARILLO MOSTAZA", "#FFDB58"),
    ("NARANJA TERRACOTA", "#E07A5F"),
    ("NARANJA QUEMADO", "#CC5500"),
    ("DORADO", "#FFD700"),
    ("CAMEL", "#C19A6B"),
    
    # Morados y lilas elegantes
    ("LAVANDA", "#E6E6FA"),
    ("MORADO UVA", "#6F2DA8"),
    ("LILA", "#C8A2C8"),
    ("PÚRPURA", "#800080"),
    
    # Marrones cálidos
    ("MARRÓN CHOCOLATE", "#7B3F00"),
    ("MARRÓN TAUPE", "#483C32"),
    ("MARRÓN CAOBA", "#C04000"),
    ("CAFÉ", "#6F4E37"),
    
    # Colores trendy
    ("CORAL LIVING", "#FF6F61"),
    ("AZUL SERENITY", "#88B0D1"),
    ("VERDE EUCALIPTO", "#4A7C59"),
    ("ROSA MILENIAL", "#F7CAC9"),
    ("AMARILLO LIMÓN", "#FFF700"),
]

def update_colors():
    """Actualiza la base de datos con colores más estéticos."""
    
    print("🎨 Iniciando actualización de colores...")
    
    # Obtener sesión de base de datos
    db = next(get_session_sync())
    
    try:
        # Desactivar todos los colores existentes
        print("🔄 Desactivando colores existentes...")
        existing_colors = db.exec(select(Color)).all()
        for color in existing_colors:
            color.is_active = False
        
        # Agregar nuevos colores estéticos
        print("✨ Agregando nueva paleta de colores...")
        colors_added = 0
        
        for color_name, hex_code in AESTHETIC_COLORS:
            # Verificar si el color ya existe
            existing_color = db.exec(
                select(Color).where(Color.name == color_name)
            ).first()
            
            if existing_color:
                # Actualizar color existente
                existing_color.hex_code = hex_code
                existing_color.is_active = True
                print(f"   ♻️  Actualizado: {color_name} -> {hex_code}")
            else:
                # Crear nuevo color
                new_color = Color(
                    name=color_name,
                    hex_code=hex_code,
                    is_active=True
                )
                db.add(new_color)
                colors_added += 1
                print(f"   ✅ Agregado: {color_name} -> {hex_code}")
        
        # Confirmar cambios
        db.commit()
        
        print(f"\n🎉 ¡Actualización completada!")
        print(f"   📊 Colores agregados: {colors_added}")
        print(f"   🔢 Total de colores activos: {len(AESTHETIC_COLORS)}")
        print(f"   🎨 La nueva paleta incluye colores más estéticos y profesionales")
        
    except Exception as e:
        print(f"❌ Error durante la actualización: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def main():
    """Función principal."""
    print("=" * 60)
    print("🎨 ACTUALIZACIÓN DE PALETA DE COLORES ESTÉTICA")
    print("=" * 60)
    
    try:
        update_colors()
        print("\n✅ Proceso completado exitosamente")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()