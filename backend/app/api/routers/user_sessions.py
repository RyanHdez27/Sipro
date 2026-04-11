from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_token_data, get_current_user
from app.db.database import get_db
from app.models.user import User, UserSession
from app.schemas.session import ActiveSessionResponse, RevokeAllSessionsResponse, SessionRevokeResponse
from app.schemas.token import TokenData

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/sessions", response_model=list[ActiveSessionResponse])
def list_user_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    token_data: TokenData = Depends(get_current_token_data),
):
    now = datetime.now(timezone.utc)
    try:
        sessions = db.query(UserSession).filter(
            UserSession.user_id == current_user.id,
            UserSession.revoked_at.is_(None),
        ).all()

        response_items: list[ActiveSessionResponse] = []
        for session in sessions:
            expires_at = session.expires_at
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at < now:
                continue

            response_items.append(
                ActiveSessionResponse(
                    session_id=session.session_id,
                    ip=session.ip,
                    user_agent=session.user_agent,
                    created_at=session.created_at,
                    last_seen_at=session.last_seen_at,
                    expires_at=expires_at,
                    is_current=(token_data.session_id == session.session_id),
                )
            )

        response_items.sort(
            key=lambda item: item.last_seen_at or item.created_at,
            reverse=True,
        )
        return response_items
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudieron cargar las sesiones activas",
        ) from exc


@router.delete("/me/sessions/{session_id}", response_model=SessionRevokeResponse)
def revoke_one_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    token_data: TokenData = Depends(get_current_token_data),
):
    session = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.session_id == session_id,
        UserSession.revoked_at.is_(None),
    ).first()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sesion no encontrada")

    try:
        session.revoked_at = datetime.now(timezone.utc)
        db.commit()
        return SessionRevokeResponse(
            revoked=True,
            revoked_session_id=session_id,
            was_current=(token_data.session_id == session_id),
        )
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo cerrar la sesion",
        ) from exc


@router.delete("/me/sessions", response_model=RevokeAllSessionsResponse)
def revoke_all_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    token_data: TokenData = Depends(get_current_token_data),
):
    now = datetime.now(timezone.utc)
    sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id,
        UserSession.revoked_at.is_(None),
    ).all()

    try:
        revoked_count = 0
        current_session_revoked = False
        for session in sessions:
            if session.revoked_at is None:
                session.revoked_at = now
                revoked_count += 1
                if token_data.session_id == session.session_id:
                    current_session_revoked = True

        db.commit()
        return RevokeAllSessionsResponse(
            revoked_count=revoked_count,
            current_session_revoked=current_session_revoked,
        )
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudieron cerrar las sesiones",
        ) from exc
