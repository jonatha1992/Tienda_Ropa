"""
Tests para autenticación con Firebase Auth
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials

from app.auth_firebase import verify_firebase_token


class TestFirebaseAuth:
    """Tests para la autenticación con Firebase Auth"""

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_verify_firebase_token_success(self, mock_verify):
        """Test successful Firebase token verification"""
        # Arrange
        mock_decoded_token = {
            'uid': 'test_uid_123',
            'email': 'test@example.com',
            'name': 'Test User'
        }
        mock_verify.return_value = mock_decoded_token
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="valid_firebase_token"
        )

        # Act
        result = verify_firebase_token(credentials)

        # Assert
        assert result == mock_decoded_token
        mock_verify.assert_called_once_with("valid_firebase_token")

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_verify_firebase_token_invalid_token(self, mock_verify):
        """Test Firebase token verification with invalid token"""
        # Arrange
        mock_verify.side_effect = Exception("Invalid token")
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="invalid_firebase_token"
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            verify_firebase_token(credentials)
        
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid Firebase token"
        mock_verify.assert_called_once_with("invalid_firebase_token")

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_verify_firebase_token_expired_token(self, mock_verify):
        """Test Firebase token verification with expired token"""
        # Arrange
        mock_verify.side_effect = Exception("Token expired")
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="expired_firebase_token"
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            verify_firebase_token(credentials)
        
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid Firebase token"

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_verify_firebase_token_malformed_token(self, mock_verify):
        """Test Firebase token verification with malformed token"""
        # Arrange
        mock_verify.side_effect = ValueError("Malformed token")
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="malformed.token.here"
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            verify_firebase_token(credentials)
        
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid Firebase token"

    def test_verify_firebase_token_missing_credentials(self):
        """Test Firebase token verification without credentials"""
        # Arrange
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=""
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            verify_firebase_token(credentials)
        
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid Firebase token"

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_verify_firebase_token_network_error(self, mock_verify):
        """Test Firebase token verification with network error"""
        # Arrange
        mock_verify.side_effect = ConnectionError("Network error")
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="valid_token_but_network_issue"
        )

        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            verify_firebase_token(credentials)
        
        assert exc_info.value.status_code == 401
        assert exc_info.value.detail == "Invalid Firebase token"

    @patch('app.auth_firebase.auth.verify_id_token')
    def test_verify_firebase_token_with_custom_claims(self, mock_verify):
        """Test Firebase token with custom claims"""
        # Arrange
        mock_decoded_token = {
            'uid': 'admin_uid_456',
            'email': 'admin@example.com',
            'name': 'Admin User',
            'custom_claims': {
                'role': 'admin',
                'permissions': ['read', 'write', 'delete']
            }
        }
        mock_verify.return_value = mock_decoded_token
        
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="admin_firebase_token"
        )

        # Act
        result = verify_firebase_token(credentials)

        # Assert
        assert result == mock_decoded_token
        assert result['custom_claims']['role'] == 'admin'
        assert 'delete' in result['custom_claims']['permissions']
