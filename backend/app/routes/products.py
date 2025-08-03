
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.product import (
    Product, ProductCreate, ProductRead, ProductImage, ProductVariant
)
from app.security import get_current_user

router = APIRouter()

@router.post("/products/", response_model=ProductRead)
def create_product(
    session: Session = Depends(get_session), 
    product: ProductCreate = Body(...), 
    user=Depends(get_current_user)
):
    # Create Product instance
    db_product = Product.from_orm(product)
    session.add(db_product)
    session.commit()
    session.refresh(db_product)

    # Create ProductImage instances
    for image_url in product.images:
        db_image = ProductImage(product_id=db_product.id, image_url=image_url)
        session.add(db_image)

    # Create ProductVariant instances
    for variant_data in product.variants:
        db_variant = ProductVariant(product_id=db_product.id, **variant_data.dict())
        session.add(db_variant)

    session.commit()
    session.refresh(db_product)
    
    return db_product

@router.get("/products/", response_model=List[ProductRead])
def read_products(session: Session = Depends(get_session), skip: int = 0, limit: int = 100):
    products = session.exec(select(Product).offset(skip).limit(limit)).all()
    return products

@router.get("/products/{product_id}", response_model=ProductRead)
def read_product(product_id: int, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/products/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int, 
    session: Session = Depends(get_session), 
    product: ProductCreate = Body(...), 
    user=Depends(get_current_user)
):
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update product fields
    product_data = product.dict(exclude_unset=True)
    for key, value in product_data.items():
        if hasattr(db_product, key):
            setattr(db_product, key, value)
    
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, session: Session = Depends(get_session), user=Depends(get_current_user)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}
