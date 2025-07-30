from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    is_active: bool = True

class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = ""

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int