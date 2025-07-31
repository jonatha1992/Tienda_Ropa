from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./db.sqlite3"
engine = create_engine(DATABASE_URL, echo=True)


# Función para obtener sesión en rutas FastAPI
def get_session(custom_engine=None):
    eng = custom_engine if custom_engine is not None else engine
    with Session(eng) as session:
        yield session
