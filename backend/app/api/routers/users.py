import hashlib

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.core.security import get_password_hash
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


def _build_user_etag(user: User) -> str:
    # El ETag funciona como una huella ligera del recurso para soportar actualizaciones condicionales.
    raw = (
        f"{user.id}:{user.email}:{user.name}:{user.role.value}:"
        f"{user.is_active}:{user.wants_newsletter}:{user.phone}:{user.avatar_url}"
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


@router.get("/me", response_model=UserResponse)
def read_users_me(response: Response, current_user: User = Depends(get_current_user)):
    # Retornar el ETag permite que el cliente envie If-Match en futuras actualizaciones.
    response.headers["ETag"] = _build_user_etag(current_user)
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    user_in: UserUpdate,
    response: Response,
    if_match: str | None = Header(default=None, alias="If-Match"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()

    # Un If-Match desactualizado indica que el cliente intenta actualizar una version vieja del recurso.
    current_etag = _build_user_etag(user)
    if if_match and if_match != current_etag:
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="Resource representation is outdated",
        )

    if user_in.email and user_in.email != current_user.email:
        # Verifica si el correo ya existe
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user.email = user_in.email

    if user_in.name is not None:
        user.name = user_in.name
    if user_in.wants_newsletter is not None:
        user.wants_newsletter = user_in.wants_newsletter
    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)
    if user_in.phone is not None:
        user.phone = user_in.phone
    if user_in.avatar_url is not None:
        user.avatar_url = user_in.avatar_url

    db.commit()
    db.refresh(user)
    response.headers["ETag"] = _build_user_etag(user)
    return user
