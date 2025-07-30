from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.db.session import get_session
from app.models.user import User, UserCreate
from app.auth import get_password_hash

router = APIRouter()


@router.post("/users/", response_model=User)
def create_user(*, session: Session = Depends(get_session), user_in: UserCreate):
    db_user = session.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )
    hashed_password = get_password_hash(user_in.password)
    db_user = User(email=user_in.email, hashed_password=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
