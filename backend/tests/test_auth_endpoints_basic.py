"""
Tests básicos para endpoints de usuarios con autenticación Firebase
Versión simplificada que se enfoca en casos principales
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


class TestUsersEndpointsBasic:
    """Tests básicos para endpoints de usuarios autenticados"""

    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_get_me_no_authorization_header(self, client):
        """Test GET /users/me sin header de autorización"""
        response = client.get("/api/v1/users/me")
        
        assert response.status_code == 403
        data = response.json()
        assert "detail" in data
        assert "Not authenticated" in data["detail"]

    def test_get_me_invalid_authorization_format(self, client):
        """Test GET /users/me con formato de autorización inválido"""
        headers = {"Authorization": "InvalidFormat token_here"}
        response = client.get("/api/v1/users/me", headers=headers)
        
        assert response.status_code == 403
        data = response.json()
        assert "detail" in data

    def test_get_me_invalid_firebase_token(self, client):
        """Test GET /users/me con token Firebase inválido"""
        headers = {"Authorization": "Bearer invalid_firebase_token"}
        response = client.get("/api/v1/users/me", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert "Invalid Firebase token" in data["detail"]

    def test_get_me_empty_token(self, client):
        """Test GET /users/me con token vacío"""
        headers = {"Authorization": "Bearer "}
        response = client.get("/api/v1/users/me", headers=headers)
        
        # Token vacío puede dar 401 o 403 dependiendo de la implementación
        assert response.status_code in [401, 403]
        data = response.json()
        assert "detail" in data

    def test_get_me_malformed_token(self, client):
        """Test GET /users/me con token malformado"""
        headers = {"Authorization": "Bearer malformed.token.here"}
        response = client.get("/api/v1/users/me", headers=headers)
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert "Invalid Firebase token" in data["detail"]


class TestCorsConfiguration:
    """Tests para verificar configuración CORS"""

    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_cors_preflight_request(self, client):
        """Test OPTIONS request para verificar CORS"""
        headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization"
        }
        
        response = client.options("/api/v1/users/me", headers=headers)
        
        # CORS debería estar configurado
        assert response.status_code in [200, 204]


class TestHealthEndpoint:
    """Tests para el endpoint de salud"""

    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_health_endpoint(self, client):
        """Test que el endpoint de salud funcione"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data == {"status": "ok"}

    def test_health_endpoint_no_auth_required(self, client):
        """Test que el endpoint de salud no requiera autenticación"""
        # Sin headers de autorización
        response = client.get("/health")
        
        assert response.status_code == 200


class TestApiRouting:
    """Tests para verificar que el routing de la API funcione"""

    @pytest.fixture
    def client(self):
        return TestClient(app)

    def test_users_route_exists(self, client):
        """Test que la ruta de usuarios exista"""
        # Aunque falle por auth, la ruta debe existir
        response = client.get("/api/v1/users/me")
        
        # No debe ser 404 (Not Found)
        assert response.status_code != 404

    def test_api_prefix_routing(self, client):
        """Test que el prefijo /api/v1 funcione"""
        response = client.get("/api/v1/users/me")
        
        # La ruta debe existir (aunque falle por auth)
        assert response.status_code != 404

    def test_invalid_route_returns_404(self, client):
        """Test que rutas inexistentes retornen 404"""
        response = client.get("/api/v1/nonexistent/route")
        
        assert response.status_code == 404
