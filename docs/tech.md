# Technical Documentation

## Tech Stack Overview

### Architecture Pattern
- **Full-stack application** with separate frontend and backend services
- **RESTful API** architecture with JWT authentication
- **Role-based access control** for user permissions
- **Multi-environment** configuration (dev/test/production)

## Backend Stack

### Core Framework
- **FastAPI (Python)** - Modern async web framework
- **SQLAlchemy 2.x** - Object-relational mapping
- **SQLModel** - Type-safe SQL models with Pydantic integration
- **Pydantic v2** - Data validation and serialization
- **Uvicorn** - ASGI server

### Database & Migrations
- **PostgreSQL** - Production database (Railway)
- **SQLite** - Development database
- **Alembic** - Database migration management with automatic execution in dev/test

### Authentication & Security
- **Firebase Auth** - User authentication
- **JWT tokens** - API authentication
- **Role-based access control** - User permissions

### Development Tools
- **Python Virtual Environment** - Dependency isolation
- **pytest** - Testing framework
- **Requirements.txt** - Dependency management

## Frontend Stack

### Core Framework
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** as build tool and dev server
- **Tailwind CSS** for styling

### State Management & Routing
- **Pinia** for global state management
- **Vue Router** for client-side routing
- **Axios** for HTTP client with interceptors

### Development Tools
- **ESLint** + **Prettier** for code formatting
- **TypeScript compiler** for type checking
- **Vite HMR** for fast development

### Testing & Quality
- **Vitest** for unit testing (configured)
- **TypeScript strict mode** enabled
- **Component testing** with Vue Testing Library

### Deployment & Infrastructure
- **Firebase Hosting** for static site hosting
- **Firebase Storage** for image/file storage
- **Environment-specific builds** (dev/test/production)

## Backend Stack

### Core Framework
- **FastAPI** (Python) for REST API
- **Uvicorn** ASGI server for production
- **SQLModel** (SQLAlchemy + Pydantic) for ORM and validation
- **Pydantic v2** for data validation and serialization

### Database & Persistence
- **PostgreSQL** for production database (Railway)
- **SQLite** for development database
- **Alembic** for database migrations
- **SQLAlchemy 2.x** ORM with async support

### Authentication & Security
- **Firebase Auth** integration for user management
- **JWT tokens** for API authentication
- **Role-based permissions** with User/Role/UserRole models
- **CORS** configuration for cross-origin requests
- **Firebase Admin SDK** for token verification

### Development & Testing
- **pytest** for testing framework
- **pytest-asyncio** for async testing
- **Virtual environment** with Python 3.11+
- **Requirements.txt** for dependency management

### Deployment & Infrastructure
- **Railway** for backend hosting and PostgreSQL
- **Docker** containerization ready
- **Environment configuration** with multiple .env files
- **Health check endpoints** for monitoring

## Database Design

### Core Models
- **Product/ProductVariant/ProductImage**: E-commerce catalog with variants
- **User/Role/UserRole**: Authentication and authorization
- **Customer/Order/OrderItem**: Order management
- **Inventory**: Stock tracking and management
- **Master Data**: Colors, categories, sizes for product attributes

### Key Features
- **Multi-variant products** with individual stock tracking
- **Firebase/Local user synchronization**
- **Audit trails** for inventory changes
- **Relational constraints** with proper foreign keys
- **SQLModel integration** for type safety

## Development Environment

### Windows-Specific Configuration
- **PowerShell** as primary shell
- **`;` command separator** instead of `&&`
- **Port checking** before service startup: `netstat -an | findstr :PORT`
- **Virtual environment activation**: `& .\.venv\Scripts\Activate.ps1`

### Required Ports
- **Backend**: 8000 (uvicorn FastAPI server)
- **Frontend**: 5173 (Vite development server)
- **Database**: 5432 (PostgreSQL, when running locally)

### Environment Files
```
backend/
├── .env.dev      # Development configuration
├── .env.test     # Test environment
└── .env.pro      # Production (not committed)

frontend/
├── .env.dev      # Frontend development
└── .env.test     # Frontend test environment
```

## Integration & Operations

### Firebase Integration
- **Authentication**: User login/registration with social providers
- **Storage**: Product image uploads and management
- **Admin SDK**: Backend token verification
- **User sync**: Automatic user creation in local database

### API Design
- **RESTful endpoints** with `/api/v1/` prefix
- **OpenAPI/Swagger documentation** at `/docs`
- **Structured error responses** with proper HTTP codes
- **Request/Response validation** with Pydantic models

### Security Best Practices
- **JWT token validation** on protected routes
- **Role-based endpoint protection**
- **Environment variables** for sensitive configuration
- **CORS policy** configuration
- **Input validation** on all endpoints

### Testing Strategy
- **Unit tests** for business logic
- **Integration tests** for API endpoints
- **Test database isolation** with fixtures
- **Mocked external services** (Firebase) in tests

### Deployment Pipeline
- **Multi-environment builds** with different configurations
- **Environment-specific deployments**
- **Database migrations** with Alembic
- **Health check endpoints** for monitoring

### Monitoring & Maintenance
- **Structured logging** for debugging
- **Error tracking** and monitoring
- **Database backup strategies**
- **Performance monitoring** for API endpoints