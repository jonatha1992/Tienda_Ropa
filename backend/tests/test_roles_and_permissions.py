"""
Tests específicos para el sistema de roles y permisos.
Cubre la funcionalidad de autenticación, roles y acceso a endpoints administrativos.
"""
import pytest
from fastapi.testclient import TestClient


class TestRolesSystem:
    """Tests del sistema de roles y permisos"""
    
    def test_get_available_roles(self, client, auth_cookie):
        """Test obtener todos los roles disponibles"""
        response = client.get("/api/v1/roles/", headers=auth_cookie)
        assert response.status_code == 200
        roles = response.json()
        assert isinstance(roles, list)
        
        # Verificar que existan roles básicos
        role_names = [role["name"] for role in roles]
        assert "admin" in role_names or "user" in role_names
    
    def test_get_my_roles(self, client, auth_cookie):
        """Test obtener roles del usuario actual"""
        response = client.get("/api/v1/roles/me/roles", headers=auth_cookie)
        assert response.status_code == 200
        roles = response.json()
        assert isinstance(roles, list)
        
        # El usuario de test debería tener al menos un rol
        assert len(roles) > 0
    
    def test_initialize_default_roles(self, client, auth_cookie):
        """Test inicializar roles por defecto"""
        response = client.post("/api/v1/roles/initialize", headers=auth_cookie)
        # Debería devolver 200 (roles creados) o algún código de éxito
        assert response.status_code in [200, 201, 409]  # 409 si ya existen
    
    def test_user_management_access_with_auth(self, client, auth_cookie):
        """Test acceso a gestión de usuarios con autenticación"""
        response = client.get("/api/v1/users/debug-all", headers=auth_cookie)
        # Con autenticación debería funcionar (asumiendo que el usuario test tiene permisos)
        assert response.status_code == 200
    
    def test_user_management_access_without_auth(self, client):
        """Test acceso a gestión de usuarios sin autenticación"""
        response = client.get("/api/v1/users/debug-all")
        # Sin autenticación debería fallar
        assert response.status_code == 403


class TestUserPermissions:
    """Tests de permisos específicos de usuario"""
    
    def test_current_user_info(self, client, auth_cookie):
        """Test obtener información del usuario actual"""
        response = client.get("/api/v1/users/me", headers=auth_cookie)
        assert response.status_code == 200
        user = response.json()
        
        # Verificar estructura básica del usuario
        assert "id" in user
        assert "email" in user
        assert "name" in user
        
        # El email debería ser el del usuario de test
        assert user["email"] == "apitest@example.com"
    
    def test_role_assignment_permissions(self, client, auth_cookie):
        """Test permisos para asignar roles"""
        # Primero obtener roles disponibles
        roles_response = client.get("/api/v1/roles/", headers=auth_cookie)
        assert roles_response.status_code == 200
        roles = roles_response.json()
        
        if not roles:
            pytest.skip("No hay roles disponibles para el test")
        
        # Obtener información del usuario actual
        user_response = client.get("/api/v1/users/me", headers=auth_cookie)
        assert user_response.status_code == 200
        user = user_response.json()
        
        # Intentar asignar un rol (debería funcionar con admin)
        role_data = {
            "user_id": user["id"],
            "role_id": roles[0]["id"]
        }
        
        assign_response = client.post("/api/v1/roles/assign", 
                                    json=role_data, 
                                    headers=auth_cookie)
        # Debería funcionar o dar conflicto si ya está asignado
        assert assign_response.status_code in [200, 201, 409]


class TestPublicVsProtectedEndpoints:
    """Tests para verificar qué endpoints son públicos vs protegidos"""
    
    def test_public_endpoints_no_auth_required(self, client):
        """Test endpoints públicos que NO requieren autenticación"""
        public_endpoints = [
            "/health",
            "/api/v1/categories",
            "/api/v1/categories/with-stock", 
            "/api/v1/colors",
            "/api/v1/sizes",
            "/api/v1/products/"
        ]
        
        for endpoint in public_endpoints:
            response = client.get(endpoint)
            # Los endpoints públicos deberían funcionar sin autenticación
            assert response.status_code == 200, f"Endpoint {endpoint} debería ser público"
    
    def test_protected_endpoints_require_auth(self, client):
        """Test endpoints protegidos que SÍ requieren autenticación"""
        protected_endpoints = [
            "/api/v1/users/me",
            "/api/v1/users/debug-all",
            "/api/v1/roles/me/roles",
            "/api/v1/customers/",
            "/api/v1/orders/"
        ]
        
        for endpoint in protected_endpoints:
            response = client.get(endpoint)
            # Los endpoints protegidos deberían rechazar sin autenticación
            assert response.status_code == 403, f"Endpoint {endpoint} debería estar protegido"
    
    def test_protected_endpoints_work_with_auth(self, client, auth_cookie):
        """Test endpoints protegidos funcionan CON autenticación"""
        protected_endpoints = [
            "/api/v1/users/me",
            "/api/v1/roles/me/roles"
        ]
        
        for endpoint in protected_endpoints:
            response = client.get(endpoint, headers=auth_cookie)
            # Con autenticación deberían funcionar
            assert response.status_code == 200, f"Endpoint {endpoint} debería funcionar con auth"


class TestMasterDataWithStock:
    """Tests específicos para la nueva funcionalidad de categorías con stock"""
    
    def test_categories_vs_categories_with_stock(self, client):
        """Test comparar categorías totales vs categorías con stock"""
        # Obtener todas las categorías
        all_categories_response = client.get("/api/v1/categories")
        assert all_categories_response.status_code == 200
        all_categories = all_categories_response.json()
        
        # Obtener categorías con stock
        stock_categories_response = client.get("/api/v1/categories/with-stock")
        assert stock_categories_response.status_code == 200
        stock_categories = stock_categories_response.json()
        
        # Las categorías con stock deberían ser un subconjunto de todas las categorías
        assert len(stock_categories) <= len(all_categories)
        
        # Cada categoría con stock debería existir en la lista completa
        all_category_ids = [cat["id"] for cat in all_categories]
        for stock_cat in stock_categories:
            assert stock_cat["id"] in all_category_ids
    
    def test_empty_stock_categories_response(self, client):
        """Test que el endpoint de categorías con stock maneje correctamente el caso vacío"""
        response = client.get("/api/v1/categories/with-stock")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Puede estar vacío si no hay productos con stock, y eso está bien