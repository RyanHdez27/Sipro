from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    name: str
    wants_newsletter: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    wants_newsletter: bool | None = None
    password: str | None = None

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
