from typing import List

from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.order_item import OrderItem
from app.models.order import Order
from app.routes.inventory import reduce_stock

router = APIRouter()


from pydantic import ValidationError

@router.post("/order-items/", response_model=OrderItem)
def create_order_item(*, session: Session = Depends(get_session), order_item: OrderItem, user=Depends(get_current_user)):
    # Check if order exists
    order = session.get(Order, order_item.order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order with id {order_item.order_id} not found")

    # Verificar stock antes de crear el order item
    stock_available = reduce_stock(order_item.product_id, order_item.quantity, session)
    
    if not stock_available:
        raise HTTPException(
            status_code=400, 
            detail=f"Stock insuficiente para el producto {order_item.product_id}. Cantidad solicitada: {order_item.quantity}"
        )
    
    try:
        db_order_item = OrderItem.model_validate(order_item)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())

    session.add(db_order_item)
    session.commit()
    session.refresh(db_order_item)
    
    print(f"✅ Order item creado y stock reducido: Producto {order_item.product_id}, Cantidad: {order_item.quantity}")
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
    *, session: Session = Depends(get_session), order_item_id: int, order_item: OrderItem, user=Depends(get_current_user)
):
    db_order_item = session.get(OrderItem, order_item_id)
    if not db_order_item:
        raise HTTPException(status_code=404, detail="Order item not found")
    order_item_data = order_item.model_dump(exclude_unset=True)
    for key, value in order_item_data.items():
        setattr(db_order_item, key, value)
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