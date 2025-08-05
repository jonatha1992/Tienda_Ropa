from typing import List, Optional
from sqlmodel import Session, select
from app.models.user import User, UserCreate
from sqlalchemy import or_

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.exec(select(User).where(User.username == username)).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.exec(select(User).where(User.email == email)).first()

def get_user_by_firebase_uid(db: Session, firebase_uid: str) -> Optional[User]:
    return db.exec(select(User).where(User.firebase_uid == firebase_uid)).first()

def create_user_from_firebase(db: Session, firebase_user: dict) -> User:
    new_user = User(
        firebase_uid=firebase_user['uid'],
        email=firebase_user['email'],
        username=firebase_user.get('name') # Opcional, si viene de Firebase
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def create_user(db: Session, user_create: UserCreate) -> User:
    # Esta función se mantiene por si se quiere crear un usuario con el método tradicional
    new_user = User(
        username=user_create.username,
        email=user_create.email,
        hashed_password=user_create.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_all_user(db: Session) -> List[User]:
    return db.exec(select(User)).all()

def search_users(db: Session, query: str) -> List[User]:
    search_pattern = f"%{query}%"
    return db.exec(select(User).where(
        or_(
            User.username.ilike(search_pattern),
            User.email.ilike(search_pattern)
        )
    )).all()