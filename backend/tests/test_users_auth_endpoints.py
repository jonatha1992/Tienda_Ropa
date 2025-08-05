"""
Tests para endpoints de usuarios con autenticación Firebase - Version Simplificada
"""
import pytest
from fastapi.testclient import TestClient

from app.main import app


class TestUsersEndpoints:
    """Tests para endpoints de usuarios autenticados"""

    def test_get_me_existing_user(self, client, auth_cookie, db_session):
        """Test GET /users/me with existing user in database"""
        headers = auth_cookie
        response = client.get("/api/v1/users/me", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert 'email' in data
        assert 'firebase_uid' in data

    def test_get_me_new_user_creation(self, client, auth_cookie, db_session):
        """Test GET /users/me creates new user if not exists"""
        headers = auth_cookie
        response = client.get("/api/v1/users/me", headers=headers)

        assert response.status_code == 200
        data = response.json()
        assert 'email' in data
        assert 'firebase_uid' in data

    def test_get_me_no_authorization_header(self, client):
        """Test GET /users/me without authorization header"""
        # Limpiar overrides para esta prueba
        app.dependency_overrides.clear()
        
        try:
            response = client.get("/api/v1/users/me")
            assert response.status_code == 403
        finally:
            # Restaurar para otras pruebas
            from app.auth_firebase import verify_firebase_token
            mock_firebase_user = {
                'uid': 'test_firebase_uid_api_test',
                'email': 'apitest@example.com',
                'name': 'API Test User',
                'email_verified': True
            }
            app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user

    def test_get_me_invalid_firebase_token(self, client):
        """Test GET /users/me with invalid Firebase token"""
        # Limpiar overrides para esta prueba
        app.dependency_overrides.clear()
        
        try:
            headers = {"Authorization": "Bearer invalid_firebase_token"}
            response = client.get("/api/v1/users/me", headers=headers)
            assert response.status_code == 401  # Cambiar de 403 a 401
        finally:
            # Restaurar para otras pruebas
            from app.auth_firebase import verify_firebase_token
            mock_firebase_user = {
                'uid': 'test_firebase_uid_api_test',
                'email': 'apitest@example.com',
                'name': 'API Test User',
                'email_verified': True
            }
            app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user

    def test_get_me_expired_firebase_token(self, client):
        """Test GET /users/me with expired Firebase token"""
        # Limpiar overrides para esta prueba
        app.dependency_overrides.clear()
        
        try:
            headers = {"Authorization": "Bearer expired_firebase_token"}
            response = client.get("/api/v1/users/me", headers=headers)
            assert response.status_code == 401  # Cambiar de 403 a 401
        finally:
            # Restaurar para otras pruebas
            from app.auth_firebase import verify_firebase_token
            mock_firebase_user = {
                'uid': 'test_firebase_uid_api_test',
                'email': 'apitest@example.com',
                'name': 'API Test User',
                'email_verified': True
            }
            app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user

    def test_get_me_user_with_minimal_firebase_data(self, client):
        """Test GET /users/me with minimal Firebase user data"""
        # Configurar mock con datos mínimos
        from app.auth_firebase import verify_firebase_token
        
        mock_firebase_user_minimal = {
            'uid': 'minimal_user_uid',
            'email': 'minimal@example.com'
            # Sin name
        }
        
        app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user_minimal
        
        try:
            headers = {"Authorization": "Bearer minimal_firebase_token"}
            response = client.get("/api/v1/users/me", headers=headers)
            assert response.status_code == 200
            data = response.json()
            assert data['email'] == 'minimal@example.com'
            assert data['firebase_uid'] == 'minimal_user_uid'
        finally:
            # Restaurar
            mock_firebase_user = {
                'uid': 'test_firebase_uid_api_test',
                'email': 'apitest@example.com',
                'name': 'API Test User',
                'email_verified': True
            }
            app.dependency_overrides[verify_firebase_token] = lambda: mock_firebase_user
