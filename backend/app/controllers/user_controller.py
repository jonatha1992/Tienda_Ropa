from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user import UserDB
from sqlalchemy import or_

def get_user_by_username(db: Session, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(UserDB).filter(UserDB.email == email).first()

def create_user(db: Session, user_create):
    new_user = UserDB(
        username=user_create.username,
        email=user_create.email,
        hashed_password=user_create.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_all_user(db: Session) -> List[UserDB]:
    return db.query(UserDB).all()

def search_users(db: Session, query: str) -> List[UserDB]:
    search_pattern = f"%{query}%"
    return db.query(UserDB).filter(
        or_(
            UserDB.username.ilike(search_pattern),
            UserDB.email.ilike(search_pattern)
        )
    ).all()
