"""
Tests integrados para el módulo de autenticación y autorización.
Incluye usuarios, roles, Firebase auth y endpoints protegidos.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


class TestAuthenticationBasics:
    """Tests básicos de autenticación Firebase"""

    def test_health_endpoint_no_auth_required(self, client):
        """Test que el endpoint de salud no requiera autenticación"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}

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
        assert response.status_code in [401, 403]
        data = response.json()
        assert "detail" in data

    def test_cors_preflight_request(self, client):
        """Test OPTIONS request para verificar CORS"""
        headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization"
        }
        response = client.options("/api/v1/users/me", headers=headers)
        assert response.status_code in [200, 204]


class TestUserManagement:
    """Tests para gestión de usuarios autenticados"""

    def test_get_current_user_with_mock_auth(self, client, auth_cookie):
        """Test obtener usuario actual con autenticación mock"""
        response = client.get("/api/v1/users/me", headers=auth_cookie)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "firebase_uid" in data
        assert data["email"] == "apitest@example.com"

    def test_user_created_automatically_on_first_login(self, client, auth_cookie, db_session):
        """Test que el usuario se cree automáticamente en el primer login"""
        from app.models.user import User
        from sqlmodel import select
        
        # Verificar que el usuario de test existe en la BD
        user = db_session.exec(select(User).where(User.firebase_uid == "test_firebase_uid_api_test")).first()
        assert user is not None
        assert user.email == "apitest@example.com"
        assert user.username == "apitest"


class TestRoleManagement:
    """Tests para gestión de roles y autorización"""

    def test_get_roles_with_auth(self, client, auth_cookie):
        """Test obtener lista de roles"""
        response = client.get("/api/v1/roles", headers=auth_cookie)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_user_has_admin_role(self, client, auth_cookie, db_session):
        """Test que el usuario de test tenga rol de administrador"""
        from app.models.user import User
        from app.models.role import Role
        from app.models.user_role import UserRole
        from sqlmodel import select
        
        # Obtener el usuario de test
        user = db_session.exec(select(User).where(User.firebase_uid == "test_firebase_uid_api_test")).first()
        assert user is not None
        
        # Verificar que tiene rol de administrador
        admin_role = db_session.exec(select(Role).where(Role.name == "admin")).first()
        assert admin_role is not None
        
        user_role = db_session.exec(select(UserRole).where(
            UserRole.user_id == user.id,
            UserRole.role_id == admin_role.id
        )).first()
        assert user_role is not None


class TestEndpointProtection:
    """Tests para verificar que los endpoints estén protegidos correctamente"""

    @pytest.mark.parametrize("endpoint", [
        "/api/v1/users/me",
        "/api/v1/roles/",
        "/api/v1/customers/",
        "/api/v1/orders/",
        "/api/v1/inventory/",
        "/api/v1/order-items/"
    ])
    def test_protected_endpoints_require_auth(self, client, endpoint):
        """Test que los endpoints protegidos requieran autenticación"""
        response = client.get(endpoint)
        assert response.status_code in [401, 403]

    @pytest.mark.parametrize("endpoint", [
        "/api/v1/colors",
        "/api/v1/categories", 
        "/api/v1/categories/with-stock",
        "/api/v1/sizes",
        "/api/v1/products/"  # Los productos son públicos para consulta (con slash final)
    ])
    def test_public_endpoints_no_auth_required(self, client, endpoint):
        """Test que los endpoints públicos no requieran autenticación"""
        response = client.get(endpoint)
        assert response.status_code == 200

    def test_invalid_route_returns_404(self, client):
        """Test que rutas inexistentes retornen 404"""
        response = client.get("/api/v1/nonexistent/route")
        assert response.status_code == 404


class TestApiRouting:
    """Tests para verificar que el routing de la API funcione"""

    def test_api_prefix_routing(self, client):
        """Test que el prefijo /api/v1 funcione"""
        response = client.get("/api/v1/users/me")
        # La ruta debe existir (aunque falle por auth)
        assert response.status_code != 404

    def test_users_route_exists(self, client):
        """Test que la ruta de usuarios exista"""
        response = client.get("/api/v1/users/me")
        assert response.status_code != 404

    def test_all_main_routes_exist(self, client):
        """Test que todas las rutas principales existan"""
        # Rutas que no requieren base de datos
        simple_routes = [
            "/api/v1/colors",    # Público - master data
            "/api/v1/categories", # Público - master data
            "/api/v1/sizes"      # Público - master data
        ]
        
        # Rutas que pueden fallar por auth pero deben existir (no 404)
        auth_routes = [
            "/api/v1/users/me",
            "/api/v1/roles/",
            "/api/v1/customers/",
            "/api/v1/orders/",
            "/api/v1/inventory/",
            "/api/v1/order-items/"
        ]
        
        # Rutas que requieren BD pero deben existir
        db_routes = [
            "/api/v1/products/"   # Público pero requiere BD
        ]
        
        # Test rutas simples - deberían funcionar perfectamente
        for route in simple_routes:
            response = client.get(route)
            assert response.status_code == 200, f"Route {route} should work and return 200"
        
        # Test rutas de auth - pueden fallar por auth pero no por 404
        for route in auth_routes:
            response = client.get(route)
            assert response.status_code != 404, f"Route {route} should exist (got {response.status_code})"
            assert response.status_code in [401, 403, 200], f"Route {route} should return auth error or success"
        
        # Test rutas de BD - pueden fallar por BD pero no por 404
        for route in db_routes:
            response = client.get(route)
            assert response.status_code != 404, f"Route {route} should exist (got {response.status_code})"
            # Puede ser 200 (success) o 500 (DB error) pero no 404
