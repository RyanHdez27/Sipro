from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserRole, TeacherCode
from app.schemas.auth import PasswordResetRequest
from app.schemas.user import UserCreate, TeacherCreate, UserResponse
from app.schemas.token import Token
from app.core.security import get_password_hash, verify_password, create_access_token

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
    # 1. Validar correo
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    
    # 2. Validar teacher code y consumirlo en la misma transacción
    code_record = db.query(TeacherCode).filter(TeacherCode.code == user_in.teacher_code, TeacherCode.is_used == False).first()
    if not code_record:
        raise HTTPException(status_code=400, detail="Código de validación de profesor inválido o ya usado")
    
    code_record.is_used = True
    
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
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Las credenciales invalidas deben responder 401 para que el cliente lo trate como fallo de autenticacion.
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Codificar también el scope/rol en el payload
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}
    
@router.post("/reset-password", status_code=status.HTTP_202_ACCEPTED)
def reset_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    # El flujo de recuperacion es asincrono desde la perspectiva del cliente, por eso 202 es el mejor ajuste.
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"msg": "If an account with that email exists, a password reset link has been sent."}
