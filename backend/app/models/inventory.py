

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Inventory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    quantity: int
    last_update: Optional[datetime] = None
