from typing import List

from fastapi import APIRouter, Depends, HTTPException
from app.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.order_item import OrderItem

router = APIRouter()


@router.post("/order-items/", response_model=OrderItem)
def create_order_item(*, session: Session = Depends(get_session), order_item: OrderItem, user=Depends(get_current_user)):
    db_order_item = OrderItem.from_orm(order_item)
    session.add(db_order_item)
    session.commit()
    session.refresh(db_order_item)
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
    order_item_data = order_item.dict(exclude_unset=True)
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