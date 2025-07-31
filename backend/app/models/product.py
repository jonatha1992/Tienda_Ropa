
from typing import Optional
from sqlmodel import SQLModel, Field

class ProductCreate(SQLModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: Optional[int] = None
    image_url: Optional[str] = None
    color: Optional[str] = None
    talle: Optional[str] = None
    genero: Optional[str] = "unisex"
    estado: Optional[str] = "nuevo"
    edad_destino: Optional[str] = "adulto"

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    price: float
    stock: Optional[int] = None
    image_url: Optional[str] = None
    color: Optional[str] = None  # Color del producto
    talle: Optional[str] = None  # Talle (tamaño)
    genero: Optional[str] = Field(default="unisex")  # masculino, femenino, unisex
    estado: Optional[str] = Field(default="nuevo")  # nuevo, usado
    edad_destino: Optional[str] = Field(default="adulto")  # niño, adulto


