

from sqlmodel import SQLModel, Field
from typing import Optional

class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: Optional[str] = Field(default=None, index=True)
    phone: Optional[str] = None
    address: Optional[str] = None
