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
- **Implementar ABM de Productos en el Frontend:**
  - Crear componente `ProductAdmin.vue`.
  - Diseñar formulario para alta y edición.
  - Implementar lógica para interactuar con la API de productos.
  - Añadir ruta `/admin/products` y enlace en la navegación.
  - Reemplazar campo de texto de imágenes por un selector de archivos con previsualización.
  - Implementar la subida de imágenes a Firebase Storage.
  - Crear un modal de confirmación reutilizable para las acciones de guardar, actualizar y eliminar.
- **General Tasks**
  - Integrar y testear subida/lectura de imágenes con Firebase Storage desde frontend y backend.
  - (COMPLETADO) Configurar y documentar variables de entorno en `.env.example` (ambos servicios). [10/08/2025]
  - Mejorar manejo centralizado de errores y validaciones (FastAPI + frontend).
- Revisión y limpieza de código muerto según política en `docs/structure.md` y `.github/instructions/04-dead-code-policy.instructions.md`. [07/08/2025]
  - Documentar endpoints y ejemplos de request/response en README.md.

  - Sincronizar dependencias y scripts en `requirements.txt`, `package.json`, `Dockerfile`, `docker-compose.yml`.
  - Validar y documentar integración entre frontend y backend (ejemplo: flujo de login, alta de producto).

## Hecho
- Autenticación (Firebase Auth + tokens JWT) y autorización por rol (backend, frontend). [31/07/2025]
- Integrar endpoints RESTful en FastAPI según estructura `/backend/app/api/v1/endpoints/`. [31/07/2025]
- Refactorizar modelos SQLAlchemy y Pydantic para alinearse con `/backend/app/db/models.py` y validaciones estrictas. [31/07/2025]
- Implementar migraciones con Alembic y documentar proceso. [05/08/2025]
- Implementar tests unitarios y de integración (Backend: pytest, requests, mocks). [31/07/2025]
- Implementar tests unitarios y de integración (Frontend: Vitest, Testing Library). [05/08/2025]
- Pruebas de autenticación desde el frontend al backend. [05/08/2025]
- Agregar y documentar endpoints `/health`. [31/07/2025]
- Sistema completo de gestión de roles y usuarios. [05/08/2025]
  - Creados modelos Role, UserRole con relaciones many-to-many
  - Implementados controladores y rutas para gestión de roles
  - Sistema de autorización por roles (admin, manager, employee, user)
  - Frontend con componentes RoleManagement y UserManagement
  - Navegación actualizada con menú de administración basado en roles
  - Script de inicialización de roles por defecto
  - Protección de endpoints por roles apropiados
- Revisión y limpieza de código muerto según política en `docs/structure.md` y `.github/instructions/04-dead-code-policy.instructions.md`. [07/08/2025]
 - Unificación esquema multi-entorno dev/test/pro (backend y frontend) y actualización README. [10/08/2025]
   - Nuevos archivos .env.dev / .env.test
   - Scripts Vite dev:test / build modes
   - Refactor Settings FastAPI y Alembic para ENVIRONMENT=dev|test|pro
  - Enforced PostgreSQL obligatorio en entornos test/pro (validación Settings + actualización .env.* y README). [10/08/2025]
