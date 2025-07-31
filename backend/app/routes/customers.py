from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi import Body
from app.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.customer import Customer
from app.models.customer import CustomerCreate

router = APIRouter()


@router.post("/customers/", response_model=Customer)
def create_customer(session: Session = Depends(get_session), customer: CustomerCreate = Body(...), user=Depends(get_current_user)):
    db_customer = Customer(**customer.dict())
    session.add(db_customer)
    session.commit()
    session.refresh(db_customer)
    return db_customer


@router.get("/customers/", response_model=List[Customer])
def read_customers(session: Session = Depends(get_session), skip: int = 0, limit: int = 100, user=Depends(get_current_user)):
    customers = session.exec(select(Customer).offset(skip).limit(limit)).all()
    return customers


@router.get("/customers/{customer_id}", response_model=Customer)
def read_customer(customer_id: int, session: Session = Depends(get_session), user=Depends(get_current_user)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.put("/customers/{customer_id}", response_model=Customer)
def update_customer(
    customer_id: int, session: Session = Depends(get_session), customer: CustomerCreate = Body(...), user=Depends(get_current_user)
):
    db_customer = session.get(Customer, customer_id)
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer_data = customer.dict(exclude_unset=True)
    for key, value in customer_data.items():
        setattr(db_customer, key, value)
    session.add(db_customer)
    session.commit()
    session.refresh(db_customer)
    return db_customer


@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, session: Session = Depends(get_session), user=Depends(get_current_user)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    session.delete(customer)
    session.commit()
    return {"ok": True}