
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class PaymentMethod(str, Enum):
    TRANSFER = "transfer"
    MERCADOPAGO = "mercadopago"
    CASH = "cash"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PENDING_PAYMENT = "pending_payment"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    status: Optional[str] = None
    total: float
    created_at: Optional[datetime] = None
    
    # Payment fields
    payment_method: PaymentMethod = Field(default=PaymentMethod.TRANSFER)
    payment_status: PaymentStatus = Field(default=PaymentStatus.PENDING)
    mercadopago_payment_id: Optional[str] = Field(default=None)
    mercadopago_preference_id: Optional[str] = Field(default=None)
