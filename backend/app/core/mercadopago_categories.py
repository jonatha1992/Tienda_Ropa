"""
Mapeo de categorías internas a categorías oficiales de MercadoPago
https://www.mercadopago.com.ar/developers/en/reference/preferences/_checkout_preferences/post

Este módulo ayuda a mejorar la tasa de aprobación de pagos enviando
categorías correctas según las recomendaciones de MercadoPago.
"""
from typing import Optional, Tuple

# Mapeo de categorías internas a categorías válidas de MercadoPago
MERCADOPAGO_CATEGORY_MAPPING = {
    # Ropa y accesorios de moda
    "remeras": "fashion_clothes",
    "camisas": "fashion_clothes", 
    "pantalones": "fashion_clothes",
    "vestidos": "fashion_clothes",
    "buzos": "fashion_clothes",
    "camperas": "fashion_clothes",
    "jeans": "fashion_clothes",
    "polleras": "fashion_clothes",
    "shorts": "fashion_clothes",
    "sweaters": "fashion_clothes",
    
    # Accesorios de moda
    "accesorios": "fashion_accessories",
    "carteras": "fashion_accessories",
    "cinturones": "fashion_accessories",
    "joyas": "fashion_accessories",
    "relojes": "fashion_accessories",
    "lentes": "fashion_accessories",
    "gorros": "fashion_accessories",
    "bufandas": "fashion_accessories",
    
    # Calzado
    "calzado": "fashion_shoes",
    "zapatillas": "fashion_shoes",
    "botas": "fashion_shoes",
    "zapatos": "fashion_shoes",
    "sandalias": "fashion_shoes",
    "ojotas": "fashion_shoes",
    
    # Ropa interior y deportiva
    "ropa_interior": "fashion_clothes",
    "deportivo": "fashion_clothes",
    "trajes_baño": "fashion_clothes",
    
    # Fallback por defecto
    "default": "others"
}


def get_mercadopago_category(categoria_interna: Optional[str]) -> str:
    """
    Convierte una categoría interna del sistema a una categoría válida de MercadoPago.
    
    Args:
        categoria_interna: La categoría del producto en el sistema interno
        
    Returns:
        str: Categoría válida para MercadoPago
        
    Examples:
        >>> get_mercadopago_category("remeras")
        "fashion_clothes"
        >>> get_mercadopago_category("carteras")
        "fashion_accessories"
        >>> get_mercadopago_category("categoria_inexistente")
        "others"
    """
    if not categoria_interna:
        return "others"
    
    # Normalizar la categoría (minúsculas, sin espacios extra)
    categoria_normalizada = categoria_interna.lower().strip()
    
    return MERCADOPAGO_CATEGORY_MAPPING.get(categoria_normalizada, "others")


def split_customer_name(customer_name: str) -> Tuple[str, str]:
    """
    Divide un nombre completo en first_name y last_name para MercadoPago.
    
    MercadoPago requiere nombres separados para mejorar la tasa de aprobación.
    
    Args:
        customer_name: Nombre completo del cliente
        
    Returns:
        Tuple[str, str]: (first_name, last_name)
        
    Examples:
        >>> split_customer_name("Juan Pérez García")
        ("Juan", "Pérez García")
        >>> split_customer_name("María")
        ("María", "")
        >>> split_customer_name("")
        ("", "")
    """
    if not customer_name or not customer_name.strip():
        return "", ""
    
    # Dividir solo en el primer espacio para preservar apellidos compuestos
    name_parts = customer_name.strip().split(' ', 1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    
    return first_name, last_name


def get_product_description(product_name: str, categoria: Optional[str] = None) -> str:
    """
    Genera una descripción optimizada para MercadoPago.
    
    Args:
        product_name: Nombre del producto
        categoria: Categoría del producto
        
    Returns:
        str: Descripción optimizada para MercadoPago
    """
    if not product_name:
        return "Producto de ropa vintage"
    
    # Si hay categoría, usarla en la descripción
    if categoria:
        categoria_clean = categoria.replace("_", " ").title()
        return f"{product_name} - {categoria_clean} de calidad premium"
    
    return f"{product_name} - Ropa vintage de calidad premium"