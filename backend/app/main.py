from fastapi import FastAPI
from app.routes.products import router as products_router
from app.routes.customers import router as customers_router
from app.routes.orders import router as orders_router
from app.routes.inventory import router as inventory_router
from app.routes.order_items import router as order_items_router

app = FastAPI()
app.include_router(products_router, prefix="/api/v1")
app.include_router(customers_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(inventory_router, prefix="/api/v1")
app.include_router(order_items_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}
