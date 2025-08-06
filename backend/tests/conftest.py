
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
def auth_cookie(client, db_session):
    # Para Firebase Auth, necesitamos simular un token válido
    # En lugar de hacer login tradicional, devolvemos headers de autorización
    from app.auth_firebase import verify_firebase_token
    from app.models.user import User
    from app.models.role import Role, RoleType
    from app.models.user_role import UserRole
    
    # Mock Firebase user para las pruebas
    mock_firebase_user = {
        'uid': 'test_firebase_uid_api_test',
        'email': 'apitest@example.com',
        'name': 'API Test User',
        'email_verified': True
    }
    
    # Crear el usuario en la base de datos si no existe
    existing_user = db_session.query(User).filter(User.firebase_uid == mock_firebase_user['uid']).first()
    if not existing_user:
        # Crear roles si no existen
        admin_role = db_session.query(Role).filter(Role.name == RoleType.ADMIN).first()
        if not admin_role:
            admin_role = Role(name=RoleType.ADMIN, description="Administrator role")
            db_session.add(admin_role)
            db_session.commit()
            db_session.refresh(admin_role)
        
        # Crear el usuario
        test_user = User(
            firebase_uid=mock_firebase_user['uid'],
            email=mock_firebase_user['email'],
            username=mock_firebase_user['email'].split('@')[0],
            nombre=mock_firebase_user['name']
        )
        db_session.add(test_user)
        db_session.commit()
        db_session.refresh(test_user)
        
        # Asignar rol de administrador al usuario de test
        user_role = UserRole(user_id=test_user.id, role_id=admin_role.id)
        db_session.add(user_role)
        db_session.commit()
    
    # Sobrescribir la dependencia de Firebase auth
    app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user
    
    return {
        "Authorization": "Bearer mock_firebase_token_for_testing"
    }
