from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str
    wants_newsletter: bool = False
    carrera: Optional[str] = None

class UserCreate(UserBase):
    password: str

class TeacherCreate(UserCreate):
    teacher_code: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    wants_newsletter: Optional[bool] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    role: UserRole
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True
