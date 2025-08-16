# Project Overview

This is a full-stack e-commerce application designed to manage both a physical store's inventory and an online storefront. It features a Vue.js frontend and a FastAPI backend.

**Key Technologies:**

*   **Frontend:** Vue 3, TypeScript, Vite, Pinia, TailwindCSS
*   **Backend:** FastAPI, Python, PostgreSQL
*   **Deployment:** Firebase Hosting (frontend), Railway (backend)
*   **Authentication:** Firebase Authentication
*   **Storage:** Firebase Storage for product images.

**Architecture:**

The application is divided into two main components:

*   `frontend`: A single-page application (SPA) built with Vue.js that provides the user interface for both customers and administrators.
*   `backend`: A RESTful API built with FastAPI that handles business logic, data storage, and authentication.

The application is designed to be deployed using Docker, with a `docker-compose.yml` file for local development.

# Building and Running

## Local Development (without Docker)

**Backend (FastAPI):**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Create a .env.dev file from the .env.example
Copy-Item .env.example .env.dev
# Edit .env.dev and set the DATABASE_URL
$env:ENVIRONMENT="dev"; uvicorn app.main:app --reload
```

**Frontend (Vue.js):**

```powershell
cd frontend
npm install
npm run dev
```

## Local Development (with Docker)

```bash
docker-compose up
```

## Deployment

**Backend (Railway):**

1.  Install the Railway CLI: `npm install -g @railway/cli`
2.  Login and link the project: `railway login` and `railway link`
3.  Set environment variables in the Railway dashboard.
4.  Deploy: `railway up`

**Frontend (Firebase):**

1.  Build the project: `npm run build`
2.  Deploy to Firebase: `firebase deploy`

# Development Conventions

*   **Environments:** The application uses `dev`, `test`, and `pro` environments, managed through `.env` files and environment variables.
*   **API:** The backend exposes a RESTful API with endpoints for products, customers, orders, and inventory. Interactive API documentation is available via Swagger UI (`/docs`) and ReDoc (`/redoc`) when the backend is running.
*   **Testing:** The frontend uses Vitest for unit testing. The backend testing setup is not explicitly defined in the provided files.
*   **Migrations:** Database migrations are handled by Alembic and are run automatically in `dev` and `test` environments. In `production`, they must be run manually.
