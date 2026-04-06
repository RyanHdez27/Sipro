from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr


class StudentBase(BaseModel):
    email: EmailStr
    full_name: str
    program: str
    semester: int
    level: str


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    program: Optional[str] = None
    semester: Optional[int] = None
    level: Optional[str] = None


class StudentResponse(StudentBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
