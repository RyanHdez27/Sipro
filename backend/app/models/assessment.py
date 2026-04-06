import uuid
from sqlalchemy import Column, String, Integer, Numeric, Boolean, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    kind = Column(String, nullable=False)       # USER-DEFINED enum in Supabase
    status = Column(String, nullable=False)     # USER-DEFINED enum in Supabase
    config = Column(JSONB, nullable=False, default={})
    started_at = Column(DateTime(timezone=True), nullable=True)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    graded_at = Column(DateTime(timezone=True), nullable=True)


class AssessmentItem(Base):
    __tablename__ = "assessment_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)
    position = Column(Integer, nullable=False)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Response(Base):
    __tablename__ = "responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_item_id = Column(UUID(as_uuid=True), ForeignKey("assessment_items.id"), nullable=False)
    answer = Column(JSONB, nullable=False)
    is_correct = Column(Boolean, nullable=True)
    score = Column(Numeric, nullable=True)
    feedback = Column(Text, nullable=True)
    answered_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Result(Base):
    __tablename__ = "results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"), nullable=False)
    total_items = Column(Integer, nullable=False)
    correct_items = Column(Integer, nullable=False)
    percent = Column(Numeric, nullable=False)
    report_json = Column(JSONB, nullable=False, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class CompetencyResult(Base):
    __tablename__ = "competency_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    result_id = Column(UUID(as_uuid=True), ForeignKey("results.id"), nullable=False)
    competency_id = Column(UUID(as_uuid=True), ForeignKey("competencies.id"), nullable=False)
    correct = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    percent = Column(Numeric, nullable=False)
    weakness_level = Column(String, nullable=False)  # USER-DEFINED enum in Supabase
    recommendations = Column(JSONB, nullable=True)
