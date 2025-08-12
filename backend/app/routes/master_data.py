"""
Rutas para datos maestros: colores, categorías y talles.
Estos endpoints proveen los datos de referencia para el frontend.
"""
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.session import get_session
from app.controllers.master_data_controller import (
    get_all_colors, get_all_categories, get_all_sizes, get_categories_with_stock
)
from app.models.master_data import ColorRead, CategoryRead, SizeRead
from typing import List

router = APIRouter()


@router.get("/colors", response_model=List[ColorRead], tags=["Master Data"])
def get_colors(db: Session = Depends(get_session)):
    """
    Obtener todos los colores activos.
    Estos se usan en los comboboxes del frontend.
    """
    return get_all_colors(db)


@router.get("/categories", response_model=List[CategoryRead], tags=["Master Data"])
def get_categories(db: Session = Depends(get_session)):
    """
    Obtener todas las categorías activas.
    Estas se usan en los comboboxes del frontend.
    """
    return get_all_categories(db)


@router.get("/categories/with-stock", response_model=List[CategoryRead], tags=["Master Data"])
def get_categories_with_available_stock(db: Session = Depends(get_session)):
    """
    Obtener solo las categorías que tienen productos con stock disponible.
    Este endpoint es para el navbar y menús públicos.
    """
    return get_categories_with_stock(db)


@router.get("/sizes", response_model=List[SizeRead], tags=["Master Data"])
def get_sizes(db: Session = Depends(get_session)):
    """
    Obtener todos los talles activos ordenados correctamente.
    Estos se usan en los comboboxes del frontend.
    """
    return get_all_sizes(db)
