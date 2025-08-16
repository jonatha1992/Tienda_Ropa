# Project Structure Documentation

## Overview
Tienda_Ropa is a full-stack e-commerce application for clothing store management with role-based access control and inventory management.

## Directory Structure

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
│   │   │   ├── role_controller.py
│   │   │   └── user_controller.py
│   │   ├── core/               # Core configuration and utilities
│   │   │   ├── auth_firebase.py # Firebase auth integration
│   │   │   ├── config.py       # Environment configuration
│   │   │   └── security.py     # Security utilities
│   │   ├── db/                 # Database configuration
│   │   │   ├── session.py      # Database session management
│   │   │   └── migrations.py   # Automatic migration management
│   │   ├── models/             # SQLModel data models
│   │   │   ├── customer.py     # Customer model
│   │   │   ├── inventory.py    # Inventory model
│   │   │   ├── master_data.py  # Color, Category, Size models
│   │   │   ├── order.py        # Order model
│   │   │   ├── order_item.py   # OrderItem model
│   │   │   ├── product.py      # Product, ProductVariant, ProductImage models
│   │   │   ├── role.py         # Role model
│   │   │   ├── user.py         # User model
│   │   │   └── user_role.py    # UserRole model
│   │   ├── routes/             # API route handlers
│   │   │   ├── customers.py
│   │   │   ├── inventory.py
│   │   │   ├── master_data.py
│   │   │   ├── orders.py
│   │   │   ├── products.py
│   │   │   ├── roles.py
│   │   │   └── users.py
│   │   └── main.py             # FastAPI application entry point
│   ├── tests/                  # Backend test suite
│   │   ├── conftest.py         # Test configuration
│   │   ├── test_basic_essential.py
│   │   ├── test_master_data_module.py
│   │   └── test_roles_and_permissions.py
│   ├── alembic/                # Database migration files
│   │   └── versions/           # Migration versions
│   ├── .env.dev                # Development environment variables
│   ├── .env.test               # Test environment variables
│   ├── .venv/                  # Python virtual environment
│   └── requirements.txt        # Python dependencies
├── frontend/                   # Vue 3 frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable Vue components
│   │   │   ├── Chatbot.vue
│   │   │   ├── ConfirmationModal.vue
│   │   │   ├── Footer.vue
│   │   │   ├── HeroBanner.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── MasterDataShowcase.vue
│   │   │   ├── Navbar.vue
│   │   │   ├── ProductCard.vue
│   │   │   ├── ProductDetail.vue
│   │   │   ├── ProductGrid.vue
│   │   │   ├── RoleManagement.vue
│   │   │   ├── ShoppingCart.vue
│   │   │   └── UserManagement.vue
│   │   ├── views/              # Page-level components
│   │   │   ├── AdminView.vue
│   │   │   ├── AdminUserManagementView.vue
│   │   │   ├── AuthView.vue
│   │   │   ├── CheckoutView.vue
│   │   │   ├── CollectionView.vue
│   │   │   ├── ContactView.vue
│   │   │   ├── HomeView.vue
│   │   │   ├── HowToShopView.vue
│   │   │   ├── PrivacyView.vue
│   │   │   ├── ProductDetailView.vue
│   │   │   ├── ShippingView.vue
│   │   │   └── TermsView.vue
│   │   ├── config/             # Centralized configuration
│   │   │   ├── index.ts        # Re-exports for easy importing
│   │   │   ├── app.ts          # Application configuration
│   │   │   ├── api.ts          # API client and endpoints
│   │   │   └── firebase.ts     # Firebase configuration
│   │   ├── store/              # Pinia state management
│   │   │   ├── auth.ts         # Authentication store
│   │   │   └── cart.ts         # Shopping cart store
│   │   ├── composables/        # Vue composables (reusable logic)
│   │   │   └── useLoading.ts   # Loading state management
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── router.ts           # Vue Router configuration
│   │   ├── index.ts            # Project context and re-exports
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
- **Config**: Centralized configuration for API, Firebase, and app settings
- **Store**: Pinia stores for global state management (auth, cart)
- **Composables**: Reusable Vue logic (loading states, etc.)
- **Types**: Centralized TypeScript interfaces and type definitions
- **Context**: `index.ts` provides project-wide re-exports and documentation

### Database Architecture
- Development: SQLite (app.db)
- Production: PostgreSQL on Railway
- Migrations: Alembic for schema versioning
- ORM: SQLAlchemy with SQLModel for type safety

### Authentication Flow
1. Frontend: Firebase Auth for user login/registration
2. Backend: Firebase token validation and user synchronization
3. Role-based permissions for admin/manager/user access levels

## Development Workflow

### Environment Setup
- Backend uses Python virtual environment with specific .env files per environment
- Frontend uses Node.js with Vite and environment-specific configuration
- Multi-environment support: dev, test, production

### Database Migration Strategy
- **Automatic Migrations**: Development and test environments run migrations automatically on application startup
- **Manual Migrations**: Production environment requires manual migration execution for safety
- **Migration Files**: Generated with Alembic and stored in `backend/alembic/versions/`

### API Architecture
- RESTful endpoints under `/api/v1/` prefix
- Authentication via Firebase JWT tokens
- Response models using Pydantic/SQLModel
- Comprehensive error handling and validation

### Testing Strategy
- Backend: pytest with comprehensive test modules
- Frontend: Vitest for unit testing
- Integration tests for critical user flows
- Test data management via conftest.py