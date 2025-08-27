# Estructura del Proyecto

## Monorepo

El proyecto está organizado como un monorepo con dos carpetas principales:

- `frontend/`: Contiene el código fuente de la aplicación Vue 3.
- `backend/`: Contiene el código fuente de la API de FastAPI.

## Frontend (`frontend/`)

A continuación se detalla la estructura del directorio `frontend`, explicando el propósito de cada archivo y carpeta relevante.

```
frontend/
├── public/                     # Archivos estáticos que se sirven directamente.
│   ├── imagen portada.jpg
│   ├── imagen-portada.svg
│   ├── logo_redondo.png
│   ├── logo.jpg
│   ├── modelo_card.jpg
│   ├── user-avatar-placeholder.png
│   ├── Video.mp4
│   └── vite.svg
├── src/                        # Directorio principal del código fuente de la aplicación.
│   ├── assets/                 # Recursos estáticos procesados por Vite (imágenes, fuentes, etc.).
│   │   ├── modelo_card.jpg
│   │   └── vue.svg
│   ├── components/             # Componentes de Vue reutilizables.
│   │   ├── admin/              # Componentes específicos para el panel de administración.
│   │   │   └── RoleManagement.vue
│   │   ├── cart/               # Componentes relacionados con el carrito de compras.
│   │   │   ├── CartAddedNotification.vue
│   │   │   ├── CartModal.vue
│   │   │   └── ShoppingCart.vue
│   │   ├── checkout/           # Componentes para el proceso de pago.
│   │   │   └── ShippingModal.vue
│   │   ├── common/             # Componentes comunes (actualmente vacío).
│   │   ├── forms/              # Componentes de formularios.
│   │   │   ├── AddressAutocomplete.vue
│   │   │   └── CountryPhoneSelector.vue
│   │   ├── layout/             # Componentes principales de la estructura de la página.
│   │   │   ├── Footer.vue
│   │   │   ├── HeroBanner.vue
│   │   │   ├── Home.vue
│   │   │   └── Navbar.vue
│   │   ├── orders/             # Componentes para la gestión de pedidos.
│   │   │   ├── EditOrderModal.vue
│   │   │   └── OrderStatusModal.vue
│   │   ├── products/           # Componentes para mostrar productos.
│   │   │   ├── MasterDataShowcase.vue
│   │   │   ├── OptimizedImage.vue
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductDetail.vue
│   │   │   └── ProductGrid.vue
│   │   └── ui/                 # Componentes de interfaz de usuario genéricos.
│   │       ├── Chatbot.vue
│   │       ├── ConfirmationModal.vue
│   │       ├── DeliveryProgress.vue
│   │       ├── ImageGalleryModal.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ProgressBar.vue
│   ├── composables/            # Funciones "composables" de Vue 3 para lógica reutilizable.
│   │   ├── useAddressAutocomplete.ts
│   │   ├── useCartModal.ts
│   │   ├── useCartNotification.ts
│   │   ├── useImageLoading.ts
│   │   ├── useLoading.ts
│   │   ├── useProgressBar.ts
│   │   ├── useUserData.ts
│   │   └── useValidators.ts
│   ├── config/                 # Archivos de configuración de la aplicación.
│   │   ├── api.ts
│   │   ├── app.ts
│   │   ├── firebase.ts
│   │   └── index.ts
│   ├── services/               # Servicios para la comunicación con APIs y lógica de negocio.
│   │   ├── emailService.ts
│   │   ├── emailVerificationService.ts
│   │   └── stockService.ts
│   ├── store/                  # Módulos de Pinia para la gestión del estado global.
│   │   ├── auth.ts
│   │   └── cart.ts
│   ├── styles/                 # Archivos de estilos globales.
│   │   └── admin-buttons.css
│   ├── types/                  # Definiciones de tipos de TypeScript.
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── users/
│   │   ├── index.ts
│   │   ├── orders.ts
│   │   ├── stock.ts
│   │   └── vue.d.ts
│   ├── utils/                  # Utilidades y funciones de ayuda.
│   │   ├── cache.ts
│   │   ├── debounce.ts
│   │   └── orderUtils.ts
│   ├── views/                  # Componentes de página completa (rutas de Vue Router).
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── profile/
│   │   └── shared/
│   ├── App.vue                 # Componente raíz de la aplicación.
│   ├── components.d.ts         # Declaraciones de tipos para componentes.
│   ├── env.d.ts                # Declaraciones de tipos para variables de entorno.
│   ├── main.ts                 # Punto de entrada de la aplicación Vue.
│   ├── router.ts               # Configuración de Vue Router.
│   └── style.css               # Hoja de estilos principal.
├── .gitignore                  # Archivos y carpetas ignorados por Git.
├── firebase.json               # Configuración para el despliegue en Firebase.
├── index.html                  # Punto de entrada HTML de la aplicación.
├── package.json                # Dependencias del proyecto y scripts de NPM.
├── package-lock.json           # Versiones exactas de las dependencias.
├── postcss.config.js           # Configuración de PostCSS.
├── tailwind.config.js          # Configuración de Tailwind CSS.
├── tsconfig.json               # Configuración principal de TypeScript.
├── tsconfig.app.json           # Configuración de TypeScript específica para la aplicación.
├── tsconfig.node.json          # Configuración de TypeScript para el entorno de Node.js.
├── vite.config.ts              # Configuración de Vite.
└── vitest.config.ts            # Configuración de Vitest para las pruebas.
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