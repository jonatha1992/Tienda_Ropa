from fastapi import APIRouter

router = APIRouter()


@router.get("/inventory")
def list_inventory():
    return {"message": "List of inventory items"}


@router.post("/inventory")
def create_inventory():
    return {"message": "Inventory item created"}


@router.get("/inventory/{inventory_id}")
def get_inventory(inventory_id: int):
    return {"message": f"Inventory item {inventory_id}"}


@router.put("/inventory/{inventory_id}")
def update_inventory(inventory_id: int):
    return {"message": f"Inventory item {inventory_id} updated"}


@router.delete("/inventory/{inventory_id}")
def delete_inventory(inventory_id: int):
    return {"message": f"Inventory item {inventory_id} deleted"}
