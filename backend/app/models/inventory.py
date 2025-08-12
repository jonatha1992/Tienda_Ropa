

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from pydantic import field_validator

class Inventory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    quantity: int = Field(ge=0)  # Cantidad debe ser >= 0
    last_update: Optional[datetime] = None

    @field_validator('last_update', mode='before')
    @classmethod
    def parse_datetime(cls, v):
        if isinstance(v, str):
            return datetime.fromisoformat(v.replace('Z', '+00:00'))
        return v
