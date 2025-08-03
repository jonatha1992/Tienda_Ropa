

# Planning / Issues

## Tareas
- **Phase 1: Foundational UI/UX**
  - Update `planning.md` with new development tasks.
  - Update main stylesheet (`frontend/src/style.css`) to match reference site's modern design.
  - Redesign `Navbar.vue` to include a "Shop" dropdown menu.
  - Overhaul `App.vue` to include a main hero banner and a "Featured Products" section.
  - Create a new `Footer.vue` component.
- **Phase 2: Core E-commerce Features**
  - Implement product detail pages.
  - Implement a functional shopping cart and checkout process.
  - Implement user account pages (login, register, order history).
- **Phase 3: Backend Integration**
  - Integrate frontend components with backend APIs to fetch and display data.
- **General Tasks**
  - Autenticación (Firebase Auth + tokens JWT) y autorización por rol (backend, frontend).
  - Integrar endpoints RESTful en FastAPI según estructura `/backend/app/api/v1/endpoints/`.
  - Refactorizar modelos SQLAlchemy y Pydantic para alinearse con `/backend/app/db/models.py` y validaciones estrictas.
  - Implementar migraciones con Alembic y documentar proceso.
  - Integrar y testear subida/lectura de imágenes con Firebase Storage desde frontend y backend.
  - Configurar y documentar variables de entorno en `.env.example` (ambos servicios).
  - Mejorar manejo centralizado de errores y validaciones (FastAPI + frontend).
  - Implementar tests unitarios y de integración:
	- Backend: pytest, requests, mocks
	- Frontend: Vitest, Testing Library
  - Agregar y documentar endpoints `/health` y logs estructurados para observabilidad.
  - Configurar CI/CD básico con GitHub Actions (lint, test, build, deploy).
  - Documentar endpoints y ejemplos de request/response en README.md.
  - Revisar y limpiar código muerto según política en `docs/structure.md` y `.github/instructions/04-dead-code-policy.instructions.md`.
  - Sincronizar dependencias y scripts en `requirements.txt`, `package.json`, `Dockerfile`, `docker-compose.yml`.
  - Validar y documentar integración entre frontend y backend (ejemplo: flujo de login, alta de producto).

## Hecho
- Autenticación (Firebase Auth + tokens JWT) y autorización por rol (backend, frontend). [31/07/2025]
- Integrar endpoints RESTful en FastAPI según estructura `/backend/app/api/v1/endpoints/`. [31/07/2025]
- Refactorizar modelos SQLAlchemy y Pydantic para alinearse con `/backend/app/db/models.py` y validaciones estrictas. [31/07/2025]
- Implementar migraciones con Alembic y documentar proceso. [31/07/2025]
- Implementar tests unitarios y de integración (Backend: pytest, requests, mocks). [31/07/2025]
- Agregar y documentar endpoints `/health`. [31/07/2025]