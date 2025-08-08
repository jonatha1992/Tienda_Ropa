from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.models.user import User, UserRead
from app.controllers.user_controller import get_user_by_firebase_uid, create_user_from_firebase
from app.core.auth_firebase import verify_firebase_token
from app.controllers.role_controller import get_user_roles

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserRead)
async def get_or_create_me(
    db: Session = Depends(get_session),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """
    Obtiene el usuario actual a partir del token de Firebase.
    Si el usuario no existe en la base de datos, lo crea.
    """
    if not firebase_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Buscar usuario por Firebase UID
    user = get_user_by_firebase_uid(db, firebase_user['uid'])

    # Si no existe, crearlo
    if not user:
        user = create_user_from_firebase(db, firebase_user)
    
    return user

@router.get("/debug", response_model=dict)
async def debug_user_auth(
    db: Session = Depends(get_session),
    firebase_user: dict = Depends(verify_firebase_token)
):
    """
    Endpoint de debug para verificar el estado de autenticación y roles del usuario.
    """
    if not firebase_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Buscar usuario por Firebase UID
    user = get_user_by_firebase_uid(db, firebase_user['uid'])

    # Si no existe, crearlo
    if not user:
        user = create_user_from_firebase(db, firebase_user)

    # Obtener roles del usuario
    roles = get_user_roles(db, user.id)
    role_names = [role.name for role in roles]

    return {
        "firebase_user": {
            "uid": firebase_user.get('uid'),
            "email": firebase_user.get('email'),
            "name": firebase_user.get('name')
        },
        "database_user": {
            "id": user.id,
            "email": user.email,
            "firebase_uid": user.firebase_uid
        },
        "roles": role_names,
        "has_admin_role": any("ADMIN" in str(role) for role in role_names),
        "has_manager_role": any("MANAGER" in str(role) for role in role_names)
    }

@router.get("/test-auth")
async def test_auth_endpoint():
    """
    Endpoint simple que no requiere autenticación para verificar que el routing funciona.
    """
    return {"message": "Auth endpoint is working", "timestamp": "2025-08-07"}