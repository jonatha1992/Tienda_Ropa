"""
Modelos para datos maestros: colores, categorías y talles.
Estos son datos de referencia que se usan en toda la aplicación.
"""
from sqlmodel import SQLModel, Field
from typing import Optional


class ColorBase(SQLModel):
    name: str = Field(max_length=50, unique=True, index=True)
    hex_code: Optional[str] = Field(default=None, max_length=7)  # Ejemplo: #FF0000
    is_active: bool = Field(default=True)


class Color(ColorBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class ColorRead(ColorBase):
    id: int


class ColorCreate(ColorBase):
    pass


class CategoryBase(SQLModel):
    name: str = Field(max_length=100, unique=True, index=True)
    description: Optional[str] = Field(default=None, max_length=500)
    is_active: bool = Field(default=True)


class Category(CategoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class CategoryRead(CategoryBase):
    id: int


class CategoryCreate(CategoryBase):
    pass


class SizeBase(SQLModel):
    name: str = Field(max_length=10, unique=True, index=True)  # XS, S, M, L, etc.
    numeric_size: Optional[int] = Field(default=None)  # 85, 90, 95, etc.
    order: int = Field(default=0)  # Para ordenar correctamente: XS=1, S=2, M=3, etc.
    is_active: bool = Field(default=True)


class Size(SizeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class SizeRead(SizeBase):
    id: int


class SizeCreate(SizeBase):
    pass
