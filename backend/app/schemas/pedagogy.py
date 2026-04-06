from datetime import datetime
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel


class StudentMasteryBase(BaseModel):
    student_id: UUID
    competency_id: UUID
    mastery_score: Decimal

class StudentMasteryCreate(StudentMasteryBase):
    pass

class StudentMasteryResponse(StudentMasteryBase):
    id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
