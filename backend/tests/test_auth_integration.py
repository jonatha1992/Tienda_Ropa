"""
Tests de integración para autenticación Firebase End-to-End
Simula el flujo completo desde el frontend al backend
"""
import pytest
import requests
import json
from unittest.mock import patch, Mock
import os
import time


class TestAuthenticationIntegration:
    """
    Tests de integración para autenticación completa.
    Estos tests similan el flujo real de autenticación desde el frontend.
    """
    
    # URLs base para los tests
    BACKEND_URL = "http://localhost:8000"
    FRONTEND_URL = "http://localhost:5173"
    
    @pytest.fixture
    def backend_is_running(self):
        """Verificar que el backend esté ejecutándose"""
        try:
            response = requests.get(f"{self.BACKEND_URL}/health", timeout=5)
            assert response.status_code == 200
            return True
        except requests.exceptions.RequestException:
            pytest.skip("Backend no está ejecutándose en localhost:8000")
    
    @pytest.fixture
    def mock_firebase_token(self):
        """Token de Firebase simulado para tests"""
        return "mock_firebase_token_for_testing"
    
    @pytest.fixture
    def mock_firebase_user_data(self):
        """Datos de usuario Firebase simulados"""
        return {
            'uid': 'test_integration_uid_123',
            'email': 'integration.test@example.com',
            'name': 'Integration Test User',
            'email_verified': True
        }

    def test_health_endpoint(self, backend_is_running):
        """Test básico para verificar que el backend responda"""
        response = requests.get(f"{self.BACKEND_URL}/health")
        
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}

    def test_users_me_without_auth(self, backend_is_running):
        """Test endpoint /users/me sin autenticación"""
        response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me")
        
        assert response.status_code == 403
        error_data = response.json()
        assert "detail" in error_data
        assert "Not authenticated" in error_data["detail"]

    def test_users_me_with_invalid_token(self, backend_is_running):
        """Test endpoint /users/me con token inválido"""
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        assert response.status_code == 401
        error_data = response.json()
        assert "detail" in error_data
        assert "Invalid Firebase token" in error_data["detail"]

    @patch('app.auth_firebase.auth.verify_id_token')
    @patch('app.controllers.user_controller.get_user_by_firebase_uid')
    @patch('app.controllers.user_controller.create_user_from_firebase')
    def test_full_authentication_flow_new_user(self, mock_create_user, mock_get_user, 
                                             mock_verify_token, backend_is_running, 
                                             mock_firebase_token, mock_firebase_user_data):
        """
        Test del flujo completo de autenticación para un usuario nuevo
        Simula: Frontend obtiene token → Backend valida → Crea usuario → Retorna datos
        """
        # Arrange: Mock Firebase verification
        mock_verify_token.return_value = mock_firebase_user_data
        mock_get_user.return_value = None  # Usuario no existe
        
        # Mock user creation
        from app.models.user import User
        mock_db_user = User(
            id=1,
            firebase_uid=mock_firebase_user_data['uid'],
            email=mock_firebase_user_data['email'],
            username=mock_firebase_user_data['name'],
            is_active=True
        )
        mock_create_user.return_value = mock_db_user
        
        # Act: Simular petición del frontend
        headers = {"Authorization": f"Bearer {mock_firebase_token}"}
        response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        # Assert: Verificar respuesta exitosa
        assert response.status_code == 200
        user_data = response.json()
        
        assert user_data['id'] == 1
        assert user_data['email'] == mock_firebase_user_data['email']
        assert user_data['firebase_uid'] == mock_firebase_user_data['uid']
        assert user_data['username'] == mock_firebase_user_data['name']
        assert user_data['is_active'] is True

    @patch('app.auth_firebase.auth.verify_id_token')
    @patch('app.controllers.user_controller.get_user_by_firebase_uid')
    def test_full_authentication_flow_existing_user(self, mock_get_user, mock_verify_token, 
                                                   backend_is_running, mock_firebase_token, 
                                                   mock_firebase_user_data):
        """
        Test del flujo completo de autenticación para un usuario existente
        Simula: Frontend obtiene token → Backend valida → Encuentra usuario → Retorna datos
        """
        # Arrange: Mock Firebase verification
        mock_verify_token.return_value = mock_firebase_user_data
        
        # Mock existing user
        from app.models.user import User
        mock_db_user = User(
            id=2,
            firebase_uid=mock_firebase_user_data['uid'],
            email=mock_firebase_user_data['email'],
            username=mock_firebase_user_data['name'],
            is_active=True
        )
        mock_get_user.return_value = mock_db_user
        
        # Act: Simular petición del frontend
        headers = {"Authorization": f"Bearer {mock_firebase_token}"}
        response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        # Assert: Verificar respuesta exitosa
        assert response.status_code == 200
        user_data = response.json()
        
        assert user_data['id'] == 2
        assert user_data['email'] == mock_firebase_user_data['email']
        assert user_data['firebase_uid'] == mock_firebase_user_data['uid']

    def test_cors_headers_for_frontend(self, backend_is_running):
        """Test que el backend permita CORS desde el frontend"""
        headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization"
        }
        
        # OPTIONS request para verificar CORS
        response = requests.options(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        # Verificar que CORS esté configurado correctamente
        assert response.status_code in [200, 204]
        # Note: Los headers CORS exactos pueden variar según la configuración

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_token_expiration_simulation(self, mock_verify_token, backend_is_running, 
                                       mock_firebase_token):
        """Simular expiración de token Firebase"""
        # Arrange: Mock token expirado
        mock_verify_token.side_effect = Exception("Token expired")
        
        # Act
        headers = {"Authorization": f"Bearer {mock_firebase_token}"}
        response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        # Assert
        assert response.status_code == 401
        error_data = response.json()
        assert "Invalid Firebase token" in error_data["detail"]

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_network_error_simulation(self, mock_verify_token, backend_is_running, 
                                    mock_firebase_token):
        """Simular error de red con Firebase"""
        # Arrange: Mock error de red
        mock_verify_token.side_effect = ConnectionError("Network timeout")
        
        # Act
        headers = {"Authorization": f"Bearer {mock_firebase_token}"}
        response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        # Assert
        assert response.status_code == 401
        error_data = response.json()
        assert "Invalid Firebase token" in error_data["detail"]

    def test_malformed_authorization_header(self, backend_is_running):
        """Test con header de autorización malformado"""
        test_cases = [
            {"Authorization": "Bearer"},  # Sin token
            {"Authorization": "InvalidScheme token"},  # Scheme incorrecto
            {"Authorization": "Bearer token with spaces"},  # Token con espacios
            {"Authorization": "token_without_bearer"},  # Sin Bearer
        ]
        
        for headers in test_cases:
            response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
            assert response.status_code in [401, 403]

    @patch('app.auth_firebase.auth.verify_id_token')
    @patch('app.controllers.user_controller.get_user_by_firebase_uid')
    @patch('app.controllers.user_controller.create_user_from_firebase')
    def test_concurrent_requests_simulation(self, mock_create_user, mock_get_user, 
                                          mock_verify_token, backend_is_running,
                                          mock_firebase_token, mock_firebase_user_data):
        """Simular múltiples peticiones concurrentes del mismo usuario"""
        import concurrent.futures
        
        # Arrange
        mock_verify_token.return_value = mock_firebase_user_data
        mock_get_user.return_value = None
        
        from app.models.user import User
        mock_db_user = User(
            id=3,
            firebase_uid=mock_firebase_user_data['uid'],
            email=mock_firebase_user_data['email'],
            username=mock_firebase_user_data['name'],
            is_active=True
        )
        mock_create_user.return_value = mock_db_user
        
        headers = {"Authorization": f"Bearer {mock_firebase_token}"}
        
        def make_request():
            return requests.get(f"{self.BACKEND_URL}/api/v1/users/me", headers=headers)
        
        # Act: Hacer 5 peticiones concurrentes
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(make_request) for _ in range(5)]
            responses = [future.result() for future in concurrent.futures.as_completed(futures)]
        
        # Assert: Todas las peticiones deberían ser exitosas
        for response in responses:
            assert response.status_code == 200
            user_data = response.json()
            assert user_data['email'] == mock_firebase_user_data['email']

    def test_api_response_format_consistency(self, backend_is_running):
        """Test que los formatos de respuesta sean consistentes"""
        # Test health endpoint
        health_response = requests.get(f"{self.BACKEND_URL}/health")
        assert health_response.headers.get('content-type') == 'application/json'
        
        # Test error response format
        error_response = requests.get(f"{self.BACKEND_URL}/api/v1/users/me")
        assert error_response.headers.get('content-type') == 'application/json'
        error_data = error_response.json()
        assert 'detail' in error_data

    @pytest.mark.slow
    def test_performance_under_load(self, backend_is_running):
        """Test básico de rendimiento del endpoint de health"""
        import time
        
        start_time = time.time()
        for _ in range(10):
            response = requests.get(f"{self.BACKEND_URL}/health")
            assert response.status_code == 200
        end_time = time.time()
        
        avg_response_time = (end_time - start_time) / 10
        # El health endpoint debería responder en menos de 1 segundo en promedio
        assert avg_response_time < 1.0
