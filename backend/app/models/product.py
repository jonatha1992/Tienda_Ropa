from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class ProductBase(SQLModel):
    name: str
    description: Optional[str] = None
    price: float
    genero: Optional[str] = "unisex"
    estado: Optional[str] = "nuevo"
    edad_destino: Optional[str] = "adulto"

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    images: List["ProductImage"] = Relationship(back_populates="product")
    variants: List["ProductVariant"] = Relationship(back_populates="product")

class ProductImage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    image_url: str
    
    product: Product = Relationship(back_populates="images")

class ProductVariant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    color: Optional[str] = None
    talle: Optional[str] = None
    stock: int
    
    product: Product = Relationship(back_populates="variants")

class ProductCreate(ProductBase):
    images: List[str]  # List of image URLs
    variants: List["ProductVariantCreate"]

class ProductVariantCreate(SQLModel):
    color: Optional[str] = None
    talle: Optional[str] = None
    stock: int


class ProductImageRead(SQLModel):
    id: int
    image_url: str

class ProductVariantRead(SQLModel):
    id: int
    color: Optional[str]
    talle: Optional[str]
    stock: int

class ProductRead(ProductBase):
    id: int
    images: List["ProductImageRead"]
    variants: List["ProductVariantRead"]