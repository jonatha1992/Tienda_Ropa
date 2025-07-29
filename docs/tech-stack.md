# Tech Stack

## General
- Monorepo simple con `/frontend` y `/backend`.
- Docker por servicio; `docker-compose` para local.

## Frontend
- **Vue 3 + TypeScript** (Vite)
- Gestión de estado (opcional): Pinia
- Linting: ESLint + Prettier + autopep8
- Tests (sugerido): Vitest + Testing Library
- Deploy: **Firebase Hosting**
- Storage de archivos: **Firebase Storage**
- Autenticación: **Firebase Auth**

## Backend
- **FastAPI (Python)**
- **SQLAlchemy 2.x** (ORM)
- **Pydantic v2** (modelos/validación)
- **Uvicorn** (ASGI server)
- **PostgreSQL** (Railway)
- Migraciones (opcional): Alembic
- Integración de autenticación con Firebase Auth y tokens JWT
- Instalación y gestión de dependencias Python con `uv` (recomendado):
	- Crear entorno: `uv venv .venv`
	- Instalar dependencias: `uv pip install -r requirements.txt`

## Integración / Operación
- Entornos: `development`, `production`
- Variables via `.env`
- Observabilidad (a definir): logs estructurados, salud `/health`
- CI/CD (sugerido): GitHub Actions