from typing import List

from fastapi import APIRouter, Depends, HTTPException
from fastapi import Body
from app.core.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.inventory import Inventory
from app.models.product import Product

router = APIRouter()


@router.post("/inventory/", response_model=Inventory)
def create_inventory(session: Session = Depends(get_session), inventory: Inventory = Body(...), user=Depends(get_current_user)):
    # Verificar que el producto existe
    product = session.get(Product, inventory.product_id)
    if not product:
        raise HTTPException(status_code=422, detail="Product not found")
    
    db_inventory = Inventory.model_validate(inventory)
    session.add(db_inventory)
    session.commit()
    session.refresh(db_inventory)
    return db_inventory


@router.get("/inventory/", response_model=List[Inventory])
def read_inventory(
    *, session: Session = Depends(get_session), skip: int = 0, limit: int = 100, user=Depends(get_current_user)
):
    inventory = session.exec(select(Inventory).offset(skip).limit(limit)).all()
    return inventory


@router.get("/inventory/{inventory_id}", response_model=Inventory)
def read_inventory_item(*, session: Session = Depends(get_session), inventory_id: int, user=Depends(get_current_user)):
    inventory_item = session.get(Inventory, inventory_id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return inventory_item


@router.put("/inventory/{inventory_id}", response_model=Inventory)
def update_inventory(
    inventory_id: int, session: Session = Depends(get_session), inventory: Inventory = Body(...), user=Depends(get_current_user)
):
    db_inventory = session.get(Inventory, inventory_id)
    if not db_inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    inventory_data = inventory.model_dump(exclude_unset=True)
    for key, value in inventory_data.items():
        setattr(db_inventory, key, value)
    session.add(db_inventory)
    session.commit()
    session.refresh(db_inventory)
    return db_inventory


@router.delete("/inventory/{inventory_id}")
def delete_inventory(*, session: Session = Depends(get_session), inventory_id: int, user=Depends(get_current_user)):
    inventory_item = session.get(Inventory, inventory_id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    session.delete(inventory_item)
    session.commit()
    return {"ok": True}
