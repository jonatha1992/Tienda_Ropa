from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.product import Product

router = APIRouter()


@router.post("/products/", response_model=Product)
def create_product(*, session: Session = Depends(get_session), product: Product):
    db_product = Product.from_orm(product)
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


@router.get("/products/", response_model=List[Product])
def read_products(
    *, session: Session = Depends(get_session), skip: int = 0, limit: int = 100
):
    products = session.exec(select(Product).offset(skip).limit(limit)).all()
    return products


@router.get("/products/{product_id}", response_model=Product)
def read_product(*, session: Session = Depends(get_session), product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/products/{product_id}", response_model=Product)
def update_product(
    *, session: Session = Depends(get_session), product_id: int, product: Product
):
    db_product = session.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_data = product.dict(exclude_unset=True)
    for key, value in product_data.items():
        setattr(db_product, key, value)
    session.add(db_product)
    session.commit()
    session.refresh(db_product)
    return db_product


@router.delete("/products/{product_id}")
def delete_product(*, session: Session = Depends(get_session), product_id: int):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(product)
    session.commit()
    return {"ok": True}