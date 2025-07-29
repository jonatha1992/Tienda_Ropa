from fastapi import APIRouter

router = APIRouter()


@router.get("/products")
def list_products():
    return {"message": "List of products"}


@router.post("/products")
def create_product():
    return {"message": "Product created"}


@router.get("/products/{product_id}")
def get_product(product_id: int):
    return {"message": f"Product {product_id}"}


@router.put("/products/{product_id}")
def update_product(product_id: int):
    return {"message": f"Product {product_id} updated"}


@router.delete("/products/{product_id}")
def delete_product(product_id: int):
    return {"message": f"Product {product_id} deleted"}
