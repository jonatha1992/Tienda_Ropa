from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class ProductBase(SQLModel):
    name: str
    description: Optional[str] = None
    price: float
    genero: Optional[str] = "unisex"
    estado: Optional[str] = "nuevo"
    categoria: Optional[str] = None  # Nueva campo para categoría
    edad_destino: Optional[str] = "adulto"
    is_unique: bool = Field(default=False, description="True if product has only one variant combination")
    # For unique products, store the single variant attributes directly
    color: Optional[str] = None
    talle: Optional[str] = None
    stock: Optional[int] = None

class Product(ProductBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    images: List["ProductImage"] = Relationship(
        back_populates="product",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    variants: List["ProductVariant"] = Relationship(
        back_populates="product", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

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
    variants: List["ProductVariantCreate"] = Field(default_factory=list)
    
    def model_validate_unique_product(self):
        """Validate that unique products have proper attributes"""
        if self.is_unique:
            # For unique products, ensure we have the basic attributes
            if not self.color and not self.talle:
                raise ValueError("Unique products must have at least color or size specified")
            if self.stock is None:
                raise ValueError("Unique products must have stock specified")
            # Clear variants array for unique products
            self.variants = []
        else:
            # For variant products, ensure variants are provided
            if not self.variants:
                raise ValueError("Non-unique products must have at least one variant")
            # Clear individual attributes for variant products
            self.color = None
            self.talle = None
            self.stock = None

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
    
    @property
    def display_stock(self) -> int:
        """Return stock for display purposes"""
        if self.is_unique:
            return self.stock or 0
        else:
            return sum(variant.stock for variant in self.variants)