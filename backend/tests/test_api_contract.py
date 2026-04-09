import os

os.environ["DATABASE_URL"] = "sqlite://"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.routers import auth as auth_router
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash
from app.db.database import Base, get_db
from app.main import app, clear_rate_limit_store
from app.models.user import PasswordResetToken, TeacherCode, User, UserRole


SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app, raise_server_exceptions=False)


def setup_function():
    # Cada prueba inicia con base limpia y sin estado acumulado de rate limit.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    clear_rate_limit_store()
    app.dependency_overrides[get_db] = override_get_db


def create_user(email: str, password: str, role: UserRole = UserRole.estudiante, is_active: bool = True):
    db = TestingSessionLocal()
    user = User(
        email=email,
        name="Usuario de prueba",
        hashed_password=get_password_hash(password),
        role=role,
        is_active=is_active,
        wants_newsletter=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


def create_teacher_code(code: str):
    db = TestingSessionLocal()
    teacher_code = TeacherCode(code=code, is_used=False)
    db.add(teacher_code)
    db.commit()
    db.refresh(teacher_code)
    db.close()
    return teacher_code


def auth_headers_for(user: User):
    token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"Authorization": f"Bearer {token}"}


def test_register_returns_201():
    # El camino exitoso debe crear el recurso y responder 201 Created.
    response = client.post(
        "/auth/register",
        json={
            "name": "Laura",
            "email": "laura@example.com",
            "password": "secret123",
            "wants_newsletter": False,
        },
    )

    assert response.status_code == 201
    assert response.json()["email"] == "laura@example.com"


def test_register_teacher_returns_201():
    create_teacher_code("ABC-123")

    response = client.post(
        "/auth/register/teacher",
        json={
            "name": "Docente",
            "email": "docente@example.com",
            "password": "secret123",
            "wants_newsletter": False,
            "teacher_code": "ABC-123",
        },
    )

    assert response.status_code == 201
    assert response.json()["role"] == "profesor"


def test_login_returns_200_for_valid_credentials():
    create_user("laura@example.com", "secret123")

    response = client.post(
        "/auth/login",
        data={"username": "laura@example.com", "password": "secret123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"


def test_reset_password_returns_202_when_user_exists():
    create_user("laura@example.com", "secret123")

    response = client.post(
        "/auth/reset-password",
        json={"email": "laura@example.com"},
    )

    assert response.status_code == 202
    assert "password reset link" in response.json()["msg"]


def test_reset_password_unknown_user_returns_202_contract():
    response = client.post(
        "/auth/reset-password",
        json={"email": "missing@example.com"},
    )

    assert response.status_code == 202
    assert "password reset link" in response.json()["msg"]


def test_reset_password_confirm_updates_password():
    create_user("laura@example.com", "secret123")

    original_token_factory = auth_router.generate_password_reset_token
    auth_router.generate_password_reset_token = lambda: "known-reset-token"
    try:
        request_response = client.post(
            "/auth/reset-password",
            json={"email": "laura@example.com"},
        )
    finally:
        auth_router.generate_password_reset_token = original_token_factory

    assert request_response.status_code == 202

    confirm_response = client.post(
        "/auth/reset-password/confirm",
        json={"token": "known-reset-token", "new_password": "newsecret123"},
    )

    assert confirm_response.status_code == 200
    assert confirm_response.json()["msg"] == "Password updated successfully"

    login_response = client.post(
        "/auth/login",
        data={"username": "laura@example.com", "password": "newsecret123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert login_response.status_code == 200

    db = TestingSessionLocal()
    reset_token = db.query(PasswordResetToken).first()
    assert reset_token is not None
    assert reset_token.used_at is not None
    db.close()


def test_reset_password_confirm_rejects_used_token():
    create_user("laura@example.com", "secret123")

    original_token_factory = auth_router.generate_password_reset_token
    auth_router.generate_password_reset_token = lambda: "known-reset-token"
    try:
        client.post(
            "/auth/reset-password",
            json={"email": "laura@example.com"},
        )
    finally:
        auth_router.generate_password_reset_token = original_token_factory

    first_confirm = client.post(
        "/auth/reset-password/confirm",
        json={"token": "known-reset-token", "new_password": "newsecret123"},
    )
    second_confirm = client.post(
        "/auth/reset-password/confirm",
        json={"token": "known-reset-token", "new_password": "anothersecret123"},
    )

    assert first_confirm.status_code == 200
    assert second_confirm.status_code == 400
    assert second_confirm.json()["error"]["code"] == "HTTP_400"


def test_register_malformed_json_returns_400_contract():
    # Un JSON mal formado se trata como bad request y no como error semantico de validacion.
    response = client.post(
        "/auth/register",
        content="{",
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 400
    assert response.json()["error"]["code"] == "HTTP_400"


def test_read_users_me_requires_auth_and_returns_401():
    response = client.get("/users/me")

    assert response.status_code == 401
    assert response.json()["error"]["code"] == "HTTP_401"


def test_inactive_user_returns_403():
    user = create_user("inactive@example.com", "secret123", is_active=False)

    response = client.get("/users/me", headers=auth_headers_for(user))

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "HTTP_403"


def test_register_method_not_allowed_returns_405_contract():
    response = client.get("/auth/register")

    assert response.status_code == 405
    assert response.json()["error"]["code"] == "HTTP_405"


def test_register_duplicate_email_returns_409_contract():
    payload = {
        "name": "Laura",
        "email": "laura@example.com",
        "password": "secret123",
        "wants_newsletter": False,
    }

    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "HTTP_409"


def test_update_profile_if_match_mismatch_returns_412_contract():
    # If-Match protege la actualizacion para no sobrescribir una representacion desactualizada del cliente.
    user = create_user("etag@example.com", "secret123")

    response = client.put(
        "/users/me",
        json={"name": "Actualizado"},
        headers={**auth_headers_for(user), "If-Match": "stale-etag"},
    )

    assert response.status_code == 412
    assert response.json()["error"]["code"] == "HTTP_412"


def test_register_large_payload_returns_413_contract():
    response = client.post(
        "/auth/register",
        json={
            "name": "A" * (settings.MAX_REQUEST_SIZE_BYTES + 32),
            "email": "large@example.com",
            "password": "secret123",
            "wants_newsletter": False,
        },
    )

    assert response.status_code == 413
    assert response.json()["error"]["code"] == "HTTP_413"


def test_register_wrong_content_type_returns_415_contract():
    response = client.post(
        "/auth/register",
        data="name=Laura",
        headers={"Content-Type": "text/plain"},
    )

    assert response.status_code == 415
    assert response.json()["error"]["code"] == "HTTP_415"


def test_register_validation_error_returns_422_contract():
    # Un JSON valido en forma pero invalido en negocio debe seguir respondiendo 422.
    response = client.post(
        "/auth/register",
        json={
            "name": "",
            "email": "not-an-email",
            "password": "secret123",
        },
    )

    assert response.status_code == 422
    assert response.json()["success"] is False
    assert response.json()["error"]["code"] == "HTTP_422"


def test_rate_limit_returns_429_contract():
    for _ in range(settings.RATE_LIMIT_REQUESTS):
        assert client.get("/health").status_code == 200

    response = client.get("/health")

    assert response.status_code == 429
    assert response.json()["error"]["code"] == "HTTP_429"


def test_register_operational_error_returns_503_contract():
    class FailingSession:
        def query(self, *_args, **_kwargs):
            raise OperationalError("SELECT 1", {}, Exception("db down"))

        def close(self):
            return None

    def failing_db():
        # Esta dependencia falsa aisla la ruta de 503 sin tocar la base de datos real de pruebas.
        yield FailingSession()

    app.dependency_overrides[get_db] = failing_db

    response = client.post(
        "/auth/register",
        json={
            "name": "Laura",
            "email": "laura@example.com",
            "password": "secret123",
            "wants_newsletter": False,
        },
    )

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "HTTP_503"


def test_register_unhandled_error_returns_500_contract(monkeypatch):
    # Las excepciones no controladas del servidor deben devolver un 500 controlado.
    monkeypatch.setattr(auth_router, "get_password_hash", lambda _password: (_ for _ in ()).throw(RuntimeError("boom")))

    response = client.post(
        "/auth/register",
        json={
            "name": "Laura",
            "email": "laura@example.com",
            "password": "secret123",
            "wants_newsletter": False,
        },
    )

    assert response.status_code == 500
    assert response.json()["error"]["code"] == "HTTP_500"
