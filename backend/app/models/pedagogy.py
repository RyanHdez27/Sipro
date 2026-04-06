import uuid
from sqlalchemy import Column, Numeric, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base


class StudentMastery(Base):
    __tablename__ = "student_mastery"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    competency_id = Column(UUID(as_uuid=True), ForeignKey("competencies.id"), nullable=False)
    mastery_score = Column(Numeric, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
