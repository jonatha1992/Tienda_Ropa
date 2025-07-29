from fastapi import APIRouter

router = APIRouter()


@router.get("/order-items")
def list_order_items():
    return {"message": "List of order items"}


@router.post("/order-items")
def create_order_item():
    return {"message": "Order item created"}


@router.get("/order-items/{order_item_id}")
def get_order_item(order_item_id: int):
    return {"message": f"Order item {order_item_id}"}


@router.put("/order-items/{order_item_id}")
def update_order_item(order_item_id: int):
    return {"message": f"Order item {order_item_id} updated"}


@router.delete("/order-items/{order_item_id}")
def delete_order_item(order_item_id: int):
    return {"message": f"Order item {order_item_id} deleted"}
