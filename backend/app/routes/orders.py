from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi import Body
from app.core.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.order import Order, PaymentMethod, PaymentStatus
from app.models.customer import Customer
from app.controllers.payments_controller import payments_controller

router = APIRouter()


@router.post("/orders/")
def create_order(session: Session = Depends(get_session), order: Order = Body(...), user=Depends(get_current_user)):
    # Verificar que el customer existe
    customer = session.get(Customer, order.customer_id)
    if not customer:
        raise HTTPException(status_code=422, detail="Customer not found")
    
    # Crear la orden con estado inicial según método de pago
    db_order = Order.model_validate(order)
    
    # Establecer estado inicial según método de pago
    if db_order.payment_method == PaymentMethod.MERCADOPAGO:
        db_order.payment_status = PaymentStatus.PENDING_PAYMENT
    else:
        db_order.payment_status = PaymentStatus.PENDING
    
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    
    # Si es MercadoPago, crear preferencia automáticamente
    response = {"order": db_order}
    if db_order.payment_method == PaymentMethod.MERCADOPAGO:
        try:
            preference_data = payments_controller.create_preference(db_order.id, session)
            response["payment_preference"] = preference_data
        except Exception as e:
            # Si falla la creación de preferencia, mantener la orden pero informar el error
            response["payment_error"] = str(e)
    
    return response


@router.get("/orders/", response_model=List[Order])
def read_orders(
    *, session: Session = Depends(get_session), skip: int = 0, limit: int = 100, user=Depends(get_current_user)
):
    orders = session.exec(select(Order).offset(skip).limit(limit)).all()
    return orders


@router.get("/orders/{order_id}", response_model=Order)
def read_order(*, session: Session = Depends(get_session), order_id: int, user=Depends(get_current_user)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/orders/{order_id}", response_model=Order)
def update_order(
    order_id: int, session: Session = Depends(get_session), order: Order = Body(...), user=Depends(get_current_user)
):
    db_order = session.get(Order, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    order_data = order.model_dump(exclude_unset=True)
    for key, value in order_data.items():
        setattr(db_order, key, value)
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order


@router.delete("/orders/{order_id}")
def delete_order(*, session: Session = Depends(get_session), order_id: int, user=Depends(get_current_user)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    session.delete(order)
    session.commit()
    return {"ok": True}
