"""
Script para inicializar todos los datos necesarios: colores, categorías, talles y roles.
Ejecutar después de las migraciones para poblar la base de datos con datos de referencia.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import get_session
from app.controllers.master_data_controller import (
    create_colors_bulk, create_categories_bulk, create_sizes_bulk
)
from app.controllers.role_controller import initialize_default_roles
from app.models.master_data import ColorCreate, CategoryCreate, SizeCreate
from app.controllers.user_controller import create_user_with_role
from app.models.user import UserCreate
import sqlmodel

def init_complete_data():
    """Inicializar todos los datos maestros y roles."""
    db = next(get_session())
    
    try:
        print("🎨 Inicializando datos completos...")
        
        # === ROLES ===
        print("\n👥 Inicializando roles por defecto...")
        initialize_default_roles(db)
        print("✅ Roles inicializados")
        
        # === COLORES ===
        print("\n📋 Creando colores estéticos...")
        colors_data = [
            # Neutros sofisticados
            ColorCreate(name="Blanco", hex_code="#FFFFFF"),
            ColorCreate(name="Negro", hex_code="#1C1C1C"),
            ColorCreate(name="Gris Claro", hex_code="#F5F5F5"),
            ColorCreate(name="Gris", hex_code="#9CA3AF"),
            ColorCreate(name="Gris Oscuro", hex_code="#374151"),
            ColorCreate(name="Beige", hex_code="#F5F5DC"),
            ColorCreate(name="Crema", hex_code="#F7F3E9"),
            
            # Azules elegantes
            ColorCreate(name="Azul Marino", hex_code="#1E3A8A"),
            ColorCreate(name="Azul Cielo", hex_code="#87CEEB"),
            ColorCreate(name="Azul Denim", hex_code="#4F46E5"),
            ColorCreate(name="Azul Petroleo", hex_code="#0891B2"),
            
            # Rojos sofisticados
            ColorCreate(name="Rojo Borgoña", hex_code="#800020"),
            ColorCreate(name="Rojo Coral", hex_code="#FF6B6B"),
            ColorCreate(name="Rosa Polvo", hex_code="#F8BBD9"),
            ColorCreate(name="Rosa Nude", hex_code="#E8B4B8"),
            
            # Verdes naturales
            ColorCreate(name="Verde Oliva", hex_code="#6B7280"),
            ColorCreate(name="Verde Salvia", hex_code="#87A96B"),
            ColorCreate(name="Verde Menta", hex_code="#B8E6B8"),
            ColorCreate(name="Verde Militar", hex_code="#4A5D23"),
            
            # Otros colores trendy
            ColorCreate(name="Amarillo Mostaza", hex_code="#FFDB58"),
            ColorCreate(name="Naranja Terracota", hex_code="#E07A5F"),
            ColorCreate(name="Lavanda", hex_code="#E6E6FA"),
            ColorCreate(name="Morado Uva", hex_code="#6F2DA8"),
            ColorCreate(name="Marrón Chocolate", hex_code="#7B3F00"),
            ColorCreate(name="Camel", hex_code="#C19A6B"),
            ColorCreate(name="Coral Living", hex_code="#FF6F61"),
            ColorCreate(name="Azul Serenity", hex_code="#88B0D1"),
        ]
        
        created_colors = create_colors_bulk(db, colors_data)
        print(f"✅ Creados {len(created_colors)} colores")
        
        # === CATEGORÍAS ===
        print("\n📂 Creando categorías...")
        categories_data = [
            CategoryCreate(name="BIKINI_SUMMER", description="Trajes de baño veraniegos (bikinis, mallas, etc.)"),
            CategoryCreate(name="JACKET", description="Chaquetas"),
            CategoryCreate(name="TRENCH", description="Gabardinas / trench coats"),
            CategoryCreate(name="BLAZER", description="Blazers y bléiseres"),
            CategoryCreate(name="TAPADO", description="Tapados y abrigos largos"),
            CategoryCreate(name="BLUSA", description="Blusas"),
            CategoryCreate(name="BASICA", description="Prendas básicas"),
            CategoryCreate(name="TOP", description="Tops"),
            CategoryCreate(name="VESTIDO", description="Vestidos"),
            CategoryCreate(name="JEAN", description="Pantalones de jean"),
            CategoryCreate(name="PANTALON", description="Pantalones largos"),
            CategoryCreate(name="CALZA", description="Calzas / leggins"),
            CategoryCreate(name="SWEATER", description="Sweaters"),
            CategoryCreate(name="HOODIE", description="Hoodies / buzos con capucha"),
            CategoryCreate(name="ACCESORIO", description="Accesorios"),
            CategoryCreate(name="BODY", description="Bodies"),
            CategoryCreate(name="MINI", description="Polleras / minifaldas"),
            CategoryCreate(name="SHORT", description="Shorts y bermudas"),
            CategoryCreate(name="CAMISA", description="Camisas"),
            CategoryCreate(name="SHOE", description="Calzado / zapatillas"),
            CategoryCreate(name="MAKE_A_GIFT", description="Regalos"),
            CategoryCreate(name="TOTE_BAG", description="Tote bags / bolsos"),
            CategoryCreate(name="TEJIDO", description="Prendas tejidas")

        ]
        
        created_categories = create_categories_bulk(db, categories_data)
        print(f"✅ Creadas {len(created_categories)} categorías")
        
        # === TALLES ===
        print("\n📏 Creando talles...")
        sizes_data = [
            SizeCreate(name="XS", numeric_size=0, order=1),
            SizeCreate(name="S", numeric_size=1, order=2),
            SizeCreate(name="M", numeric_size=2, order=3),
            SizeCreate(name="L", numeric_size=3, order=4),
            SizeCreate(name="XL", numeric_size=4, order=5),
            SizeCreate(name="XXL", numeric_size=5, order=6),
            # Talles numéricos adicionales
            SizeCreate(name="24", numeric_size=24, order=7),
            SizeCreate(name="26", numeric_size=26, order=8),
            SizeCreate(name="28", numeric_size=28, order=9),
            SizeCreate(name="30", numeric_size=30, order=10),
            SizeCreate(name="32", numeric_size=32, order=11),
            SizeCreate(name="34", numeric_size=34, order=12),
            SizeCreate(name="36", numeric_size=36, order=13),
            SizeCreate(name="38", numeric_size=38, order=14),
            SizeCreate(name="40", numeric_size=40, order=15),
            SizeCreate(name="42", numeric_size=42, order=16),
            SizeCreate(name="44", numeric_size=44, order=17),
            SizeCreate(name="46", numeric_size=46, order=18),
            SizeCreate(name="48", numeric_size=48, order=19),
        ]
        
        created_sizes = create_sizes_bulk(db, sizes_data)
        print(f"✅ Creados {len(created_sizes)} talles")
        
        print(f"\n🎉 Todos los datos inicializados exitosamente!")
        print(f"   - Roles por defecto (admin, manager, employee, user)")
        print(f"   - {len(created_colors)} colores")
        print(f"   - {len(created_categories)} categorías") 
        print(f"   - {len(created_sizes)} talles")
        

        # === USUARIO ADMIN INICIAL ===

        print("\n👤 Creando usuario admin inicial...")

        admin_user_data = UserCreate(
            email="jonicorrea1992@gmail.com",
            uid="NDXokx50A5QpVyg1saO4bP669An2",
            is_active=True
        )
        admin_role = "admin"

        created_user = create_user_with_role(db, admin_user_data, admin_role)
        print(f"✅ Usuario admin creado: {created_user.email} (role: {admin_role})")
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_complete_data()
