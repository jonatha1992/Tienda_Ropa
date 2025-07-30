from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.inventory import Inventory

router = APIRouter()


@router.post("/inventory/", response_model=Inventory)
def create_inventory(*, session: Session = Depends(get_session), inventory: Inventory):
    db_inventory = Inventory.from_orm(inventory)
    session.add(db_inventory)
    session.commit()
    session.refresh(db_inventory)
    return db_inventory


@router.get("/inventory/", response_model=List[Inventory])
def read_inventory(
    *, session: Session = Depends(get_session), skip: int = 0, limit: int = 100
):
    inventory = session.exec(select(Inventory).offset(skip).limit(limit)).all()
    return inventory


@router.get("/inventory/{inventory_id}", response_model=Inventory)
def read_inventory_item(*, session: Session = Depends(get_session), inventory_id: int):
    inventory_item = session.get(Inventory, inventory_id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return inventory_item


@router.put("/inventory/{inventory_id}", response_model=Inventory)
def update_inventory(
    *, session: Session = Depends(get_session), inventory_id: int, inventory: Inventory
):
    db_inventory = session.get(Inventory, inventory_id)
    if not db_inventory:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    inventory_data = inventory.dict(exclude_unset=True)
    for key, value in inventory_data.items():
        setattr(db_inventory, key, value)
    session.add(db_inventory)
    session.commit()
    session.refresh(db_inventory)
    return db_inventory


@router.delete("/inventory/{inventory_id}")
def delete_inventory(*, session: Session = Depends(get_session), inventory_id: int):
    inventory_item = session.get(Inventory, inventory_id)
    if not inventory_item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    session.delete(inventory_item)
    session.commit()
    return {"ok": True}