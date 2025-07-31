
from fastapi import APIRouter, HTTPException, Depends, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_session
from app.models.user import User, UserCreate, UserDB, UserLogin
from app.security import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from typing import List

from app.controllers.user_controller import get_user_by_username, create_user, get_all_user, get_user_by_email, search_users
from app.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Autenticación"])
@router.get("/me")
async def get_me(current_user: UserDB = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "success": True
    }

@router.post("/register", response_model=User)
async def register(user_create: UserCreate, db: Session = Depends(get_session)):
    existing_user = get_user_by_username(db, user_create.username)
    existing_email = get_user_by_email(db, user_create.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = get_password_hash(user_create.password)
    user_create.password = hashed_pw
    new_user = create_user(db, user_create)
    return new_user

@router.post("/login")
async def login(response: Response, form_data: UserLogin, db: Session = Depends(get_session)):
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    access_token_expires = timedelta(days=7)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        max_age=60*60*24*7,
        samesite="none",
    )
    return {
        "username": user.username,
        "user_id": user.id,
        "success": True
    }

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        secure=True,
        httponly=True,
        samesite="none",
    )
    return {"message": "Sesión cerrada correctamente"}

@router.get("/users")
async def list_users(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_session)):
    users = get_all_user(db)
    safe_users = [
        {"id": user.id, "username": user.username, "email": user.email}
        for user in users
    ]
    return safe_users

@router.get("/users/search")
async def search_user(query: str, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_session)):
    users = search_users(db, query)
    return [{"id": user.id, "username": user.username, "email": user.email} for user in users]
