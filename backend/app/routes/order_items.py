from typing import List

from fastapi import APIRouter, Depends, HTTPException, Body
from app.core.security import get_current_user
from sqlmodel import Session, select
from pydantic import BaseModel, ValidationError

from app.db.session import get_session
from app.models.order_item import OrderItem
from app.models.order import Order
from app.routes.inventory import reduce_stock

router = APIRouter()

class OrderItemCreate(BaseModel):
    order_id: int
    product_id: int
    quantity: int
    price: float

@router.post("/order-items/", response_model=OrderItem)
def create_order_item(*, session: Session = Depends(get_session), order_item_data: OrderItemCreate = Body(...), user=Depends(get_current_user)):
    print(f"🔍 Creando OrderItem - order_id: {order_item_data.order_id}, product_id: {order_item_data.product_id}, quantity: {order_item_data.quantity}, price: {order_item_data.price}")
    
    # Con pydantic BaseModel, las validaciones ya se hacen automáticamente
    # Solo necesitamos validaciones de negocio adicionales
    
    if order_item_data.quantity <= 0:
        raise HTTPException(status_code=422, detail="quantity must be greater than 0")
    
    # Check if order exists
    order = session.get(Order, order_item_data.order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order with id {order_item_data.order_id} not found")

    # Verificar stock antes de crear el order item
    stock_available = reduce_stock(order_item_data.product_id, order_item_data.quantity, session)
    
    if not stock_available:
        raise HTTPException(
            status_code=400, 
            detail=f"Stock insuficiente para el producto {order_item_data.product_id}. Cantidad solicitada: {order_item_data.quantity}"
        )
    
    try:
        # Crear el OrderItem desde los datos validados
        db_order_item = OrderItem(
            order_id=order_item_data.order_id,
            product_id=order_item_data.product_id,
            quantity=order_item_data.quantity,
            price=order_item_data.price
        )
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

    session.add(db_order_item)
    session.commit()
    session.refresh(db_order_item)
    
    print(f"✅ Order item creado y stock reducido: Producto {order_item_data.product_id}, Cantidad: {order_item_data.quantity}")
    return db_order_item


@router.get("/order-items/", response_model=List[OrderItem])
def read_order_items(
    *, session: Session = Depends(get_session), skip: int = 0, limit: int = 100, user=Depends(get_current_user)
):
    order_items = session.exec(select(OrderItem).offset(skip).limit(limit)).all()
    return order_items


@router.get("/order-items/{order_item_id}", response_model=OrderItem)
def read_order_item(*, session: Session = Depends(get_session), order_item_id: int, user=Depends(get_current_user)):
    order_item = session.get(OrderItem, order_item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    return order_item


@router.put("/order-items/{order_item_id}", response_model=OrderItem)
def update_order_item(
    *, session: Session = Depends(get_session), order_item_id: int, order_item_data: OrderItemCreate = Body(...), user=Depends(get_current_user)
):
    db_order_item = session.get(OrderItem, order_item_id)
    if not db_order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    
    # Validar quantity
    if order_item_data.quantity <= 0:
        raise HTTPException(status_code=422, detail="quantity must be greater than 0")
    
    # Actualizar campos
    db_order_item.order_id = order_item_data.order_id
    db_order_item.product_id = order_item_data.product_id
    db_order_item.quantity = order_item_data.quantity
    db_order_item.price = order_item_data.price
    
    session.add(db_order_item)
    session.commit()
    session.refresh(db_order_item)
    return db_order_item


@router.delete("/order-items/{order_item_id}")
def delete_order_item(*, session: Session = Depends(get_session), order_item_id: int, user=Depends(get_current_user)):
    order_item = session.get(OrderItem, order_item_id)
    if not order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    session.delete(order_item)
    session.commit()
    return {"ok": True}