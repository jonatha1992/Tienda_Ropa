from sqlmodel import SQLModel, Field
from typing import Optional
from pydantic import EmailStr

class CustomerBase(SQLModel):
    """Campos base para Customer con datos completos de entrega"""
    name: str
    first_name: Optional[str] = None      # Para MercadoPago payer.name
    last_name: Optional[str] = None       # Para MercadoPago payer.surname
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    
    # Dirección completa para entregas
    address: Optional[str] = None         # Calle y número
    city: Optional[str] = None            # Ciudad
    postal_code: Optional[str] = None     # Código postal
    province: Optional[str] = None        # Provincia/Estado
    country: Optional[str] = "AR"         # País
    
    # Datos adicionales para entrega
    address_reference: Optional[str] = None      # "Entre calles...", "Piso 2 Depto A"
    delivery_notes: Optional[str] = None         # "Portero eléctrico", "Horario 14-18"
    preferred_delivery_time: Optional[str] = None  # "mañana", "tarde", "cualquiera"

class CustomerCreate(CustomerBase):
    """Datos para crear un nuevo customer"""
    pass

class Customer(CustomerBase, table=True):
    """Customer con todos los datos de entrega"""
    id: Optional[int] = Field(default=None, primary_key=True)
    email: Optional[EmailStr] = Field(default=None, index=True)  # Mantener index en email