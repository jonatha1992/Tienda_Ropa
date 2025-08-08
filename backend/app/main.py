from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.products import router as products_router
from app.routes.customers import router as customers_router
from app.routes.orders import router as orders_router
from app.routes.inventory import router as inventory_router
from app.routes.order_items import router as order_items_router
from app.routes.users import router as users_router
from app.routes.roles import router as roles_router
from app.routes.master_data import router as master_data_router
from app.core.config import settings

app = FastAPI(
    title="Tienda Ropa API",
    description="API para sistema de inventario y tienda online",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # Uses dynamic origins
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
app.include_router(master_data_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/debug/auth")
def debug_auth():
    """Endpoint para debuggear la configuración de Firebase"""
    import firebase_admin
    try:
        app_instance = firebase_admin.get_app()
        return {
            "status": "Firebase initialized",
            "app_name": app_instance.name,
            "project_id": app_instance.project_id
        }
    except ValueError:
        return {"status": "Firebase not initialized", "error": "No app instance found"}
    except Exception as e:
        return {"status": "Firebase error", "error": str(e)}
