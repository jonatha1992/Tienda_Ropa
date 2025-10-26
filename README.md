# Matilda-Vintage - Tienda de Ropa Online

**Matilda-Vintage** es una aplicación completa de e-commerce especializada en ropa vintage, que combina un sistema robusto de gestión de productos con una experiencia de compra moderna y fluida.

## ✨ Características Principales

### 🛍️ **E-commerce Completo**
- Catálogo de productos con filtros avanzados
- Carrito de compras inteligente
- Sistema de checkout con múltiples métodos de pago
- Gestión de pedidos y seguimiento de entregas

### 💳 **Pagos Integrados**
- **MercadoPago**: Pagos con tarjeta, efectivo y transferencias
- **Transferencias bancarias**: Con comprobante y verificación
- **Pago en efectivo**: Con entrega a domicilio

### 📧 **Sistema de Emails Automáticos**
- Confirmación de pedidos con enlaces directos
- Formulario de contacto integrado
- Notificaciones de estado de pedidos
- Gmail SMTP configurado

### 👤 **Autenticación y Roles**
- Firebase Authentication
- Sistema de roles (admin, usuario)
- Vistas personalizadas por rol
- Historial de pedidos por usuario

### 📱 **Interfaz Moderna**
- Diseño responsive (móvil y desktop)
- Vue 3 + TypeScript
- Tailwind CSS para estilos
- Componentes reutilizables

## 🏗️ Arquitectura

- **Frontend:** Vue 3 + TypeScript + Vite → Firebase Hosting
- **Backend:** FastAPI (Python) → Railway
- **Base de datos:** PostgreSQL
- **Storage:** Firebase Storage (imágenes)
- **Emails:** Gmail SMTP
- **Pagos:** MercadoPago API

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
# Crear archivo de entorno (NO usar valores reales en .env.example)
Copy-Item .env.example .env.dev
# Editar .env.dev y establecer DATABASE_URL apuntando a tu instancia Postgres local/remota.
$env:ENVIRONMENT="dev"; uvicorn app.main:app --reload  # http://localhost:8000
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

2. **Variables de entorno (configurarlas SIEMPRE en el panel, no subir .env.production):**
   Obligatorias test/pro (PostgreSQL requerido, no SQLite):
   - `ENVIRONMENT=pro|test`
    - `SECRET_KEY` (>=32 chars, genera con `python - <<<'import secrets;print(secrets.token_urlsafe(48))'`)
    - `DATABASE_URL` (PostgreSQL)
    - Credenciales Firebase (elige 1 estrategia):
       - `FIREBASE_SERVICE_ACCOUNT_JSON_B64` (recomendado)  O
       - `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON una línea)    O
       - Variables individuales: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, etc.
    - `PRODUCTION_FRONTEND_URL` (para CORS)

    Generar base64 (PowerShell):
    ```powershell
    [Convert]::ToBase64String([IO.File]::ReadAllBytes('serviceAccount.json'))
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

## Configuración de Entornos

Ramas → Entorno:
- `dev`  → ENVIRONMENT=dev
- `test` → ENVIRONMENT=test
- `main` → ENVIRONMENT=pro

Archivos locales aceptados (no subir secretos; Postgres también en test/pro):
```
backend/.env.dev
backend/.env.test
backend/.env.pro (evitar commit; usar hosting)
frontend/.env.dev
frontend/.env.test
frontend/.env.pro (no subir)
```
No commitear `.env.pro`. En hosting usar variables directas.

Prioridad carga backend: variables del sistema > archivo específico (.env.{environment}) > .env

Frontend (Vite): usar modos:
```
npm run dev            # dev (.env.dev)
npm run dev:test       # test (.env.test)
npm run build          # pro (añadir --mode pro en scripts)
```

Variable única para backend: `VITE_BACKEND_URL`.

### Migraciones Automáticas
- **Development/Test**: Las migraciones se ejecutan automáticamente al iniciar la aplicación
- **Production**: Las migraciones deben ejecutarse manualmente por seguridad
- **Workflow**: Crear migración → Revisar → Reiniciar aplicación (dev/test) o ejecutar manualmente (production)

---

## 🔧 Configuración Requerida

### Variables de Entorno Backend (.env.test/.env.pro)
```env
# Base
ENVIRONMENT=test
SECRET_KEY=tu_secret_key_seguro
DATABASE_URL=postgresql://user:pass@host:port/db

# Firebase
FIREBASE_PROJECT_ID=m-vintage
FIREBASE_PRIVATE_KEY_ID=tu_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@m-vintage.iam.gserviceaccount.com

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
MERCADOPAGO_PUBLIC_KEY=APP_USR-...
MERCADOPAGO_WEBHOOK_SECRET=tu_webhook_secret

# Gmail SMTP
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
MAIL_FROM=Soporte <tu_email@gmail.com>
APP_NAME=M-Vintage
APP_URL=https://m-vintage-test.web.app
```

### Variables de Entorno Frontend (.env.test/.env.pro)
```env
ENVIRONMENT=test
VITE_BACKEND_URL=https://tu-backend.railway.app/api/v1

# Firebase
VITE_API_KEY=AIzaSy...
VITE_AUTH_DOMAIN=m-vintage.firebaseapp.com
VITE_PROJECT_ID=m-vintage
VITE_STORAGE_BUCKET=m-vintage.firebasestorage.app
VITE_MESSAGING_SENDER_ID=123456789
VITE_APP_ID=1:123456789:web:...

# MercadoPago (opcional para frontend)
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
```

### Configuración Firebase Console
1. **Authentication**: Habilitar Email/Password
2. **Storage**: Crear bucket y configurar reglas
3. **Hosting**: Configurado automáticamente

---

## 📋 API Endpoints

### 🛍️ Productos
- `GET /api/v1/products` - Listar productos con filtros
- `POST /api/v1/products` - Crear producto (admin)
- `GET /api/v1/products/{id}` - Obtener producto por ID
- `PUT /api/v1/products/{id}` - Actualizar producto (admin)
- `DELETE /api/v1/products/{id}` - Eliminar producto (admin)

### 👥 Clientes
- `GET /api/v1/customers` - Listar clientes (admin)
- `POST /api/v1/customers` - Crear cliente
- `GET /api/v1/customers/{id}` - Obtener cliente por ID
- `PUT /api/v1/customers/{id}` - Actualizar cliente
- `DELETE /api/v1/customers/{id}` - Eliminar cliente (admin)

### 📦 Pedidos
- `GET /api/v1/orders` - Listar pedidos (filtros por usuario/admin)
- `POST /api/v1/orders` - Crear pedido
- `GET /api/v1/orders/{id}` - Obtener pedido por ID
- `PUT /api/v1/orders/{id}` - Actualizar pedido
- `GET /api/v1/orders/user/{user_id}` - Pedidos de usuario específico

### 💳 Pagos
- `POST /api/v1/payments/mercadopago/create` - Crear preferencia MercadoPago
- `GET /api/v1/payments/{order_id}/status` - Estado de pago
- `POST /api/v1/payments/webhook` - Webhook MercadoPago
- `GET /api/v1/payments/{order_id}/transfer-info` - Info transferencia
- `GET /api/v1/payments/{order_id}/delivery-info` - Info entrega

### 📧 Emails
- `POST /api/v1/emails/contact` - Enviar mensaje de contacto
- `POST /api/v1/emails/order-confirmation` - Email confirmación pedido
- `POST /api/v1/emails/welcome` - Email bienvenida
- `POST /api/v1/emails/notify` - Email notificación

### 🔐 Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Login de usuario
- `GET /api/v1/auth/me` - Perfil usuario actual
- `POST /api/v1/auth/roles` - Gestión de roles (admin)

### 🏥 Sistema
- `GET /health` - Estado del backend
- `GET /debug/auth` - Debug configuración Firebase

> **Documentación interactiva:** `/docs` (Swagger) y `/redoc` (ReDoc)

---

## 🚀 Guía de Inicio Rápido

### 1. Clonar y Configurar
```bash
git clone https://github.com/tu-usuario/m-vintage.git
cd m-vintage
```

### 2. Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt

# Crear archivo de entorno
cp .env.example .env.dev
# Editar .env.dev con tus credenciales

# Ejecutar
uvicorn app.main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Acceder
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Backend con recarga automática
cd backend && uvicorn app.main:app --reload

# Frontend con hot reload
cd frontend && npm run dev

# Tests backend
cd backend && python -m pytest

# Build frontend
cd frontend && npm run build
```

### Docker
```bash
# Levantar todo el stack
docker-compose up -d

# Solo base de datos
docker-compose up -d db

# Logs
docker-compose logs -f
```

### Migraciones
```bash
# Crear migración
cd backend && alembic revision --autogenerate -m "descripcion"

# Aplicar migraciones
cd backend && alembic upgrade head
```

---

## 📁 Estructura del Proyecto

```
m-vintage/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # Endpoints API
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── core/          # Configuración y utilidades
│   │   ├── models/        # Modelos SQLAlchemy
│   │   └── main.py        # Aplicación principal
│   ├── alembic/           # Migraciones DB
│   └── tests/             # Tests backend
├── frontend/              # Vue 3 frontend
│   ├── src/
│   │   ├── components/    # Componentes Vue
│   │   ├── views/         # Páginas/vistas
│   │   ├── services/      # Servicios API
│   │   ├── composables/   # Composables Vue
│   │   └── types.ts       # Tipos TypeScript
│   └── public/            # Assets estáticos
├── docs/                  # Documentación
├── scripts/               # Scripts de utilidad
└── docker-compose.yml     # Configuración Docker
```

---

## 🔍 Solución de Problemas

### Backend no inicia
- Verificar variables de entorno en `.env.dev`
- Comprobar conexión a base de datos
- Revisar logs: `uvicorn app.main:app --reload --log-level debug`

### Frontend no conecta con backend
- Verificar `VITE_BACKEND_URL` en `.env.dev`
- Comprobar CORS en backend
- Revisar consola del navegador

### Errores de Firebase
- Verificar configuración en `firebase.ts`
- Comprobar credenciales en Firebase Console
- Revisar reglas de Storage y Authentication

### Problemas de pagos
- Verificar credenciales MercadoPago
- Comprobar webhook URL en MercadoPago
- Revisar logs de transacciones

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 📞 Soporte

- **Email**: soporte@m-vintage.com
- **GitHub Issues**: [Reportar problema](https://github.com/tu-usuario/m-vintage/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/m-vintage/wiki)

---

**M-Vintage** - Desarrollado con ❤️ para la comunidad vintage
