# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (FastAPI + Python)
```powershell
# REQUIRED startup sequence - ALWAYS check if port 8000 is in use first:
netstat -an | findstr :8000

# If no output, start backend (IMPORTANT: execute from project root):
cd C:\Repositorio\mvintage
& .\backend\.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (Vue 3 + TypeScript)
```powershell
# REQUIRED startup sequence - ALWAYS check if port 5173 is in use first:
netstat -an | findstr :5173

# If no output, start frontend:
cd C:\Repositorio\mvintage\frontend
npm run dev
```

### Testing
```powershell
# Backend tests (execute from project root):
cd C:\Repositorio\mvintage
& .\backend\.venv\Scripts\Activate.ps1
python -m pytest backend/tests/

# Frontend tests:
cd C:\Repositorio\mvintage\frontend
npm run test
```

### Build Commands
```powershell
# Frontend production build:
cd C:\Repositorio\mvintage\frontend
npm run build

# Frontend build for different environments:
npm run build:test  # test environment
npm run build:dev   # development environment
```

## Architecture Overview

### Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia (state management)
- **Backend**: FastAPI + SQLModel + SQLAlchemy + Alembic (migrations)
- **Database**: PostgreSQL (production), SQLite (development)
- **Authentication**: Firebase Auth + JWT tokens
- **Storage**: Firebase Storage for images
- **Deployment**: Firebase Hosting (frontend), Railway (backend + PostgreSQL)

### Core Structure
```
backend/app/
├── controllers/     # Business logic controllers
├── core/           # Configuration, auth, security
├── db/             # Database session management  
├── models/         # SQLModel data models
├── routes/         # FastAPI route handlers
└── main.py         # FastAPI application entry point

frontend/src/
├── components/     # Vue components
├── views/          # Page-level Vue components
├── store/          # Pinia state management
├── types.ts        # TypeScript type definitions
└── router.ts       # Vue Router configuration
```

## Key Patterns & Conventions

### Backend Patterns
- **Models**: Use SQLModel for data models with automatic Pydantic serialization
- **API Routes**: Structured under `/api/v1/` prefix 
- **Authentication**: Firebase Auth integration with JWT token validation
- **Environment Configuration**: Multi-environment setup (dev/test/pro) via `.env.{environment}` files
- **Database**: Use dependency injection with `Depends(get_session)` for database access

### Frontend Patterns  
- **Components**: Use Composition API with TypeScript
- **State**: Pinia stores for global state management
- **Styling**: Tailwind CSS for all styling
- **Types**: Centralized TypeScript interfaces in `types.ts`
- **API Integration**: Axios client configured in `api.ts`

### Database Models
Key entities:
- **Product**: Main product with `is_unique` flag for single vs multi-variant products
- **ProductVariant**: Color/size combinations with individual stock tracking
- **ProductImage**: Multiple images per product
- **User/Role/UserRole**: Role-based access control system
- **Customer/Order/OrderItem**: E-commerce functionality
- **Inventory**: Stock management and tracking

## Environment Configuration

### Environment Files
- `backend/.env.dev` - Development settings
- `backend/.env.test` - Test environment  
- `backend/.env.pro` - Production (do not commit)
- `frontend/.env.dev` - Frontend development
- `frontend/.env.test` - Frontend test environment

### Required Variables
**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key (32+ chars for production)
- `FIREBASE_*`: Firebase service account credentials
- `ENVIRONMENT`: dev/test/pro

**Frontend:**  
- `VITE_BACKEND_URL`: Backend API URL

## Testing Structure

Tests are organized by business domain:
- `test_auth_module.py` - Authentication and authorization
- `test_master_data_module.py` - Colors, categories, sizes
- `test_products_module.py` - Product management
- `test_ecommerce_module.py` - Customers, orders, order items  
- `test_inventory_module.py` - Stock management
- `test_integration_complete.py` - End-to-end workflows

## Important Development Notes

### Windows Development Environment
This project is developed on Windows and uses PowerShell conventions:

**CRITICAL: Command Concatenation**
- **ALWAYS use `;` instead of `&&`** for command concatenation in PowerShell
- Example: `cd backend; & .\.venv\Scripts\Activate.ps1; python -m uvicorn app.main:app --reload`
- **NEVER use `&&`** - it will cause commands to fail in PowerShell

**Port Management**
- ALWAYS check ports before starting services using: `netstat -an | findstr :PORT`
- Backend uses port 8000, Frontend uses port 5173
- Never start services without verifying ports are available first

**Virtual Environment Activation**
- Use PowerShell syntax: `& .\.venv\Scripts\Activate.ps1`
- NEVER use Linux syntax (`source` commands) - they will fail on Windows

### Documentation Context
For complete project context, always refer to:
- `docs/structure.md` - Complete project structure and component overview
- `docs/tech-stack.md` - Detailed technical documentation and architecture
- `docs/planning.md` - Current development roadmap and completed milestones

These documents are essential for understanding the full project context and should be consulted before making significant changes.

### Command Execution Policy
**IMPORTANT: Do NOT execute commands automatically**
- The user will execute all commands manually to save tokens
- Provide the exact commands the user should run, but do NOT use the Bash tool
- Always explain what the command does and why it needs to be run
- Format commands clearly in code blocks for easy copying

### Database Migrations
When modifying models:
```powershell
cd C:\Repositorio\mvintage
& .\backend\.venv\Scripts\Activate.ps1
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Firebase Integration
- Frontend uses Firebase Auth for user authentication
- Backend validates Firebase JWT tokens
- Firebase Storage used for product images
- Service account credentials configured via environment variables

### API Documentation
Available at `/docs` (Swagger) and `/redoc` when backend is running.

## Single Test Execution

### Backend Individual Tests
```powershell
# Run a specific test file (execute from project root):
cd C:\Repositorio\mvintage
& .\backend\.venv\Scripts\Activate.ps1
python -m pytest backend/tests/test_auth_module.py -v

# Run a specific test function:
python -m pytest backend/tests/test_auth_module.py::test_specific_function -v

# Run tests with coverage:
python -m pytest backend/tests/ --cov=backend/app --cov-report=html
```

### Frontend Individual Tests  
```powershell
# Run specific test file:
cd C:\Repositorio\mvintage\frontend
npm run test -- test_file_name

# Run tests in watch mode:
npm run test -- --watch
```

## Linting and Code Quality

### Frontend Linting
```powershell
cd C:\Repositorio\mvintage\frontend
# Type checking (ALWAYS run before commits):
vue-tsc --noEmit

# Build for test environment (ALWAYS run after TypeScript fixes):
npm run build:test

# If ESLint is configured, run:
npm run lint
```

### Backend Code Quality
```powershell
cd C:\Repositorio\mvintage
& .\backend\.venv\Scripts\Activate.ps1
# Manual type checking with mypy (if configured):
python -m mypy backend/app/
```

## Critical Architecture Notes

### Product Variant System
- **Unique Products**: Set `is_unique=True` for single-variant products (no color/size options)
- **Multi-Variant Products**: Set `is_unique=False` and create ProductVariant entries for each combination
- **Stock Tracking**: Each ProductVariant has individual stock levels in Inventory table
- **Images**: ProductImage entities link to Product (not variant-specific)

### Authentication Flow
1. **Firebase Frontend**: User authenticates via Firebase Auth (supports Google, email/password)
2. **Token Validation**: Backend validates Firebase JWT tokens using Firebase Admin SDK  
3. **User Sync**: First login creates User record in local database with Firebase UID
4. **Role Assignment**: New users get default role; admin can assign Manager/Admin roles
5. **Protected Routes**: Use `Depends(get_current_user)` for authentication in FastAPI routes

### Environment Variable Priority
**Backend**: System environment > `.env.{ENVIRONMENT}` > `.env`
**Frontend**: Vite only loads `.env.{mode}` files (dev/test/pro modes)

### Database Migration Workflow

**AUTOMATIC MIGRATIONS**: Las migraciones se ejecutan automáticamente al iniciar la aplicación en entornos `development` y `test`.

```powershell
# After model changes, generate migration:
cd C:\Repositorio\mvintage
& .\backend\.venv\Scripts\Activate.ps1
alembic revision --autogenerate -m "Add new field to Product model"

# Review the generated migration file in backend/alembic/versions/
# Restart the application to apply migrations automatically
# OR apply manually if needed:
alembic upgrade head

# Rollback if needed:
alembic downgrade -1
```

**Important Notes:**
- **Development/Test**: Migrations run automatically on application startup
- **Production**: Migrations must be run manually for safety
- **New Models**: Simply restart the application after adding new models or fields

### Test Structure by Domain
- `test_auth_module.py` - Firebase auth, JWT validation, user management
- `test_master_data_module.py` - Colors, categories, sizes (foundational data)
- `test_products_module.py` - Product CRUD, variants, images, search
- `test_ecommerce_module.py` - Customer management, order processing
- `test_inventory_module.py` - Stock adjustments, low stock alerts
- `test_integration_complete.py` - End-to-end user flows (register → browse → order)

## MercadoPago Integration

### Payment Configuration
The application integrates with MercadoPago for payment processing:

**Environment Variables Required:**
- `MERCADOPAGO_ACCESS_TOKEN`: MercadoPago private access token
- `MERCADOPAGO_PUBLIC_KEY`: MercadoPago public key (for frontend)
- `MERCADOPAGO_WEBHOOK_SECRET`: Secret for webhook validation
- `FRONTEND_URL`: Frontend URL for payment redirects

**Payment Flow:**
1. **Create Preference**: POST `/api/v1/payments/create-preference`
2. **Process Payment**: User redirected to MercadoPago
3. **Webhook Notification**: POST `/api/v1/payments/webhook`
4. **Payment Status**: GET `/api/v1/payments/status/{order_id}`

**Order Payment States:**
- `payment_method`: transfer | mercadopago | cash
- `payment_status`: pending | pending_payment | approved | rejected | cancelled
- `mercadopago_payment_id`: MercadoPago payment ID (nullable)
- `mercadopago_preference_id`: MercadoPago preference ID (nullable)

### Payment Result Pages
Frontend handles payment results with specific routes:
- `/payment/success` - Successful payment
- `/payment/failure` - Failed payment  
- `/payment/pending` - Pending payment

## Dependencies and Packages

### Backend Key Dependencies
- `fastapi==0.116.1` - Web framework
- `sqlmodel==0.0.24` - Type-safe SQL models
- `alembic==1.16.4` - Database migrations
- `firebase-admin==6.6.0` - Firebase integration
- `mercadopago==2.3.0` - Payment processing
- `pytest==8.4.1` - Testing framework

### Frontend Key Dependencies
- `vue@^3.5.18` - Frontend framework
- `typescript@~5.8.3` - Type safety
- `vite@^7.0.4` - Build tool
- `tailwindcss@^3.4.0` - CSS framework
- `pinia@^3.0.3` - State management
- `axios@^1.11.0` - HTTP client
- `firebase@^12.0.0` - Firebase SDK
- `vitest@^2.0.4` - Testing framework

## Documentation Maintenance Policy

**CRITICAL: Always update documentation when making changes**

Whenever implementing improvements, new features, or architectural changes, you MUST update the relevant documentation files:

### Required Documentation Updates
1. **CLAUDE.md** - Update if changes affect:
   - Development commands or workflows
   - Architecture patterns or conventions
   - Environment setup or configuration
   - Testing procedures

2. **README.md** - Update if changes affect:
   - Setup instructions
   - API endpoints
   - General project information
   - Deployment procedures

3. **docs/structure.md** - Update if changes affect:
   - New components, models, or modules
   - Project structure reorganization
   - Component relationships or responsibilities

4. **docs/tech-stack.md** - Update if changes affect:
   - New technologies or libraries
   - Technical architecture changes
   - Integration patterns
   - Development tool changes

5. **docs/planning.md** - Update if changes affect:
   - Completed milestones
   - New development objectives
   - Roadmap modifications

### Documentation Update Process
1. **Implement** the code changes
2. **Test** the implementation thoroughly
3. **Update** all relevant documentation files listed above
4. **Verify** documentation accuracy and consistency
5. **Commit** both code and documentation together

**IMPORTANT**: Documentation updates are not optional - they are a required part of every significant change to ensure future Claude Code instances have complete and accurate context.

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.