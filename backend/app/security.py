from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, Dict
from jwt import PyJWT
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, HTTPException, status, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from app.controllers.user_controller import get_user_by_username
from app.db.session import get_session
from sqlalchemy.orm import Session
import time

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "1q2w3e4r"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)
jwt = PyJWT()
USER_CACHE: Dict[str, Dict] = {}
CACHE_TTL = 3600

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_token_from_cookie_or_header(request: Request, token_from_header: Optional[str] = Depends(oauth2_scheme)) -> str:
    token = request.cookies.get("access_token")
    if not token and token_from_header:
        token = token_from_header
    return token

async def get_current_user(token: str = Depends(get_token_from_cookie_or_header), db: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    current_time = time.time()
    cached_data = USER_CACHE.get(username)
    if cached_data and (current_time - cached_data["timestamp"] < CACHE_TTL):
        return cached_data["user"]
    user = get_user_by_username(db, username=username)
    if user is None:
        raise credentials_exception
    USER_CACHE[username] = {
        "user": user,
        "timestamp": current_time
    }
    return user

def invalidate_user_cache(username: str) -> None:
    if username in USER_CACHE:
        del USER_CACHE[username]

def clear_all_user_cache() -> None:
    USER_CACHE.clear()
