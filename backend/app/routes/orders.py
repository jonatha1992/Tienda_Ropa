from fastapi import APIRouter

router = APIRouter()


@router.get("/orders")
def list_orders():
    return {"message": "List of orders"}


@router.post("/orders")
def create_order():
    return {"message": "Order created"}


@router.get("/orders/{order_id}")
def get_order(order_id: int):
    return {"message": f"Order {order_id}"}


@router.put("/orders/{order_id}")
def update_order(order_id: int):
    return {"message": f"Order {order_id} updated"}


@router.delete("/orders/{order_id}")
def delete_order(order_id: int):
    return {"message": f"Order {order_id} deleted"}
