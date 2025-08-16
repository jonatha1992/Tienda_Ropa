# Estructura del Proyecto

## Monorepo

El proyecto está organizado como un monorepo con dos carpetas principales:

- `frontend/`: Contiene el código fuente de la aplicación Vue 3.
- `backend/`: Contiene el código fuente de la API de FastAPI.

## Frontend (`frontend/`)

```
frontend/
├── public/ # Archivos estáticos
├── src/
│   ├── assets/ # Imágenes, fuentes, etc.
│   ├── components/ # Componentes de Vue reutilizables
│   ├── views/ # Vistas de página completas
│   ├── router/ # Configuración de Vue Router
│   ├── store/ # Módulos de Pinia para gestión de estado
│   ├── services/ # Lógica de negocio y comunicación con APIs
│   ├── types/ # Definiciones de tipos de TypeScript
│   ├── main.ts # Punto de entrada de la aplicación
│   └── App.vue # Componente raíz de Vue
├── package.json # Dependencias y scripts
└── vite.config.ts # Configuración de Vite
```

## Backend (`backend/`)

```
backend/
├── app/
│   ├── api/
│   │   └── v1/ # Endpoints de la API v1
│   ├── core/ # Configuración de la aplicación
│   ├── db/ # Sesión y conexión a la base de datos
│   ├── models/ # Modelos de SQLModel
│   ├── schemas/ # Esquemas de Pydantic (si se usan por separado)
│   └── main.py # Punto de entrada de la API
├── alembic/ # Migraciones de base de datos
├── tests/ # Pruebas de Pytest
├── .env # Variables de entorno
└── requirements.txt # Dependencias de Python
```
