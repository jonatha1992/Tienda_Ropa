import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_firebase_user():
    return {
        'uid': 'test_firebase_uid_123',
        'email': 'testuser@example.com',
        'name': 'Test User',
        'email_verified': True
    }

def test_get_current_user(client, mock_firebase_user):
    # Creamos una función mock que devuelve el usuario Firebase
    def mock_verify_token(*args, **kwargs):
        return mock_firebase_user
    
    # Sobrescribimos la dependencia en la aplicación
    from app.routes.users import router
    from app.auth_firebase import verify_firebase_token
    
    # Usamos dependency_overrides para reemplazar la función de verificación
    app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user
    
    try:
        headers = {"Authorization": "Bearer mock_firebase_token"}
        response = client.get("/api/v1/users/me", headers=headers)
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.content}")
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == mock_firebase_user["email"]
        assert data["firebase_uid"] == mock_firebase_user["uid"]
    finally:
        # Limpiar el override
        app.dependency_overrides.clear()
