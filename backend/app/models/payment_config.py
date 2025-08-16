"""
Modelo para configuración de métodos de pago y opciones de entrega.
Permite almacenar configuraciones flexibles en formato JSON.
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class PaymentConfig(SQLModel, table=True):
    """
    Configuraciones para métodos de pago y entrega
    
    Ejemplos de uso:
    - config_type="bank_account", config_name="main_account"
    - config_type="delivery_zones", config_name="caba_zone" 
    - config_type="email_templates", config_name="success_template"
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    config_type: str = Field(description="Tipo de configuración: bank_account, delivery_zones, email_templates")
    config_name: str = Field(description="Nombre específico de la configuración")
    config_data: str = Field(description="JSON con los datos de configuración")
    is_active: bool = Field(default=True, description="Si la configuración está activa")
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    updated_at: Optional[datetime] = None