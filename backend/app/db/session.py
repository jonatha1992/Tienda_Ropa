from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# Use DATABASE_URL from environment, fallback to SQLite for development
DATABASE_URL = settings.DATABASE_URL

# Configure engine based on database type
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL configuration for Railway
    engine = create_engine(
        DATABASE_URL,
        echo=settings.ENVIRONMENT == "development",
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=300,    # Recycle connections every 5 minutes
    )
else:
    # SQLite configuration for local development
    engine = create_engine(DATABASE_URL, echo=True)


# Función para obtener sesión en rutas FastAPI
def get_session(custom_engine=None):
    eng = custom_engine if custom_engine is not None else engine
    with Session(eng) as session:
        yield session
