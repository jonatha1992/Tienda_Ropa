# Copilot Instructions: Tienda_Ropa

## Reglas para agentes Copilot

1. Antes de actuar, leer en este orden: `README.md` → `docs/planning.md` (o issues) → `docs/tech-stack.md` → `docs/structure.md`.
2. Si falta alguno, crearlo con un esqueleto mínimo y confirmar.
3. Solo implementar/editar una feature o endpoint si está en `planning.md` (o issues); si no, agregarlo primero.
4. Tras cambios relevantes (feature/endpoint/config), **actualizar README** (sección API: ruta, método, ejemplos de request/response, errores).
5. **Frontend:** TypeScript estricto; usando tailwinds css para maquetado, lint con ESLint/Prettier; tests (Vitest) cuando corresponda.
6. **Backend:** Validación con SQLModel (antes Pydantic); tests con pytest (y/o requests a la API); seguir convenciones.
7. **Limpieza de código:** identificar y eliminar imports, funciones, tipos, módulos y archivos no usados.
   - Comprobar referencias en todo el workspace antes de borrar.
   - Si algo es parte de una API pública, marcar deprecado y planificar su remoción en `docs/planning.md`.
   - Si hay dudas, abrir PR explicando qué se elimina y por qué; actualizar `README`/`planning` si corresponde.
8. Cuando completes una tarea de `docs/planning.md`, muévela de la sección 'Tareas' a 'Hecho' y agrega la fecha de finalización. Ejemplo:
   - Tarea completada [29/07/2025]

---

## 1. Contexto y Arquitectura

- Monorepo con dos carpetas principales: `frontend/` (Vue 3 + TypeScript + Vite) y `backend/` (FastAPI + Python).
- Base de datos principal: PostgreSQL (Railway), pero puede usarse SQLite en desarrollo.
- Storage de imágenes: Firebase Storage.
- Autenticación: Firebase Auth + JWT (backend).
- Despliegue: Frontend en Firebase Hosting, backend en Railway.

## 2. Flujos de desarrollo

- **Backend:**  
  - Modelos de datos con SQLModel (antes SQLAlchemy + Pydantic).
  - Migraciones con Alembic (`alembic revision --autogenerate`, `alembic upgrade head`).
  - API REST estructurada en `/backend/app/routes/` (ejemplo: `products.py`, `customers.py`).
  - Configuración en `.env` y `app/core/config.py`.
  - Tests con pytest y requests.
  - Arranque local:  
    ```bash
    cd backend
    python -m venv .venv ; .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
- **Frontend:**  
  - SPA con Vue 3, Vite y TypeScript estricto.
  - Maquetado con Tailwind CSS.
  - Estado con Pinia (opcional).
  - Linting: ESLint + Prettier.
  - Tests: Vitest + Testing Library.
  - Arranque local:  
    ```bash
    cd frontend ; npm install ; npm run dev
    ```

## 3. Convenciones y patrones

- Solo implementar features/endpoints si están en `docs/planning.md` o issues.
- Actualizar `README.md` tras cambios relevantes (API, endpoints, ejemplos).
- Limpiar código muerto siguiendo `docs/structure.md` y `.github/instructions/04-dead-code-policy.instructions.md`.
- Variables sensibles y configuración en `.env.example` (ambos servicios).
- Endpoints RESTful bajo `/api/v1/` (ejemplo: `/api/v1/products`).
- Validación de datos y serialización con SQLModel (antes Pydantic).
- Migraciones y cambios de modelos deben reflejarse en Alembic y en la base de datos.
- Tests y CI/CD: pytest (backend), Vitest (frontend), GitHub Actions para lint/test/build/deploy.

## 4. Integraciones y dependencias

- **Firebase:**  
  - Hosting, Storage y Auth para frontend y backend.
- **Railway:**  
  - Despliegue backend y base de datos PostgreSQL.
- **Docker:**  
  - Archivos Dockerfile por servicio, docker-compose para entorno local.

## 5. Ejemplos clave

- Modelos en `backend/app/models/*.py` usando SQLModel.
- Rutas en `backend/app/routes/*.py` siguiendo el patrón CRUD.
- Configuración de sesión DB en `backend/app/db/session.py`.
- Frontend principal en `frontend/src/main.ts` y componentes en `frontend/src/components/`.
