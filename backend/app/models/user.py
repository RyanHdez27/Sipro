import enum
from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey
from app.db.database import Base

class UserRole(str, enum.Enum):
    estudiante = "estudiante"
    profesor = "profesor"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole, name="user_role_enum", create_type=False), default=UserRole.estudiante, nullable=False)
    is_active = Column(Boolean, default=True)
    wants_newsletter = Column(Boolean, default=False)
    phone = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

class TeacherCode(Base):
    __tablename__ = "teacher_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
