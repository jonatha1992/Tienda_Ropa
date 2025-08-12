"""
Controladores para gestión de datos maestros: colores, categorías y talles.
"""
from sqlmodel import Session, select
from app.models.master_data import Color, Category, Size, ColorCreate, CategoryCreate, SizeCreate
from app.models.product import Product, ProductVariant
from typing import List, Optional


# === COLORES ===
def get_all_colors(db: Session, include_inactive: bool = False) -> List[Color]:
    """Obtener todos los colores."""
    query = select(Color)
    if not include_inactive:
        query = query.where(Color.is_active == True)
    return db.exec(query.order_by(Color.name)).all()


def get_color_by_id(db: Session, color_id: int) -> Optional[Color]:
    """Obtener color por ID."""
    return db.get(Color, color_id)


def get_color_by_name(db: Session, name: str) -> Optional[Color]:
    """Obtener color por nombre."""
    return db.exec(select(Color).where(Color.name == name)).first()


def create_color(db: Session, color: ColorCreate) -> Color:
    """Crear nuevo color."""
    db_color = Color.model_validate(color)
    db.add(db_color)
    db.commit()
    db.refresh(db_color)
    return db_color


def create_colors_bulk(db: Session, colors: List[ColorCreate]) -> List[Color]:
    """Crear múltiples colores en lote."""
    created_colors = []
    for color in colors:
        # Verificar si ya existe
        existing = get_color_by_name(db, color.name)
        if not existing:
            db_color = Color.model_validate(color)
            db.add(db_color)
            created_colors.append(db_color)
    
    db.commit()
    for color in created_colors:
        db.refresh(color)
    
    return created_colors


# === CATEGORÍAS ===
def get_all_categories(db: Session, include_inactive: bool = False) -> List[Category]:
    """Obtener todas las categorías."""
    query = select(Category)
    if not include_inactive:
        query = query.where(Category.is_active == True)
    return db.exec(query.order_by(Category.name)).all()


def get_category_by_id(db: Session, category_id: int) -> Optional[Category]:
    """Obtener categoría por ID."""
    return db.get(Category, category_id)


def get_category_by_name(db: Session, name: str) -> Optional[Category]:
    """Obtener categoría por nombre."""
    return db.exec(select(Category).where(Category.name == name)).first()


def create_category(db: Session, category: CategoryCreate) -> Category:
    """Crear nueva categoría."""
    db_category = Category.model_validate(category)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def create_categories_bulk(db: Session, categories: List[CategoryCreate]) -> List[Category]:
    """Crear múltiples categorías en lote."""
    created_categories = []
    for category in categories:
        # Verificar si ya existe
        existing = get_category_by_name(db, category.name)
        if not existing:
            db_category = Category.model_validate(category)
            db.add(db_category)
            created_categories.append(db_category)
    
    db.commit()
    for category in created_categories:
        db.refresh(category)
    
    return created_categories


def get_categories_with_stock(db: Session) -> List[Category]:
    """
    Obtener categorías que tienen productos con stock disponible.
    Solo devuelve categorías que tienen al menos un producto con stock > 0.
    """
    try:
        # Obtener todas las categorías activas
        all_categories = db.exec(select(Category).where(Category.is_active == True)).all()
        
        # Si no hay categorías, devolver lista vacía
        if not all_categories:
            return []
        
        # Filtrar categorías que tienen productos con stock
        categories_with_stock = []
        
        for category in all_categories:
            # Buscar productos de esta categoría
            products = db.exec(
                select(Product).where(Product.categoria == category.name)
            ).all()
            
            # Si no hay productos en esta categoría, continuar
            if not products:
                continue
            
            # Verificar si algún producto tiene stock
            has_stock = False
            for product in products:
                try:
                    if product.is_unique:
                        # Para productos únicos, verificar stock directo
                        if product.stock and product.stock > 0:
                            has_stock = True
                            break
                    else:
                        # Para productos con variantes, verificar stock en variantes
                        variants = db.exec(
                            select(ProductVariant).where(ProductVariant.product_id == product.id)
                        ).all()
                        if variants and any(variant.stock > 0 for variant in variants):
                            has_stock = True
                            break
                except Exception:
                    # Si hay error con un producto específico, continuar con el siguiente
                    continue
            
            if has_stock:
                categories_with_stock.append(category)
        
        return sorted(categories_with_stock, key=lambda c: c.name)
    
    except Exception:
        # En caso de error, devolver lista vacía en lugar de fallar
        return []


# === TALLES ===
def get_all_sizes(db: Session, include_inactive: bool = False) -> List[Size]:
    """Obtener todos los talles."""
    query = select(Size)
    if not include_inactive:
        query = query.where(Size.is_active == True)
    return db.exec(query.order_by(Size.order, Size.name)).all()


def get_size_by_id(db: Session, size_id: int) -> Optional[Size]:
    """Obtener talle por ID."""
    return db.get(Size, size_id)


def get_size_by_name(db: Session, name: str) -> Optional[Size]:
    """Obtener talle por nombre."""
    return db.exec(select(Size).where(Size.name == name)).first()


def create_size(db: Session, size: SizeCreate) -> Size:
    """Crear nuevo talle."""
    db_size = Size.model_validate(size)
    db.add(db_size)
    db.commit()
    db.refresh(db_size)
    return db_size


def create_sizes_bulk(db: Session, sizes: List[SizeCreate]) -> List[Size]:
    """Crear múltiples talles en lote."""
    created_sizes = []
    for size in sizes:
        # Verificar si ya existe
        existing = get_size_by_name(db, size.name)
        if not existing:
            db_size = Size.model_validate(size)
            db.add(db_size)
            created_sizes.append(db_size)
    
    db.commit()
    for size in created_sizes:
        db.refresh(size)
    
    return created_sizes
