"""
Tests para controladores de usuarios
"""
import pytest
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy.pool import StaticPool

from app.models.user import User, UserCreate
from app.controllers.user_controller import (
    get_user_by_username,
    get_user_by_email, 
    get_user_by_firebase_uid,
    create_user_from_firebase,
    create_user,
    get_all_user,
    search_users
)


@pytest.fixture
def test_db():
    """Create a test database session"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        yield session


@pytest.fixture
def sample_users(test_db):
    """Create sample users for testing"""
    users = [
        User(
            username="user1",
            email="user1@example.com",
            firebase_uid="firebase_uid_1",
            is_active=True,
            hashed_password="hashed_pass_1"
        ),
        User(
            username="user2",
            email="user2@example.com",
            firebase_uid="firebase_uid_2",
            is_active=True,
            hashed_password="hashed_pass_2"
        ),
        User(
            username="testuser",
            email="testuser@example.com",
            firebase_uid="firebase_uid_test",
            is_active=False,
            hashed_password="hashed_pass_test"
        )
    ]
    
    for user in users:
        test_db.add(user)
    test_db.commit()
    
    for user in users:
        test_db.refresh(user)
    
    return users


class TestUserController:
    """Tests para el controlador de usuarios"""

    def test_get_user_by_username_existing(self, test_db, sample_users):
        """Test getting user by username when user exists"""
        # Act
        user = get_user_by_username(test_db, "user1")
        
        # Assert
        assert user is not None
        assert user.username == "user1"
        assert user.email == "user1@example.com"
        assert user.firebase_uid == "firebase_uid_1"

    def test_get_user_by_username_non_existing(self, test_db, sample_users):
        """Test getting user by username when user doesn't exist"""
        # Act
        user = get_user_by_username(test_db, "nonexistent")
        
        # Assert
        assert user is None

    def test_get_user_by_username_case_sensitive(self, test_db, sample_users):
        """Test that username search is case sensitive"""
        # Act
        user = get_user_by_username(test_db, "USER1")
        
        # Assert
        assert user is None

    def test_get_user_by_email_existing(self, test_db, sample_users):
        """Test getting user by email when user exists"""
        # Act
        user = get_user_by_email(test_db, "user2@example.com")
        
        # Assert
        assert user is not None
        assert user.username == "user2"
        assert user.email == "user2@example.com"

    def test_get_user_by_email_non_existing(self, test_db, sample_users):
        """Test getting user by email when user doesn't exist"""
        # Act
        user = get_user_by_email(test_db, "nonexistent@example.com")
        
        # Assert
        assert user is None

    def test_get_user_by_firebase_uid_existing(self, test_db, sample_users):
        """Test getting user by Firebase UID when user exists"""
        # Act
        user = get_user_by_firebase_uid(test_db, "firebase_uid_1")
        
        # Assert
        assert user is not None
        assert user.username == "user1"
        assert user.firebase_uid == "firebase_uid_1"

    def test_get_user_by_firebase_uid_non_existing(self, test_db, sample_users):
        """Test getting user by Firebase UID when user doesn't exist"""
        # Act
        user = get_user_by_firebase_uid(test_db, "nonexistent_firebase_uid")
        
        # Assert
        assert user is None

    def test_create_user_from_firebase_minimal_data(self, test_db):
        """Test creating user from Firebase with minimal data"""
        # Arrange
        firebase_user = {
            'uid': 'new_firebase_uid',
            'email': 'newuser@example.com'
        }
        
        # Act
        user = create_user_from_firebase(test_db, firebase_user)
        
        # Assert
        assert user.firebase_uid == 'new_firebase_uid'
        assert user.email == 'newuser@example.com'
        assert user.username is None
        assert user.is_active is True
        assert user.id is not None

    def test_create_user_from_firebase_full_data(self, test_db):
        """Test creating user from Firebase with full data"""
        # Arrange
        firebase_user = {
            'uid': 'full_firebase_uid',
            'email': 'fulluser@example.com',
            'name': 'Full User Name'
        }
        
        # Act
        user = create_user_from_firebase(test_db, firebase_user)
        
        # Assert
        assert user.firebase_uid == 'full_firebase_uid'
        assert user.email == 'fulluser@example.com'
        assert user.username == 'Full User Name'
        assert user.is_active is True

    def test_create_user_from_firebase_duplicate_uid(self, test_db, sample_users):
        """Test creating user from Firebase with duplicate UID should fail"""
        # Arrange
        firebase_user = {
            'uid': 'firebase_uid_1',  # Already exists
            'email': 'duplicate@example.com'
        }
        
        # Act & Assert
        with pytest.raises(Exception):  # Should raise integrity error
            create_user_from_firebase(test_db, firebase_user)

    def test_create_user_from_firebase_duplicate_email(self, test_db, sample_users):
        """Test creating user from Firebase with duplicate email should fail"""
        # Arrange
        firebase_user = {
            'uid': 'new_unique_uid',
            'email': 'user1@example.com'  # Already exists
        }
        
        # Act & Assert
        with pytest.raises(Exception):  # Should raise integrity error
            create_user_from_firebase(test_db, firebase_user)

    def test_create_user_traditional(self, test_db):
        """Test creating user with traditional method"""
        # Arrange
        user_create = UserCreate(
            username="traditional_user",
            email="traditional@example.com",
            password="password123"
        )
        
        # Act
        user = create_user(test_db, user_create)
        
        # Assert
        assert user.username == "traditional_user"
        assert user.email == "traditional@example.com"
        assert user.hashed_password == "password123"  # Note: In real app, this should be hashed
        assert user.firebase_uid is None

    def test_get_all_users(self, test_db, sample_users):
        """Test getting all users"""
        # Act
        users = get_all_user(test_db)
        
        # Assert
        assert len(users) == 3
        usernames = [user.username for user in users]
        assert "user1" in usernames
        assert "user2" in usernames
        assert "testuser" in usernames

    def test_get_all_users_empty_database(self, test_db):
        """Test getting all users from empty database"""
        # Act
        users = get_all_user(test_db)
        
        # Assert
        assert len(users) == 0

    def test_search_users_by_username(self, test_db, sample_users):
        """Test searching users by username"""
        # Act
        users = search_users(test_db, "user")
        
        # Assert
        assert len(users) >= 2
        usernames = [user.username for user in users]
        assert "user1" in usernames
        assert "user2" in usernames

    def test_search_users_by_email(self, test_db, sample_users):
        """Test searching users by email"""
        # Act
        users = search_users(test_db, "@example.com")
        
        # Assert
        assert len(users) == 3  # All sample users have @example.com

    def test_search_users_case_insensitive(self, test_db, sample_users):
        """Test that user search is case insensitive"""
        # Act
        users_lower = search_users(test_db, "user")
        users_upper = search_users(test_db, "USER")
        
        # Assert
        assert len(users_lower) == len(users_upper)
        assert users_lower[0].username == users_upper[0].username

    def test_search_users_partial_match(self, test_db, sample_users):
        """Test searching users with partial match"""
        # Act
        users = search_users(test_db, "test")
        
        # Assert
        assert len(users) == 1
        assert users[0].username == "testuser"

    def test_search_users_no_results(self, test_db, sample_users):
        """Test searching users with no matching results"""
        # Act
        users = search_users(test_db, "nonexistent")
        
        # Assert
        assert len(users) == 0

    def test_search_users_empty_query(self, test_db, sample_users):
        """Test searching users with empty query"""
        # Act
        users = search_users(test_db, "")
        
        # Assert
        assert len(users) == 3  # Should return all users
