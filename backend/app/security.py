"""
Security utilities and authentication dependencies.
This module provides compatibility with the old authentication system
while using Firebase Auth as the primary authentication method.
"""

from fastapi import Depends, HTTPException, status
from app.auth_firebase import verify_firebase_token


def get_current_user(firebase_user: dict = Depends(verify_firebase_token)):
    """
    Dependency to get the current authenticated user.
    This is a compatibility function that works with Firebase Auth.
    
    Args:
        firebase_user: The Firebase user data from the token verification
        
    Returns:
        dict: Firebase user data
        
    Raises:
        HTTPException: If user is not authenticated
    """
    if not firebase_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return firebase_user


# Alias for backward compatibility
get_current_active_user = get_current_user
