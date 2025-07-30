from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./db.sqlite3"
engine = create_engine(DATABASE_URL, echo=True)

# Crear la base de datos y las tablas si no existen                                         
## SQLModel.metadata.create_all(engine)  # Usar solo migraciones Alembic

# Función para obtener sesión en rutas FastAPI
def get_session():
    with Session(engine) as session:
        yield session
