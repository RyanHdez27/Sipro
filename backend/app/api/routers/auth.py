from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserRole, TeacherCode, LoginLog, PasswordResetToken
from app.schemas.auth import PasswordResetRequest, PasswordResetConfirmRequest
from app.schemas.user import UserCreate, TeacherCreate, UserResponse
from app.schemas.token import Token
from app.core.config import settings
from app.core.email import send_password_reset_email
from app.core.security import (
    create_access_token,
    generate_password_reset_token,
    get_password_hash,
    get_token_hash,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Los registros duplicados se tratan como conflicto de negocio y no como solicitud mal formada.
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email, 
        name=user_in.name, 
        hashed_password=hashed_password,
        wants_newsletter=user_in.wants_newsletter,
        role=UserRole.estudiante
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/register/teacher", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_teacher(user_in: TeacherCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    code_record = db.query(TeacherCode).filter(TeacherCode.code == user_in.teacher_code, TeacherCode.is_used == False).first()
    if not code_record:
        raise HTTPException(status_code=400, detail="Código de validación de profesor inválido o ya usado")
    
    code_record.is_used = True
    code_record.used_by_name = user_in.name
    
    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email, 
        name=user_in.name, 
        hashed_password=hashed_password,
        wants_newsletter=user_in.wants_newsletter,
        role=UserRole.profesor
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Las credenciales invalidas deben responder 401 para que el cliente lo trate como fallo de autenticacion.
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        # Log failed attempt
        db.add(LoginLog(
            user_email=form_data.username,
            action="Intento de inicio de sesión fallido",
            ip=ip, user_agent=ua, success=False,
        ))
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Log successful login
    db.add(LoginLog(
        user_email=user.email,
        action="Inicio de sesión exitoso",
        ip=ip, user_agent=ua, success=True,
    ))
    db.commit()

    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}
    
@router.post("/reset-password", status_code=status.HTTP_202_ACCEPTED)
def reset_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if user:
        now = datetime.now(timezone.utc)
        active_tokens = db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used_at.is_(None),
        ).all()
        for active_token in active_tokens:
            active_token.used_at = now

        raw_token = generate_password_reset_token()
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=get_token_hash(raw_token),
            expires_at=now + timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES),
        )
        db.add(reset_token)
        db.commit()

        reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/auth/reset-password/confirm?token={raw_token}"
        send_password_reset_email(
            to_email=user.email,
            reset_url=reset_url,
            user_name=user.name,
        )

    return {"msg": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password/confirm")
def confirm_reset_password(payload: PasswordResetConfirmRequest, db: Session = Depends(get_db)):
    reset_token = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == get_token_hash(payload.token)
    ).first()
    if not reset_token or reset_token.used_at is not None:
        raise HTTPException(status_code=400, detail="Invalid or already used reset token")

    now = datetime.now(timezone.utc)
    expires_at = reset_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < now:
        raise HTTPException(status_code=400, detail="Reset token has expired")

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = get_password_hash(payload.new_password)
    reset_token.used_at = now
    db.commit()

    return {"msg": "Password updated successfully"}
