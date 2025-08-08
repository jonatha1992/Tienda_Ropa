from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
    from .user_role import UserRole

class RoleType(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"
    USER = "user"

class RoleBase(SQLModel):
    name: RoleType = Field(index=True)
    description: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)

class Role(RoleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Relación con UserRole (many-to-many through user_roles)
    user_roles: List["UserRole"] = Relationship(back_populates="role")

class RoleCreate(RoleBase):
    pass

class RoleRead(RoleBase):
    id: int

class RoleUpdate(SQLModel):
    name: Optional[RoleType] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
