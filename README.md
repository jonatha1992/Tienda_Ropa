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
```bash
cd backend
python -m venv .venv && source .venv/bin/activate    # en Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
```bash
cd backend
python -m venv .venv && source .venv/bin/activate    # en Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload  # http://localhost:8000
```

### Frontend (Vue 3)
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```