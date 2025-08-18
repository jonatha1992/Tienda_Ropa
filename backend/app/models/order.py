
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    status: Optional[str] = None
    total: float
    created_at: Optional[datetime] = None
    
    # Payment fields
    payment_method: str = Field(default="transfer", max_length=20)
    payment_status: str = Field(default="pending", max_length=20)
    mercadopago_payment_id: Optional[str] = Field(default=None)
    mercadopago_preference_id: Optional[str] = Field(default=None)
    
    # Campos para TRANSFERENCIA
    bank_account_info: Optional[str] = Field(default=None, description="JSON con datos bancarios mostrados")
    transfer_receipt_url: Optional[str] = Field(default=None, description="URL del comprobante subido")
    transfer_verified: Optional[bool] = Field(default=None, description="Si admin verificó la transferencia")
    transfer_verification_date: Optional[datetime] = Field(default=None)
    
    # Campos para EFECTIVO
    delivery_cost: Optional[float] = Field(default=None, description="Costo de envío calculado")
    delivery_zone: Optional[str] = Field(default=None, description="Zona de entrega")
    delivery_scheduled_date: Optional[datetime] = Field(default=None, description="Fecha programada")
    delivery_time_slot: Optional[str] = Field(default=None, description="Horario: mañana, tarde")
    delivery_status: Optional[str] = Field(default=None, description="pending, scheduled, in_transit, delivered")
    delivery_notes: Optional[str] = Field(default=None, description="Notas del delivery")
    
    # Campos ADMIN generales
    admin_notes: Optional[str] = Field(default=None, description="Notas del administrador")
    verification_required: bool = Field(default=False, description="Si requiere verificación manual")
    verified_by_admin: Optional[bool] = Field(default=None, description="Si admin verificó")
    admin_verification_date: Optional[datetime] = Field(default=None)
