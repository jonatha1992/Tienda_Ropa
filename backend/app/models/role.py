from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .user_role import UserRole

class RoleBase(SQLModel):
    name: str = Field(max_length=50, index=True)
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
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
