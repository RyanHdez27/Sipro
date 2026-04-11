from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.email import send_login_otp_email, send_password_reset_email
from app.core.security import (
    create_access_token,
    generate_login_otp_code,
    generate_login_otp_token,
    generate_password_reset_token,
    get_password_hash,
    get_token_hash,
    verify_password,
)
from app.db.database import get_db
from app.models.user import (
    LoginLog,
    LoginOtpChallenge,
    PasswordResetToken,
    TeacherCode,
    User,
    UserRole,
    UserSession,
    UserSecuritySettings,
)
from app.schemas.auth import (
    LoginResponse,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
    TwoFactorResendRequest,
    TwoFactorVerifyRequest,
)
from app.schemas.token import Token
from app.schemas.user import TeacherCreate, UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_or_create_user_security_settings(db: Session, user_id: int) -> UserSecuritySettings:
    settings_row = db.query(UserSecuritySettings).filter(UserSecuritySettings.user_id == user_id).first()
    if settings_row:
        return settings_row

    settings_row = UserSecuritySettings(user_id=user_id, two_factor_enabled=False)
    db.add(settings_row)
    db.flush()
    return settings_row


def _expire_active_otp_challenges(db: Session, user_id: int, now: datetime) -> None:
    active_challenges = db.query(LoginOtpChallenge).filter(
        LoginOtpChallenge.user_id == user_id,
        LoginOtpChallenge.consumed_at.is_(None),
    ).all()
    for challenge in active_challenges:
        challenge.consumed_at = now


def _create_login_otp_challenge(db: Session, user: User, now: datetime) -> tuple[str, int]:
    _expire_active_otp_challenges(db, user.id, now)
    otp_code = generate_login_otp_code()
    otp_token = generate_login_otp_token()
    expires_minutes = settings.OTP_CODE_EXPIRE_MINUTES
    expires_at = now + timedelta(minutes=expires_minutes)
    challenge = LoginOtpChallenge(
        user_id=user.id,
        challenge_token_hash=get_token_hash(otp_token),
        otp_code_hash=get_token_hash(otp_code),
        expires_at=expires_at,
    )
    db.add(challenge)
    send_login_otp_email(to_email=user.email, otp_code=otp_code, user_name=user.name)
    return otp_token, expires_minutes * 60


def _create_user_session(db: Session, user: User, ip: str | None, user_agent: str | None, now: datetime) -> str:
    session_id = uuid4().hex
    session = UserSession(
        session_id=session_id,
        user_id=user.id,
        ip=ip,
        user_agent=user_agent,
        created_at=now,
        last_seen_at=now,
        expires_at=now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    db.add(session)
    return session_id


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hashed_password,
        wants_newsletter=user_in.wants_newsletter,
        role=UserRole.estudiante,
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

    code_record = db.query(TeacherCode).filter(
        TeacherCode.code == user_in.teacher_code,
        TeacherCode.is_used.is_(False),
    ).first()
    if not code_record:
        raise HTTPException(status_code=400, detail="Codigo de validacion de profesor invalido o ya usado")

    code_record.is_used = True
    code_record.used_by_name = user_in.name

    hashed_password = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hashed_password,
        wants_newsletter=user_in.wants_newsletter,
        role=UserRole.profesor,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=LoginResponse)
def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        db.add(LoginLog(
            user_email=form_data.username,
            action="Intento de inicio de sesion fallido",
            ip=ip,
            user_agent=ua,
            success=False,
        ))
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        security_settings = _get_or_create_user_security_settings(db, user.id)
        if security_settings.two_factor_enabled:
            now = datetime.now(timezone.utc)
            otp_token, expires_in_seconds = _create_login_otp_challenge(db, user, now)
            db.add(LoginLog(
                user_email=user.email,
                action="Codigo OTP 2FA enviado para inicio de sesion",
                ip=ip,
                user_agent=ua,
                success=True,
            ))
            db.commit()
            return LoginResponse(
                requires_2fa=True,
                otp_token=otp_token,
                message="Se envio un codigo OTP a tu correo para completar el inicio de sesion.",
                expires_in_seconds=expires_in_seconds,
            )

        now = datetime.now(timezone.utc)
        session_id = _create_user_session(db, user, ip=ip, user_agent=ua, now=now)
        db.add(LoginLog(
            user_email=user.email,
            action="Inicio de sesion exitoso",
            ip=ip,
            user_agent=ua,
            success=True,
        ))
        db.commit()
        access_token = create_access_token(data={"sub": user.email, "role": user.role.value, "sid": session_id})
        return LoginResponse(access_token=access_token, token_type="bearer", requires_2fa=False)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo completar el inicio de sesion",
        ) from exc


@router.post("/login/2fa/verify", response_model=Token)
def verify_login_two_factor(payload: TwoFactorVerifyRequest, request: Request, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    challenge = db.query(LoginOtpChallenge).filter(
        LoginOtpChallenge.challenge_token_hash == get_token_hash(payload.otp_token)
    ).first()
    if not challenge:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="OTP challenge invalido")

    if challenge.consumed_at is not None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="El codigo OTP ya fue utilizado")

    expires_at = challenge.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < now:
        challenge.consumed_at = now
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="El codigo OTP ha expirado")

    user = db.query(User).filter(User.id == challenge.user_id).first()
    if not user:
        challenge.consumed_at = now
        db.commit()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    settings_row = _get_or_create_user_security_settings(db, user.id)
    if not settings_row.two_factor_enabled:
        challenge.consumed_at = now
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La verificacion 2FA no esta activa para este usuario",
        )

    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")

    if challenge.attempts >= settings.OTP_CODE_MAX_ATTEMPTS:
        challenge.consumed_at = now
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Superaste el numero de intentos permitidos. Solicita un nuevo codigo OTP.",
        )

    if challenge.otp_code_hash != get_token_hash(payload.otp_code):
        challenge.attempts += 1
        if challenge.attempts >= settings.OTP_CODE_MAX_ATTEMPTS:
            challenge.consumed_at = now
        db.add(LoginLog(
            user_email=user.email,
            action="Codigo OTP invalido en inicio de sesion",
            ip=ip,
            user_agent=ua,
            success=False,
        ))
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Codigo OTP invalido")

    challenge.consumed_at = now
    session_id = _create_user_session(db, user, ip=ip, user_agent=ua, now=now)
    db.add(LoginLog(
        user_email=user.email,
        action="Inicio de sesion exitoso con 2FA",
        ip=ip,
        user_agent=ua,
        success=True,
    ))
    db.commit()

    access_token = create_access_token(data={"sub": user.email, "role": user.role.value, "sid": session_id})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/2fa/resend", response_model=LoginResponse)
def resend_login_two_factor_code(payload: TwoFactorResendRequest, db: Session = Depends(get_db)):
    now = datetime.now(timezone.utc)
    challenge = db.query(LoginOtpChallenge).filter(
        LoginOtpChallenge.challenge_token_hash == get_token_hash(payload.otp_token)
    ).first()
    if not challenge or challenge.consumed_at is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo reenviar el codigo OTP. Inicia sesion nuevamente.",
        )

    user = db.query(User).filter(User.id == challenge.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    settings_row = _get_or_create_user_security_settings(db, user.id)
    if not settings_row.two_factor_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La verificacion 2FA no esta activa para este usuario",
        )

    challenge.consumed_at = now
    otp_token, expires_in_seconds = _create_login_otp_challenge(db, user, now)
    db.commit()
    return LoginResponse(
        requires_2fa=True,
        otp_token=otp_token,
        message="Se envio un nuevo codigo OTP a tu correo.",
        expires_in_seconds=expires_in_seconds,
    )


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
