from fastapi import APIRouter

router = APIRouter()


@router.get("/customers")
def list_customers():
    return {"message": "List of customers"}


@router.post("/customers")
def create_customer():
    return {"message": "Customer created"}


@router.get("/customers/{customer_id}")
def get_customer(customer_id: int):
    return {"message": f"Customer {customer_id}"}


@router.put("/customers/{customer_id}")
def update_customer(customer_id: int):
    return {"message": f"Customer {customer_id} updated"}


@router.delete("/customers/{customer_id}")
def delete_customer(customer_id: int):
    return {"message": f"Customer {customer_id} deleted"}
