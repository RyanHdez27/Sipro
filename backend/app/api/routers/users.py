import hashlib

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserProfile
from app.schemas.profile import UserProfileResponse, UserProfileUpdate
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


def _build_profile_response(user_id: int, profile: UserProfile | None) -> UserProfileResponse:
    if not profile:
        return UserProfileResponse(user_id=user_id)
    return UserProfileResponse.model_validate(profile)


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

    try:
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
    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo actualizar el perfil del usuario",
        ) from exc


@router.get("/me/profile", response_model=UserProfileResponse)
def read_user_profile_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        return _build_profile_response(current_user.id, profile)
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo consultar el perfil académico",
        ) from exc


@router.put("/me/profile", response_model=UserProfileResponse)
def update_user_profile_me(
    profile_in: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if not profile:
            profile = UserProfile(user_id=current_user.id)
            db.add(profile)

        if profile_in.career is not None:
            profile.career = profile_in.career
        if profile_in.university is not None:
            profile.university = profile_in.university
        if profile_in.semester is not None:
            profile.semester = profile_in.semester
        if profile_in.objective_score is not None:
            profile.objective_score = profile_in.objective_score
        if profile_in.practice_frequency is not None:
            profile.practice_frequency = profile_in.practice_frequency
        if profile_in.preferred_difficulty is not None:
            profile.preferred_difficulty = profile_in.preferred_difficulty

        db.commit()
        db.refresh(profile)
        return UserProfileResponse.model_validate(profile)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo guardar el perfil académico",
        ) from exc
