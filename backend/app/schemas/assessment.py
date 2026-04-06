from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel


# ── Assessment ───────────────────────────────────────────────────
class AssessmentBase(BaseModel):
    student_id: UUID
    kind: str
    status: str
    config: Any = {}

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentResponse(AssessmentBase):
    id: UUID
    started_at: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    graded_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── AssessmentItem ───────────────────────────────────────────────
class AssessmentItemBase(BaseModel):
    assessment_id: UUID
    question_id: UUID
    position: int

class AssessmentItemCreate(AssessmentItemBase):
    pass

class AssessmentItemResponse(AssessmentItemBase):
    id: UUID
    assigned_at: datetime

    class Config:
        from_attributes = True


# ── Response (respuesta del estudiante) ──────────────────────────
class StudentAnswerBase(BaseModel):
    assessment_item_id: UUID
    answer: Any

class StudentAnswerCreate(StudentAnswerBase):
    pass

class StudentAnswerResponse(StudentAnswerBase):
    id: UUID
    is_correct: Optional[bool] = None
    score: Optional[Decimal] = None
    feedback: Optional[str] = None
    answered_at: datetime

    class Config:
        from_attributes = True


# ── Result ───────────────────────────────────────────────────────
class ResultBase(BaseModel):
    assessment_id: UUID
    total_items: int
    correct_items: int
    percent: Decimal
    report_json: Any = {}

class ResultCreate(ResultBase):
    pass

class ResultResponse(ResultBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ── CompetencyResult ─────────────────────────────────────────────
class CompetencyResultBase(BaseModel):
    result_id: UUID
    competency_id: UUID
    correct: int
    total: int
    percent: Decimal
    weakness_level: str
    recommendations: Optional[Any] = None

class CompetencyResultCreate(CompetencyResultBase):
    pass

class CompetencyResultResponse(CompetencyResultBase):
    id: UUID

    class Config:
        from_attributes = True


# ── Submission (lo que envía el frontend al hacer submit) ────────
class ExamSubmission(BaseModel):
    assessment_id: UUID
    answers: list[dict]  # [{assessment_item_id, answer}]
