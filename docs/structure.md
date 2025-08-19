# Estructura del Proyecto

## Monorepo

El proyecto está organizado como un monorepo con dos carpetas principales:

- `frontend/`: Contiene el código fuente de la aplicación Vue 3.
- `backend/`: Contiene el código fuente de la API de FastAPI.

## Frontend (`frontend/`)

```
frontend/
├── public/ # Archivos estáticos
├── src/
│   ├── assets/ # Imágenes, fuentes, etc.
│   ├── components/ # Componentes de Vue reutilizables
│   │   ├── admin/ # Componentes específicos para admin
│   │   │   ├── AdminOrdersTable.vue
│   │   │   ├── ShippingManager.vue
│   │   │   └── AdminDashboard.vue
│   │   ├── customer/ # Componentes para área de cliente
│   │   │   ├── AccountDashboard.vue
│   │   │   ├── OrderTimeline.vue
│   │   │   └── TrackingDisplay.vue
│   │   └── shared/ # Componentes compartidos
│   │       ├── Navbar.vue
│   │       ├── Footer.vue
│   │       └── LoadingSpinner.vue
│   ├── views/ # Vistas de página completas
│   │   ├── admin/ # Vistas solo para administradores
│   │   │   ├── AdminOrdersView.vue
│   │   │   ├── AdminDashboardView.vue
│   │   │   └── AdminUsersView.vue
│   │   ├── account/ # Vistas del área de cliente
│   │   │   ├── AccountDashboard.vue
│   │   │   ├── ProfileView.vue
│   │   │   └── OrdersView.vue
│   │   ├── public/ # Vistas públicas (sin auth)
│   │   │   ├── HomeView.vue
│   │   │   ├── ShopView.vue
│   │   │   └── ContactView.vue
│   │   └── shared/ # Vistas accesibles por múltiples roles
│   │       ├── OrderDetailView.vue (mejorado con tracking)
│   │       ├── CheckoutView.vue (con redirección post-compra)
│   │       └── AuthView.vue
│   ├── composables/ # Composables de Vue 3
│   │   ├── useAddressAutocomplete.ts (✅ implementado)
│   │   ├── useShipping.ts (futuro)
│   │   ├── useTracking.ts (futuro)
│   │   └── useOrderManagement.ts (futuro)
│   ├── router/ # Configuración de Vue Router
│   │   ├── index.ts # Rutas principales
│   │   ├── admin.ts # Rutas protegidas admin
│   │   ├── account.ts # Rutas área de cliente
│   │   └── guards.ts # Guards de autenticación y roles
│   ├── store/ # Módulos de Pinia para gestión de estado
│   │   ├── auth.ts # Autenticación y roles
│   │   ├── cart.ts # Carrito de compras
│   │   ├── orders.ts # Gestión de pedidos
│   │   └── admin.ts # Estado específico admin (futuro)
│   ├── services/ # Lógica de negocio y comunicación con APIs
│   │   ├── api.ts # Configuración base de axios
│   │   ├── orders.ts # APIs de pedidos
│   │   ├── shipping.ts # APIs de seguimiento (futuro)
│   │   └── admin.ts # APIs administrativas (futuro)
│   ├── types/ # Definiciones de tipos de TypeScript
│   │   ├── index.ts # Tipos principales
│   │   ├── shipping.ts # Tipos de seguimiento (futuro)
│   │   └── admin.ts # Tipos administrativos (futuro)
│   ├── main.ts # Punto de entrada de la aplicación
│   └── App.vue # Componente raíz de Vue
├── package.json # Dependencias y scripts
└── vite.config.ts # Configuración de Vite
```

## Backend (`backend/`)

```
backend/
├── app/
│   ├── controllers/ # Lógica de negocio (business logic)
│   │   ├── order_controller.py
│   │   ├── shipping_controller.py (futuro)
│   │   ├── user_controller.py
│   │   └── role_controller.py
│   ├── routes/ # Endpoints de FastAPI organizados por dominio
│   │   ├── orders.py # Rutas de pedidos
│   │   ├── admin_orders.py # Rutas administrativas de pedidos
│   │   ├── shipping.py # Rutas de seguimiento (futuro)
│   │   ├── customers.py # Rutas de clientes
│   │   ├── products.py # Rutas de productos
│   │   ├── users.py # Rutas de usuarios
│   │   ├── roles.py # Rutas de gestión de roles
│   │   └── payments.py # Rutas de pagos
│   ├── models/ # Modelos de datos SQLModel
│   │   ├── order.py # Modelo Order (actualizado con tracking)
│   │   ├── customer.py # Modelo Customer
│   │   ├── product.py # Modelo Product
│   │   ├── user.py # Modelo User
│   │   ├── role.py # Modelo Role
│   │   └── user_role.py # Modelo UserRole (many-to-many)
│   ├── schemas/ # DTOs y esquemas de validación
│   │   ├── order_schemas.py # Esquemas de pedidos
│   │   ├── shipping_schemas.py # Esquemas de envío (futuro)
│   │   ├── user_schemas.py # Esquemas de usuarios
│   │   └── role_schemas.py # Esquemas de roles
│   ├── core/ # Configuración y utilidades del sistema
│   │   ├── config.py # Configuración de la aplicación
│   │   ├── security.py # Autenticación y autorización
│   │   ├── auth_firebase.py # Integración con Firebase Auth
│   │   ├── shipping_providers.py # Config de proveedores (futuro)
│   │   └── permissions.py # Sistema de permisos (futuro)
│   ├── services/ # Servicios externos y lógica compleja
│   │   ├── email_service.py # Servicio de emails
│   │   ├── notification_service.py # Notificaciones (futuro)
│   │   └── tracking_service.py # APIs externas tracking (futuro)
│   ├── integrations/ # Integraciones con servicios externos
│   │   ├── mercadopago.py # MercadoPago API
│   │   ├── correo_argentino.py # API Correo Argentino (futuro)
│   │   └── firebase_storage.py # Firebase Storage
│   ├── db/ # Configuración de base de datos
│   │   ├── session.py # Sesión de SQLAlchemy
│   │   └── base.py # Configuración base
│   ├── utils/ # Utilidades y helpers
│   │   ├── validators.py # Validadores personalizados
│   │   ├── formatters.py # Formateo de datos
│   │   └── constants.py # Constantes del sistema
│   └── main.py # Punto de entrada de la API FastAPI
├── alembic/ # Migraciones de base de datos
│   ├── versions/ # Archivos de migración
│   │   ├── xxx_add_shipping_fields.py # Nueva migración
│   │   └── ...
│   └── alembic.ini # Configuración de Alembic
├── tests/ # Pruebas organizadas por módulo
│   ├── test_auth_module.py # Tests de autenticación
│   ├── test_orders_module.py # Tests de pedidos
│   ├── test_shipping_module.py # Tests de envío (futuro)
│   ├── test_admin_module.py # Tests administrativos (futuro)
│   └── conftest.py # Configuración de pytest
├── docs/ # Documentación del backend (opcional)
├── .env.dev # Variables de entorno desarrollo
├── .env.test # Variables de entorno testing
├── .env.pro # Variables de entorno producción
└── requirements.txt # Dependencias de Python
```

### Nuevos Modelos de Datos

#### Order Model (Actualizado)
```python
class Order(OrderBase, table=True):
    # Campos existentes...
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    total: float
    status: str  # 'pending', 'approved', 'shipped', 'delivered', 'cancelled'
    
    # NUEVOS CAMPOS para seguimiento
    tracking_number: Optional[str] = Field(default=None, max_length=255)
    shipping_provider: Optional[str] = Field(default=None, max_length=100)
    shipped_at: Optional[datetime] = Field(default=None)
    estimated_delivery: Optional[datetime] = Field(default=None)
    shipped_by: Optional[int] = Field(default=None, foreign_key="user.id")
```

#### Shipping Schemas (Nuevos)
```python
class ShippingUpdate(BaseModel):
    tracking_number: str = Field(min_length=5, max_length=255)
    shipping_provider: str = Field(regex="^(correo-argentino|oca|andreani)$")
    estimated_delivery: Optional[datetime] = None

class TrackingInfo(BaseModel):
    tracking_number: str
    shipping_provider: str
    tracking_url: str
    provider_name: str
    shipped_at: datetime
```

### Nuevas APIs Administrativas

#### Admin Orders Endpoints
```python
# /api/v1/admin/orders
GET /orders?status=pending_shipment  # Pedidos listos para envío
PUT /orders/{id}/shipping             # Actualizar info de envío
POST /orders/{id}/mark-shipped        # Marcar como enviado
GET /orders/{id}/tracking-history     # Historial de tracking
```
