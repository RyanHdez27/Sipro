import uuid
from sqlalchemy import Column, String, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from app.db.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    program = Column(String, nullable=False)
    semester = Column(Integer, nullable=False)
    level = Column(String, nullable=False)  # USER-DEFINED enum in Supabase
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
