
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.product import (
    Product, ProductCreate, ProductRead, ProductImage, ProductVariant, 
    ProductImageRead, ProductVariantRead, StockCheckItem, StockCheckResponse, StockCheckResultItem
)
from app.core.security import get_current_user, require_manager_or_admin

router = APIRouter()

@router.post("/products/", response_model=ProductRead)
def create_product(
    session: Session = Depends(get_session), 
    product: ProductCreate = Body(...), 
    current_user=Depends(require_manager_or_admin())
):
    # Validate product data based on type
    try:
        product.model_validate_unique_product()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Separate the main product data from the related images and variants
    product_data = product.model_dump(exclude={'images', 'variants'})
    db_product = Product(**product_data)

    # Create ProductImage objects and link them to the product
    db_product.images = [ProductImage(image_url=url) for url in product.images]
    
    # For non-unique products, create ProductVariant objects
    if not product.is_unique:
        db_product.variants = [ProductVariant(**variant.model_dump()) for variant in product.variants]
    else:
        # For unique products, variants are empty (handled by the product attributes)
        db_product.variants = []

    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    
    return db_product

@router.get("/products/", response_model=List[ProductRead])
def read_products(session: Session = Depends(get_session), skip: int = 0, limit: int = 100):
    products = session.exec(select(Product).offset(skip).limit(limit)).all()
    return [ProductRead.model_validate(p) for p in products]

@router.get("/products/{product_id}", response_model=ProductRead)
def read_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductRead.model_validate(product)

@router.put("/products/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int, 
    session: Session = Depends(get_session), 
    product: ProductCreate = Body(...), 
    current_user=Depends(require_manager_or_admin())
):
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate product data based on type
    try:
        product.model_validate_unique_product()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    # Update product fields
    product_data = product.model_dump(exclude_unset=True, exclude={'images', 'variants'})
    for key, value in product_data.items():
        setattr(db_product, key, value)

    # Delete old variants and images
    for variant in db_product.variants:
        session.delete(variant)
    for image in db_product.images:
        session.delete(image)

    # Create new images
    db_product.images = [ProductImage(image_url=url) for url in product.images]
    
    # Create new variants only for non-unique products
    if not product.is_unique:
        db_product.variants = [ProductVariant(**variant.model_dump()) for variant in product.variants]
    else:
        db_product.variants = []

    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session), current_user=Depends(require_manager_or_admin())):
    """Eliminar un producto y todos sus datos relacionados"""
    from sqlmodel import select
    
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Primero eliminar las imágenes relacionadas
    from app.models.product import ProductImage, ProductVariant
    images = session.exec(select(ProductImage).where(ProductImage.product_id == product_id)).all()
    for image in images:
        session.delete(image)
    
    # Luego eliminar las variantes relacionadas
    variants = session.exec(select(ProductVariant).where(ProductVariant.product_id == product_id)).all()
    for variant in variants:
        session.delete(variant)
    
    # Finalmente eliminar el producto
    session.delete(product)
    session.commit()
    return {"ok": True, "message": "Product and related data deleted successfully"}

@router.post("/products/check-stock/", response_model=StockCheckResponse)
async def check_stock(
    items: List[StockCheckItem],
    session: Session = Depends(get_session)
):
    """
    Verifica el stock disponible para múltiples productos/variantes.
    
    Args:
        items: Lista de ítems a verificar, cada uno con product_id, variant_id opcional y cantidad
        
    Returns:
        StockCheckResponse: Resultado de la verificación de stock para cada ítem
    """
    results = []
    all_available = True
    
    for item in items:
        # Obtener el producto
        product = session.get(Product, item.product_id)
        if not product:
            results.append(StockCheckResultItem(
                product_id=item.product_id,
                variant_id=item.variant_id,
                available=False,
                available_stock=0,
                requested_quantity=item.quantity,
                has_enough_stock=False
            ))
            all_available = False
            continue
            
        # Verificar stock según si es producto único o con variantes
        if product.is_unique:
            # Producto único - verificar stock directo
            available_stock = product.stock or 0
            has_enough = available_stock >= item.quantity
            
            results.append(StockCheckResultItem(
                product_id=item.product_id,
                variant_id=None,
                available=available_stock > 0,
                available_stock=available_stock,
                requested_quantity=item.quantity,
                has_enough_stock=has_enough
            ))
            
            if not has_enough:
                all_available = False
                
        else:
            # Producto con variantes - verificar stock de la variante específica
            if not item.variant_id:
                # Si no se proporciona variant_id para producto con variantes, error
                results.append(StockCheckResultItem(
                    product_id=item.product_id,
                    variant_id=None,
                    available=False,
                    available_stock=0,
                    requested_quantity=item.quantity,
                    has_enough_stock=False
                ))
                all_available = False
                continue
                
            # Buscar la variante
            variant = session.get(ProductVariant, item.variant_id)
            if not variant or variant.product_id != product.id:
                results.append(StockCheckResultItem(
                    product_id=item.product_id,
                    variant_id=item.variant_id,
                    available=False,
                    available_stock=0,
                    requested_quantity=item.quantity,
                    has_enough_stock=False
                ))
                all_available = False
                continue
                
            # Verificar stock de la variante
            has_enough = variant.stock >= item.quantity
            results.append(StockCheckResultItem(
                product_id=item.product_id,
                variant_id=item.variant_id,
                available=variant.stock > 0,
                available_stock=variant.stock,
                requested_quantity=item.quantity,
                has_enough_stock=has_enough
            ))
            
            if not has_enough:
                all_available = False
    
    return StockCheckResponse(items=results, all_available=all_available)
