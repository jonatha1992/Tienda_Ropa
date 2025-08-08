from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = Field(default=True)
    username: Optional[str] = Field(default=None, index=True, unique=True)
    firebase_uid: Optional[str] = Field(default=None, unique=True, index=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: Optional[str] = Field(default=None)
    
    # Relación con UserRole (many-to-many through user_roles)
    user_roles: List["UserRole"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"foreign_keys": "UserRole.user_id"}
    )

# Alias para compatibilidad con controladores/rutas
UserDB = User

# DTO para el antiguo sistema de registro. Se mantiene por compatibilidad.
class UserCreate(UserBase):
    password: Optional[str] = None
    uid: Optional[str] = None  # Para compatibilidad con Firebase UID

# DTO para el antiguo sistema de login.
class UserLogin(SQLModel):
    username: str
    password: str

# DTO para enviar los datos del usuario al cliente.
class UserRead(UserBase):
    id: int

# Importación para evitar problemas de importación circular
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.user_role import UserRole