# Inventario + Tienda Online

Aplicación que combina **sistema de control de stock** e **e‑commerce**: permite gestionar productos, inventarios, ventas y pedidos tanto en la tienda física como en línea.

## Objetivos
- Control de stock: altas, bajas, ajustes y alertas de bajo inventario.
- E‑commerce: catálogo, carrito, checkout y gestión de pedidos.
- Unificación de gestión física/online con una única base de datos.

## Arquitectura general (resumen)
- **Frontend:** Vue 3 + TypeScript (Vite). Se despliega en **Firebase Hosting**; activos estáticos y SPA.
- **Backend:** FastAPI (Python). Se despliega en **Railway**. Expone API REST.
- **Base de datos:** PostgreSQL (Railway u otro proveedor).
- **Storage:** Firebase Storage para imágenes de productos u otros archivos.
- **Contenedores:** Docker por servicio; docker‑compose para entorno local.

> Ver detalles ampliados en [`docs/structure.md`](docs/structure.md) y [`docs/tech-stack.md`](docs/tech-stack.md).

---

## Requisitos
- **Node.js 18+** y **npm** (o pnpm/yarn)
- **Python 3.11+**
- **Docker** y **Docker Compose** (opcional pero recomendado)
- Cuenta en **Firebase** (hosting y storage) y **Railway** (backend y/o Postgres)

---

## Puesta en marcha (local sin Docker)

### Backend (FastAPI)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
cp .env.example .env
# Configurar variables en .env
uvicorn app.main:app --reload  # http://localhost:8000
```

### Frontend (Vue 3)
```powershell
cd frontend
npm install
npm run dev  # http://localhost:5173
```

---

## Despliegue

### Railway (Backend)

1. **Conectar repositorio a Railway:**
   ```bash
   # Instalar Railway CLI
   npm install -g @railway/cli
   
   # Login y conectar proyecto
   railway login
   railway link
   ```

2. **Configurar variables de entorno en Railway:**
   - `DATABASE_URL`: URL de PostgreSQL proporcionada por Railway
   - `SECRET_KEY`: Clave secreta para JWT
   - `FIREBASE_PROJECT_ID`: ID del proyecto Firebase
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: JSON completo de la service account key
   - `PRODUCTION_FRONTEND_URL`: URL del frontend en producción
   - `ENVIRONMENT`: `production`

   **Para obtener la Firebase Service Account Key:**
   ```bash
   # Copia el contenido completo del archivo firebase_service_account.json
   # y pégalo como una sola línea en la variable FIREBASE_SERVICE_ACCOUNT_KEY
   cat backend/firebase_service_account.json
   ```

3. **Desplegar:**
   ```bash
   railway up
   ```

### Firebase (Frontend)

1. **Build y deploy:**
   ```bash
   cd frontend
   npm run build
   firebase deploy
   ```

---

## API Endpoints

### Productos
- `GET /api/v1/products` - Listar productos
- `POST /api/v1/products` - Crear producto
- `GET /api/v1/products/{id}` - Obtener producto por ID
- `PUT /api/v1/products/{id}` - Actualizar producto
- `DELETE /api/v1/products/{id}` - Eliminar producto

### Clientes
- `GET /api/v1/customers` - Listar clientes
- `POST /api/v1/customers` - Crear cliente
- `GET /api/v1/customers/{id}` - Obtener cliente por ID
- `PUT /api/v1/customers/{id}` - Actualizar cliente
- `DELETE /api/v1/customers/{id}` - Eliminar cliente

### Pedidos
- `GET /api/v1/orders` - Listar pedidos
- `POST /api/v1/orders` - Crear pedido
- `GET /api/v1/orders/{id}` - Obtener pedido por ID
- `PUT /api/v1/orders/{id}` - Actualizar pedido
- `DELETE /api/v1/orders/{id}` - Eliminar pedido

### Inventario
- `GET /api/v1/inventory` - Consultar inventario
- `POST /api/v1/inventory/adjust` - Ajustar stock
- `GET /api/v1/inventory/low-stock` - Productos con stock bajo

### Salud del sistema
- `GET /health` - Verificar estado del backend
- `GET /debug/auth` - Debug de configuración Firebase

> **Nota:** La documentación interactiva de la API está disponible en `/docs` (Swagger UI) y `/redoc` (ReDoc) cuando el backend está ejecutándose.