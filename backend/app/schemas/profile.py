from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserProfileBase(BaseModel):
    career: Optional[str] = None
    university: Optional[str] = None
    semester: Optional[str] = None
    objective_score: Optional[int] = Field(default=None, ge=0, le=500)
    practice_frequency: Optional[str] = None
    preferred_difficulty: Optional[str] = None


class UserProfileUpdate(UserProfileBase):
    pass


class UserProfileResponse(UserProfileBase):
    user_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
