from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.products import router as products_router
from app.routes.customers import router as customers_router
from app.routes.orders import router as orders_router
from app.routes.inventory import router as inventory_router
from app.routes.order_items import router as order_items_router
from app.routes.users import router as users_router
from app.routes.roles import router as roles_router

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Allows your frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(products_router, prefix="/api/v1")
app.include_router(customers_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")
app.include_router(inventory_router, prefix="/api/v1")
app.include_router(order_items_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(roles_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}
