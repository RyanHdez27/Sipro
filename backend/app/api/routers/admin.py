import string, random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserRole, TeacherCode, LoginLog
from app.core.security import get_password_hash
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])
profesor_router = APIRouter(prefix="/profesor", tags=["profesor"])


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


# ─── Schemas ───
class AdminRegisterTeacher(BaseModel):
    name: str
    email: EmailStr
    password: str


# ─── Stats ───
@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    estudiantes = db.query(User).filter(User.role == UserRole.estudiante).all()
    docentes = db.query(User).filter(User.role == UserRole.profesor).all()
    return {
        "total_estudiantes": len(estudiantes),
        "total_docentes": len(docentes),
        "docentes": [{"id": d.id, "name": d.name, "email": d.email, "is_active": d.is_active} for d in docentes],
        "estudiantes": [{"id": e.id, "name": e.name, "email": e.email, "is_active": e.is_active, "carrera": e.carrera} for e in estudiantes],
    }


# ─── Teacher Codes ───
def _generate_code() -> str:
    chars = string.ascii_uppercase + string.digits
    return "DOC-" + "".join(random.choices(chars, k=6))


@router.post("/codes")
def create_teacher_code(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    code_str = _generate_code()
    while db.query(TeacherCode).filter(TeacherCode.code == code_str).first():
        code_str = _generate_code()

    now = datetime.now(timezone.utc)
    tc = TeacherCode(
        code=code_str,
        created_by_id=admin.id,
        created_at=now,
        expires_at=now + timedelta(days=8),
    )
    db.add(tc)
    db.commit()
    db.refresh(tc)
    return {
        "code": tc.code,
        "created_at": tc.created_at.isoformat(),
        "expires_at": tc.expires_at.isoformat(),
        "is_used": tc.is_used,
        "used_by_name": tc.used_by_name,
    }


@router.get("/codes")
def list_teacher_codes(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    codes = db.query(TeacherCode).order_by(TeacherCode.id.desc()).all()
    now = datetime.now(timezone.utc)
    result = []
    for c in codes:
        if c.is_used:
            estado = "usado"
        elif c.expires_at and c.expires_at.replace(tzinfo=timezone.utc) < now:
            estado = "expirado"
        else:
            estado = "activo"
        result.append({
            "code": c.code,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "expires_at": c.expires_at.isoformat() if c.expires_at else None,
            "estado": estado,
            "used_by_name": c.used_by_name,
        })
    return result


@router.delete("/codes/{code}")
def revoke_teacher_code(code: str, db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    tc = db.query(TeacherCode).filter(TeacherCode.code == code).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Code not found")
    tc.expires_at = datetime.now(timezone.utc)
    tc.is_used = False
    db.commit()
    return {"msg": "Code revoked"}


# ─── Admin register teacher (manual, no code needed) ───
@router.post("/register-teacher")
def admin_register_teacher(data: AdminRegisterTeacher, db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = User(
        email=data.email,
        name=data.name,
        hashed_password=get_password_hash(data.password),
        role=UserRole.profesor,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "name": new_user.name, "email": new_user.email}


# ─── Login Logs ───
@router.get("/login-logs")
def get_login_logs(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    logs = db.query(LoginLog).order_by(LoginLog.id.desc()).limit(50).all()
    return [
        {
            "id": l.id,
            "user_email": l.user_email,
            "action": l.action,
            "ip": l.ip,
            "user_agent": l.user_agent,
            "success": l.success,
            "created_at": l.created_at.isoformat() if l.created_at else None,
        }
        for l in logs
    ]


@router.delete("/login-logs")
def clear_login_logs(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    db.query(LoginLog).delete()
    db.commit()
    return {"msg": "Logs cleared"}

# ─── Profesor Stats ───
@profesor_router.get("/stats")
def get_profesor_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Accessible to professors and admins
    if current_user.role not in [UserRole.profesor, UserRole.admin]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Profesor API access required")
    estudiantes = db.query(User).filter(User.role == UserRole.estudiante).all()
    docentes = db.query(User).filter(User.role == UserRole.profesor).all()
    
    # Calculate distribucion by carrera
    carreras = {}
    for e in estudiantes:
        c = e.carrera or "Sin asignar"
        carreras[c] = carreras.get(c, 0) + 1
        
    distribucion_carreras = [{"carrera": k, "cantidad": v} for k, v in carreras.items()]

    return {
        "total_estudiantes": len(estudiantes),
        "total_docentes": len(docentes),
        "distribucion_carreras": distribucion_carreras,
        "estudiantes": [{"id": e.id, "name": e.name, "email": e.email, "is_active": e.is_active, "carrera": e.carrera} for e in estudiantes],
    }
