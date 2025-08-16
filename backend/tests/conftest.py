
"""
Configuración global de tests para la aplicación Tienda Ropa.
Proporciona fixtures comunes y configuración de base de datos de prueba.
"""
import sys
import os

# Cambiar al directorio backend para que los archivos .env se carguen correctamente
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

# Configurar entorno ANTES de importar settings
os.environ["ENVIRONMENT"] = "dev"

# También configurar la DATABASE_URL directamente para tests si no está configurada
if not os.environ.get("DATABASE_URL"):
    os.environ["DATABASE_URL"] = "sqlite:///./test_app.db"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, Session
import sqlmodel
from app.main import app
from app.db.session import get_session


# Configuración de la base de datos de test: usar base de datos de desarrollo
EXPLICIT_URL = os.getenv("TEST_DATABASE_URL")
PERSIST = os.getenv("TEST_PERSIST") == "1"

if EXPLICIT_URL:
    SQLALCHEMY_DATABASE_URL = EXPLICIT_URL
else:
    # Usar la misma base de datos de desarrollo para tests
    SQLALCHEMY_DATABASE_URL = "postgresql://postgres:RjNOCBmzcBdVPEaVUbFbFKFHBjcdnOya@gondola.proxy.rlwy.net:52848/railway"

print(f"[TEST DB] Using: {SQLALCHEMY_DATABASE_URL} (persist={PERSIST})")

# Configuración del engine para PostgreSQL
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    future=True
)

TestingSessionLocal = sessionmaker(class_=Session, autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Importar todos los modelos para que SQLModel los conozca
    from app.models.master_data import Color, Category, Size
    from app.models.user import User
    from app.models.role import Role
    from app.models.user_role import UserRole
    from app.models.product import Product, ProductImage, ProductVariant
    from app.models.customer import Customer
    from app.models.order import Order
    from app.models.order_item import OrderItem
    from app.models.inventory import Inventory
    
    # Eliminar todas las tablas primero para asegurar un estado limpio
    SQLModel.metadata.drop_all(bind=engine)
    
    # Crear todas las tablas antes de los tests
    SQLModel.metadata.create_all(bind=engine)
    
    # Inicializar datos maestros (siempre, ya que eliminamos las tablas arriba)
    with TestingSessionLocal() as db:
        from sqlmodel import select
        
        try:
            # Inicializar datos de prueba con colores más estéticos
            colors = [
                Color(name="BLANCO", hex_code="#FFFFFF", is_active=True),
                Color(name="NEGRO", hex_code="#1C1C1C", is_active=True), 
                Color(name="ROJO BORGOÑA", hex_code="#800020", is_active=True),
                Color(name="AZUL MARINO", hex_code="#1E3A8A", is_active=True),
                Color(name="VERDE OLIVA", hex_code="#6B7280", is_active=True),
                Color(name="BEIGE", hex_code="#F5F5DC", is_active=True),
                Color(name="CORAL LIVING", hex_code="#FF6F61", is_active=True),
                Color(name="AZUL SERENITY", hex_code="#88B0D1", is_active=True),
            ]
            for color in colors:
                db.add(color)
            
            categories = [
                Category(name="VESTIDOS", description="Vestidos de todo tipo", is_active=True),
                Category(name="REMERAS", description="Remeras y camisetas", is_active=True),
                Category(name="PANTOLONES", description="Pantalones largos", is_active=True),
            ]
            for category in categories:
                db.add(category)
                
            sizes = [
                Size(name="S", numeric_size=90, order=1, is_active=True),
                Size(name="M", numeric_size=95, order=2, is_active=True),
                Size(name="L", numeric_size=100, order=3, is_active=True),
            ]
            for size in sizes:
                db.add(size)
                
            db.commit()
            print("✅ Test data initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing test data: {e}")
            db.rollback()
            raise
    
    yield
    # No eliminar las tablas para mantener los datos

@pytest.fixture()
def db_session():
    """Sesión por test.
    Si PERSIST es False, cada test se aísla con transacción y rollback.
    """
    connection = engine.connect()
    tx = connection.begin()
    db = TestingSessionLocal(bind=connection)  # type: ignore
    try:
        yield db
        if PERSIST:
            tx.commit()
    finally:
        if not PERSIST:
            tx.rollback()
        db.close()
        connection.close()


@pytest.fixture()
def client(db_session):
    # Dependency override para usar la sesión de test
    def override_get_session():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture()
def auth_cookie(client, db_session):
    # Para Firebase Auth, necesitamos simular un token válido
    # En lugar de hacer login tradicional, devolvemos headers de autorización
    from app.core.auth_firebase import verify_firebase_token
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
