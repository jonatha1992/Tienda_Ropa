
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'backend')))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from sqlmodel import SQLModel

from app.main import app
from app.db.session import get_session


# Configuración de la base de datos de test
from sqlmodel import create_engine, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./db.sqlite3"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(class_=Session, autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Crear todas las tablas antes de los tests
    SQLModel.metadata.create_all(bind=engine)
    yield
    # Limpiar las tablas después de los tests
    SQLModel.metadata.drop_all(bind=engine)

@pytest.fixture()
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(db_session):
    # Dependency override para usar la sesión de test
    def override_get_session():
        yield db_session
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture()
def auth_cookie(client):
    # Para Firebase Auth, necesitamos simular un token válido
    # En lugar de hacer login tradicional, devolvemos headers de autorización
    from app.auth_firebase import verify_firebase_token
    
    # Mock Firebase user para las pruebas
    mock_firebase_user = {
        'uid': 'test_firebase_uid_api_test',
        'email': 'apitest@example.com',
        'name': 'API Test User',
        'email_verified': True
    }
    
    # Sobrescribir la dependencia de Firebase auth
    app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user
    
    return {
        "Authorization": "Bearer mock_firebase_token_for_testing"
    }
