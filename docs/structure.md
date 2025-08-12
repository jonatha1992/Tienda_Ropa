# Project Structure Documentation

## Overview
Tienda_Ropa is a full-stack e-commerce application for clothing store management with role-based access control and inventory management.

## Directory Structure

<<<<<<< HEAD
  A --> B[backend/]
  B --> B1[app/]
  B1 --> B11[api/]
  B11 --> B12[v1/]
  B12 --> B13[endpoints/]
  B13 --> B14[items.py]
  B1 --> B3[db/session.py]
  B1 --> B4[models/user.py]
  B --> BA[alembic/]
  B --> BAI[alembic.ini]
  B1 --> B5[main.py]
  B --> BR[requirements.txt]
  B --> BD[Dockerfile]
  B --> BE[.env.example]

  A --> F[frontend/]
  F --> FS[src/]
  FS --> FSM[main.ts]
  FS --> FSA[App.vue]
  FS --> FSF[firebase.ts]
  F --> FI[index.html]
  F --> FP[package.json]
  F --> FT[tsconfig.json]
  F --> FV[vite.config.ts]
  F --> FE[.eslintrc.cjs]
  F --> FENV[.env.example]
  F --> FD[Dockerfile]
=======
```
Tienda_Ropa/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── controllers/        # Business logic controllers
│   │   │   ├── auth_controller.py
│   │   │   ├── customer_controller.py
│   │   │   ├── inventory_controller.py
│   │   │   ├── master_data_controller.py
│   │   │   ├── order_controller.py
│   │   │   ├── product_controller.py
│   │   │   └── user_controller.py
│   │   ├── core/               # Core configuration and utilities
│   │   │   ├── auth.py         # Firebase auth integration
│   │   │   ├── config.py       # Environment configuration
│   │   │   └── security.py     # Security utilities
│   │   ├── db/                 # Database configuration
│   │   │   └── session.py      # Database session management
│   │   ├── models/             # SQLModel data models
│   │   │   ├── auth.py         # User, Role, UserRole models
│   │   │   ├── customer.py     # Customer model
│   │   │   ├── inventory.py    # Inventory model
│   │   │   ├── master_data.py  # Color, Category, Size models
│   │   │   ├── order.py        # Order, OrderItem models
│   │   │   └── product.py      # Product, ProductVariant, ProductImage models
│   │   ├── routes/             # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── customers.py
│   │   │   ├── inventory.py
│   │   │   ├── master_data.py
│   │   │   ├── orders.py
│   │   │   ├── products.py
│   │   │   └── users.py
│   │   └── main.py             # FastAPI application entry point
│   ├── tests/                  # Backend test suite
│   │   ├── conftest.py         # Test configuration
│   │   └── test_basic_essential.py
│   ├── alembic/                # Database migration files
│   ├── .env.dev                # Development environment variables
│   ├── .env.test               # Test environment variables
│   ├── .venv/                  # Python virtual environment
│   └── requirements.txt        # Python dependencies
├── frontend/                   # Vue 3 frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable Vue components
│   │   │   ├── Navbar.vue
│   │   │   └── ...
│   │   ├── views/              # Page-level components
│   │   ├── store/              # Pinia state management
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── router.ts           # Vue Router configuration
│   │   ├── api.ts              # API client configuration
│   │   ├── App.vue             # Root component
│   │   └── main.ts             # Application entry point
│   ├── .env.dev                # Frontend development variables
│   ├── .env.test               # Frontend test variables
│   ├── package.json            # Node.js dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite build configuration
├── docs/                       # Project documentation
│   ├── structure.md            # This file
│   ├── tech-stack.md           # Technical documentation
│   └── planning.md             # Project planning and roadmap
├── .claude/                    # Claude Code configuration
├── CLAUDE.md                   # Claude Code project instructions
└── README.md                   # Project overview and setup
```

## Key Components
>>>>>>> dev

### Backend Models
- **Product**: Main product entity with `is_unique` flag for single vs multi-variant products
- **ProductVariant**: Color/size combinations with individual stock tracking
- **ProductImage**: Multiple images per product with Firebase Storage integration
- **User/Role/UserRole**: Role-based access control system
- **Customer**: Customer information and management
- **Order/OrderItem**: E-commerce order processing
- **Inventory**: Stock management and tracking
- **Master Data**: Colors, categories, sizes for product attributes

### Frontend Structure
- **Components**: Reusable UI components using Vue 3 Composition API
- **Views**: Page-level components for routing
- **Store**: Pinia stores for global state management
- **Types**: Centralized TypeScript interfaces
- **API**: Axios-based API client with authentication

### Database Architecture
- Development: SQLite (app.db)
- Production: PostgreSQL on Railway
- Migrations: Alembic for schema versioning
- ORM: SQLAlchemy with SQLModel for type safety

### Authentication Flow
1. Frontend: Firebase Auth for user login/registration
2. Backend: Firebase JWT token validation
3. Role-based permissions for API endpoints
4. User synchronization between Firebase and local database

## Development Workflow

### Port Management
- Backend: Port 8000 (uvicorn)
- Frontend: Port 5173 (Vite dev server)
- Always check ports before starting services

### Windows Command Conventions
- Use `;` instead of `&&` for command concatenation
- Use PowerShell activation: `& .\.venv\Scripts\Activate.ps1`
- Use `netstat -an | findstr :PORT` to check port availability

### Environment Management
- Multiple environment files (.env.dev, .env.test, .env.pro)
- Environment-specific builds and configurations
- Firebase integration for both auth and storage

## Architecture (High Level)

```
Users/Store --> Frontend (Vue 3 + TS) --> Backend (FastAPI) --> Database (PostgreSQL)
                   |                                                    
                   └--> Firebase Storage (Images)
```

**Components:**
- **Frontend**: Vue 3 + TypeScript (Firebase Hosting)
- **Backend**: FastAPI (Railway)
- **Database**: PostgreSQL
- **Storage**: Firebase Storage
- **Users**: Physical store staff and customers