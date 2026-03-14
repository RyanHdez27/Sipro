from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.core.security import get_password_hash
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.id == current_user.id).first()
    
    if user_in.email and user_in.email != current_user.email:
        # Check if email exists
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = user_in.email

    if user_in.name is not None:
        user.name = user_in.name
    if user_in.wants_newsletter is not None:
        user.wants_newsletter = user_in.wants_newsletter
    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)

    db.commit()
    db.refresh(user)
    return user
