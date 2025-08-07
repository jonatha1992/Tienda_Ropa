
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.product import (
    Product, ProductCreate, ProductRead, ProductImage, ProductVariant, ProductImageRead, ProductVariantRead
)
from app.security import get_current_user, require_manager_or_admin

router = APIRouter()

@router.post("/products/", response_model=ProductRead)
def create_product(
    session: Session = Depends(get_session), 
    product: ProductCreate = Body(...), 
    user=Depends(require_manager_or_admin())
):
    # Separate the main product data from the related images and variants
    product_data = product.model_dump(exclude={'images', 'variants', 'color', 'talle', 'stock'})
    db_product = Product(**product_data)

    # Create ProductImage objects and link them to the product
    db_product.images = [ProductImage(image_url=url) for url in product.images]
    
    # Handle variants based on product type
    if product.is_unique_product:
        # For unique products, create a single variant from the direct fields
        if product.color is not None or product.talle is not None or product.stock is not None:
            db_product.variants = [ProductVariant(
                color=product.color, 
                talle=product.talle, 
                stock=product.stock or 0
        if product.color is not None and product.talle is not None and product.stock is not None:
            db_product.variants = [ProductVariant(
                color=product.color, 
                talle=product.talle, 
                stock=product.stock
            )]
        else:
            raise HTTPException(
                status_code=400,
                detail="For unique products, color, talle, and stock must all be provided."
            )
    else:
        # For regular products, create variants from the variants list
        if product.variants:
            db_product.variants = [ProductVariant(**variant.model_dump()) for variant in product.variants]

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
    user=Depends(require_manager_or_admin())
):
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update product fields
    product_data = product.model_dump(exclude_unset=True, exclude={'images', 'variants', 'color', 'talle', 'stock'})
    for key, value in product_data.items():
        setattr(db_product, key, value)

    # Delete old variants and images
    for variant in db_product.variants:
        session.delete(variant)
    for image in db_product.images:
        session.delete(image)

    # Create new images
    db_product.images = [ProductImage(image_url=url) for url in product.images]
    
    # Handle variants based on product type
    if product.is_unique_product:
        # For unique products, create a single variant from the direct fields
        if product.color is not None or product.talle is not None or product.stock is not None:
            db_product.variants = [ProductVariant(
                color=product.color, 
                talle=product.talle, 
                stock=product.stock or 0
            )]
    else:
        # For regular products, create variants from the variants list
        if product.variants:
            db_product.variants = [ProductVariant(**variant.model_dump()) for variant in product.variants]

    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session), user=Depends(require_manager_or_admin())):
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
