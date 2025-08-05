from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.models.user import User, UserRead
from app.controllers.user_controller import get_user_by_firebase_uid, create_user_from_firebase
from app.auth_firebase import verify_firebase_token

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