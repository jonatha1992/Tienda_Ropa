from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi import Body
from app.core.security import get_current_user
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.inventory import Inventory
from app.models.product import Product

router = APIRouter()


from pydantic import ValidationError

@router.post("/inventory/", response_model=Inventory)
def create_inventory(session: Session = Depends(get_session), inventory: Inventory = Body(...), user=Depends(get_current_user)):
    # Verificar que el producto existe
    product = session.get(Product, inventory.product_id)
    if not product:
        raise HTTPException(status_code=422, detail="Product not found")
    
    try:
        db_inventory = Inventory.model_validate(inventory)
    except ValidationError as e:
        # Convert validation errors to JSON serializable format
        error_details = []
        for error in e.errors():
            error_dict = {
                "type": error.get("type"),
                "loc": error.get("loc"),
                "msg": error.get("msg"),
                "input": error.get("input")
            }
            error_details.append(error_dict)
        raise HTTPException(status_code=422, detail=error_details)
        
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


def reduce_stock(product_id: int, quantity: int, session: Session) -> bool:
    """
    Reduce el stock de un producto específico desde la tabla products.
    
    Args:
        product_id: ID del producto
        quantity: Cantidad a reducir
        session: Sesión de base de datos
        
    Returns:
        True si se redujo correctamente, False si no hay suficiente stock
    """
    try:
        # Buscar el producto
        product = session.get(Product, product_id)
        
        if not product:
            print(f"❌ Producto {product_id} no encontrado")
            return False
        
        # Para productos únicos, verificar stock en product.stock
        if product.is_unique:
            current_stock = product.stock or 0
            
            if current_stock < quantity:
                print(f"❌ Stock insuficiente para producto único {product_id}. Disponible: {current_stock}, Solicitado: {quantity}")
                return False
            
            # Reducir el stock del producto único
            product.stock = current_stock - quantity
            session.add(product)
            session.commit()
            
            print(f"✅ Stock reducido para producto único {product_id}: -{quantity}. Stock restante: {product.stock}")
            return True
            
        else:
            # Para productos con variantes, necesitamos más información
            # Por ahora, busquemos si hay inventario general
            inventory_item = session.exec(
                select(Inventory).where(Inventory.product_id == product_id)
            ).first()
            
            if not inventory_item:
                # Si no existe inventario, verificar stock total de variants
                total_variant_stock = sum(variant.stock for variant in product.variants)
                if total_variant_stock < quantity:
                    print(f"❌ Stock insuficiente en variantes para producto {product_id}. Disponible: {total_variant_stock}, Solicitado: {quantity}")
                    return False
                else:
                    # Crear registro de inventario para seguimiento futuro
                    inventory_item = Inventory(
                        product_id=product_id,
                        quantity=total_variant_stock - quantity,
                        last_update=datetime.now()
                    )
                    session.add(inventory_item)
                    session.commit()
                    print(f"✅ Stock reducido para producto con variantes {product_id}: -{quantity}. Inventario creado: {inventory_item.quantity}")
                    return True
            else:
                # Si existe inventario, usar esa lógica
                if inventory_item.quantity < quantity:
                    print(f"❌ Stock insuficiente para producto {product_id}. Disponible: {inventory_item.quantity}, Solicitado: {quantity}")
                    return False
                
                # Reducir el stock
                inventory_item.quantity -= quantity
                inventory_item.last_update = datetime.now()
                session.add(inventory_item)
                session.commit()
                
                print(f"✅ Stock reducido para producto {product_id}: -{quantity}. Stock restante: {inventory_item.quantity}")
                return True
        
    except Exception as e:
        print(f"❌ Error reduciendo stock para producto {product_id}: {str(e)}")
        session.rollback()
        return False
