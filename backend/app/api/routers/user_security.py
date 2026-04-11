from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User, UserSecuritySettings
from app.schemas.security import UserSecurityResponse, UserSecurityUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _get_or_create_user_security_settings(db: Session, user_id: int) -> UserSecuritySettings:
    settings_row = db.query(UserSecuritySettings).filter(UserSecuritySettings.user_id == user_id).first()
    if settings_row:
        return settings_row

    settings_row = UserSecuritySettings(user_id=user_id, two_factor_enabled=False)
    db.add(settings_row)
    db.flush()
    return settings_row


@router.get("/me/security", response_model=UserSecurityResponse)
def read_user_security_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        settings_row = _get_or_create_user_security_settings(db, current_user.id)
        db.commit()
        return UserSecurityResponse(two_factor_enabled=settings_row.two_factor_enabled)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo consultar la configuracion de seguridad",
        ) from exc


@router.put("/me/security", response_model=UserSecurityResponse)
def update_user_security_me(
    payload: UserSecurityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        settings_row = _get_or_create_user_security_settings(db, current_user.id)
        settings_row.two_factor_enabled = payload.two_factor_enabled
        db.commit()
        db.refresh(settings_row)
        return UserSecurityResponse(two_factor_enabled=settings_row.two_factor_enabled)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo actualizar la configuracion de seguridad",
        ) from exc
