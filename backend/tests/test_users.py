import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def login_token(client):
    # Primero registrar el usuario si no existe
    register_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "test123"
    }
    client.post("/api/v1/auth/register", json=register_data)
    login_data = {
        "username": "testuser",
        "password": "test123"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.cookies
    return response.cookies["access_token"]

def test_get_current_user(client, login_token):
    response = client.get("/api/v1/auth/me", cookies={"access_token": login_token})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["success"] is True
