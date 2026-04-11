import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, DateTime
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
    carrera = Column(String, nullable=True)


class TeacherCode(Base):
    __tablename__ = "teacher_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    used_by_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=True)


class LoginLog(Base):
    __tablename__ = "login_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    action = Column(String, nullable=False)
    ip = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    success = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True), nullable=True)
