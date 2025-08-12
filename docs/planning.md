<<<<<<< HEAD
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
=======
# Project Planning & Development Roadmap

## Current Status
The Tienda_Ropa project is an active e-commerce clothing store management system with both frontend and backend components. The system has completed foundational authentication, role management, and basic CRUD operations.

## Active Development Phases

### Phase 1: Frontend UI/UX Enhancement
**Priority: High** | **Status: In Progress**

- [ ] Update main stylesheet (`frontend/src/style.css`) to match modern design standards
- [ ] Redesign `Navbar.vue` component with "Shop" dropdown menu
- [ ] Overhaul `App.vue` to include:
  - Main hero banner section
  - Featured products section
- [ ] Create new `Footer.vue` component
- [ ] Implement responsive design across all components

### Phase 2: Product Management System
**Priority: High** | **Status: Pending**

- [ ] Create `ProductAdmin.vue` component for admin panel
- [ ] Design comprehensive product creation/edit forms
- [ ] Implement API integration for product CRUD operations
- [ ] Add `/admin/products` route and navigation links
- [ ] Replace text input with file selector for product images
- [ ] Integrate Firebase Storage for image uploads
- [ ] Create reusable confirmation modals for admin actions

### Phase 3: Core E-commerce Features  
**Priority: Medium** | **Status: Pending**

- [ ] Implement detailed product pages with variants
- [ ] Build functional shopping cart system
- [ ] Create checkout process with order management
- [ ] Develop user account pages:
  - Login/registration flows
  - Order history tracking
  - User profile management

### Phase 4: Backend Integration & API Enhancement
**Priority: High** | **Status: Ongoing**

- [ ] Complete frontend-backend API integration
- [ ] Implement Firebase Storage integration for both frontend and backend
- [ ] Enhance centralized error handling (FastAPI + frontend)
- [ ] Finalize Firebase user synchronization endpoint (`/users/sync`)
- [ ] Document all API endpoints with request/response examples

### Phase 5: System Optimization & Documentation
**Priority: Medium** | **Status: Ongoing**

- [ ] Synchronize dependencies across `requirements.txt`, `package.json`
- [ ] Update Docker configurations (`Dockerfile`, `docker-compose.yml`)
- [ ] Complete integration documentation (login flow, product management)
- [ ] Implement comprehensive error handling and validation

## Technical Debt & Maintenance

### Code Quality & Standards
- [ ] Review and remove dead code according to policy guidelines
- [ ] Implement consistent code formatting across frontend and backend
- [ ] Enhance test coverage for critical business logic
- [ ] Optimize database queries and API performance

### Security & Compliance
- [ ] Audit Firebase security rules and configurations
- [ ] Review role-based access control implementation
- [ ] Implement proper input sanitization and validation
- [ ] Add rate limiting and security headers

### Infrastructure & DevOps
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Configure automated testing in pipeline
- [ ] Implement staging environment deployment
- [ ] Add monitoring and logging solutions

## Completed Milestones

### Authentication & Authorization System ✅
**Completed: July 31, 2025**
- Firebase Auth integration with JWT tokens
- Role-based access control (admin, manager, employee, user)
- Backend and frontend authentication flows
- User/Role/UserRole models with many-to-many relationships
- Protected API endpoints with role validation
- Frontend role management and user management components
- Navigation menu with role-based permissions

### Backend API Foundation ✅
**Completed: July 31, 2025**
- RESTful API structure with `/api/v1/` prefix
- SQLAlchemy and Pydantic model integration
- Health check endpoints (`/health`)
- Comprehensive test suite (pytest, requests, mocks)
- Database migration system with Alembic

### Frontend Testing & Development ✅
**Completed: August 5, 2025**
- Unit and integration testing (Vitest, Testing Library)
- Authentication flow testing from frontend to backend
- Role-based component rendering
- Admin panel navigation structure

### Multi-Environment Configuration ✅
**Completed: August 10, 2025**
- Environment-specific configuration files:
  - `.env.dev` / `.env.test` for both frontend and backend
  - Vite build modes for different environments
  - FastAPI Settings refactor for ENVIRONMENT=dev|test|pro
- PostgreSQL enforcement for test/production environments
- Environment validation and configuration documentation

### Code Quality & Maintenance ✅
**Completed: August 7, 2025**
- Dead code removal according to project policies
- Code structure documentation and guidelines
- Project planning and technical documentation

## Development Guidelines

### Windows Development Environment
- **Command Separator**: Use `;` instead of `&&` for PowerShell commands
- **Virtual Environment**: Activate with `& .\.venv\Scripts\Activate.ps1`
- **Port Checking**: Always verify ports with `netstat -an | findstr :PORT` before starting services
- **Service Startup**: Check both backend (8000) and frontend (5173) ports before starting

### Git Workflow
- **Main Branch**: `main` (for production releases)
- **Development Branch**: `dev` (active development)
- **Feature Branches**: Create from `dev`, merge back to `dev`
- **Commit Messages**: Follow conventional commit format

### Testing Requirements
- **Backend**: All new endpoints must have corresponding test cases
- **Frontend**: Components with business logic require unit tests
- **Integration**: Critical user flows must have end-to-end test coverage

### Code Review Standards
- **Type Safety**: TypeScript strict mode for frontend, Pydantic models for backend
- **Error Handling**: Consistent error responses and user feedback
- **Security**: All endpoints must validate input and check permissions
- **Documentation**: Public APIs must have comprehensive documentation
>>>>>>> dev
