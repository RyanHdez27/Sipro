from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


# ── Topic ────────────────────────────────────────────────────────
class TopicBase(BaseModel):
    name: str
    parent_id: Optional[UUID] = None

class TopicCreate(TopicBase):
    pass

class TopicResponse(TopicBase):
    id: UUID

    class Config:
        from_attributes = True


# ── Competency ───────────────────────────────────────────────────
class CompetencyBase(BaseModel):
    code: str
    name: str
    description: Optional[str] = None

class CompetencyCreate(CompetencyBase):
    pass

class CompetencyResponse(CompetencyBase):
    id: UUID

    class Config:
        from_attributes = True


# ── Question ─────────────────────────────────────────────────────
class QuestionBase(BaseModel):
    type: str
    stem: str
    options: Optional[Any] = None
    explanation: Optional[str] = None
    difficulty: int
    competency_id: UUID
    topic_id: UUID
    tags: list[str] = []
    is_active: bool = True
    version: int = 1

class QuestionCreate(QuestionBase):
    answer_key: Any

class QuestionUpdate(BaseModel):
    stem: Optional[str] = None
    options: Optional[Any] = None
    answer_key: Optional[Any] = None
    explanation: Optional[str] = None
    difficulty: Optional[int] = None
    tags: Optional[list[str]] = None
    is_active: Optional[bool] = None

class QuestionResponse(QuestionBase):
    """Response sin answer_key — para el estudiante."""
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class QuestionWithAnswer(QuestionResponse):
    """Response con answer_key — solo para calificación interna."""
    answer_key: Any
