from sqlmodel import SQLModel, Field
from typing import Optional

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)
    username: Optional[str] = Field(default=None, index=True, unique=True)
    firebase_uid: Optional[str] = Field(default=None, unique=True, index=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: Optional[str] = Field(default=None)

# Alias para compatibilidad con controladores/rutas
UserDB = User

# DTO para el antiguo sistema de registro. Se mantiene por compatibilidad.
class UserCreate(UserBase):
    password: Optional[str] = None

# DTO para el antiguo sistema de login.
class UserLogin(SQLModel):
    username: str
    password: str

# DTO para enviar los datos del usuario al cliente.
class UserRead(UserBase):
    id: int