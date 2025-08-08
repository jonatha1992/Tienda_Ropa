from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime

class UserRoleBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    role_id: int = Field(foreign_key="role.id")
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    assigned_by: Optional[int] = Field(default=None, foreign_key="user.id")
    is_active: bool = Field(default=True)

class UserRole(UserRoleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relaciones con foreign_keys especificados para evitar ambigüedad
    user: "User" = Relationship(
        back_populates="user_roles",
        sa_relationship_kwargs={"foreign_keys": "UserRole.user_id"}
    )
    role: "Role" = Relationship(back_populates="user_roles")

class UserRoleCreate(SQLModel):
    user_id: int
    role_id: int
    assigned_by: Optional[int] = None

class UserRoleRead(UserRoleBase):
    id: int
    user: Optional["UserRead"] = None
    role: Optional["RoleRead"] = None

class UserRoleUpdate(SQLModel):
    is_active: Optional[bool] = None

# Importaciones necesarias para evitar problemas de importación circular
from app.models.user import User, UserRead
from app.models.role import Role, RoleRead
