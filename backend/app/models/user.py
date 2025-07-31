
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True, index=True)
    is_active: bool = True

class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = ""

# Alias para compatibilidad con controladores/rutas
UserDB = User

class UserCreate(UserBase):
    password: str


class UserLogin(SQLModel):
    username: str
    password: str

class UserRead(UserBase):
    id: int