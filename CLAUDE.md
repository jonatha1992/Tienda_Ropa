# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (FastAPI + Python)
```powershell
# REQUIRED startup sequence - ALWAYS check if port 8000 is in use first:
netstat -an | findstr :8000

# If no output, start backend (IMPORTANT: execute from project root):
cd C:\Repositorio\Tienda_Ropa
& .\backend\.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend (Vue 3 + TypeScript)
```powershell
# REQUIRED startup sequence - ALWAYS check if port 5173 is in use first:
netstat -an | findstr :5173

# If no output, start frontend:
cd C:\Repositorio\Tienda_Ropa\frontend
npm run dev
```

### Testing
```powershell
# Backend tests (execute from project root):
cd C:\Repositorio\Tienda_Ropa
& .\backend\.venv\Scripts\Activate.ps1
python -m pytest backend/tests/

# Frontend tests:
cd C:\Repositorio\Tienda_Ropa\frontend
npm run test
```

### Build Commands
```powershell
# Frontend production build:
cd C:\Repositorio\Tienda_Ropa\frontend
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
cd C:\Repositorio\Tienda_Ropa
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