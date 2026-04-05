import time
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routers import auth, users, admin
from app.core.config import settings
from app.db.database import engine, Base

# Crea las tablas automaticamente para el alcance actual del MVP
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SIPRO UDC MVP API")
RATE_LIMIT_BUCKETS: dict[str, list[float]] = defaultdict(list)


def clear_rate_limit_store():
    RATE_LIMIT_BUCKETS.clear()


def build_error_response(status_code: int, message: str, details: list | None = None):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "error": {
                "code": f"HTTP_{status_code}",
                "details": details or [],
            },
        },
    )

# Configura CORS para el frontend en Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)


@app.middleware("http")
async def request_contract_middleware(request: Request, call_next):
    # Estas validaciones centralizan los contratos HTTP obligatorios que aplican a los endpoints actuales del MVP.
    limited_key = f"{request.client.host if request.client else 'local'}:{request.url.path}"
    now = time.time()
    window_start = now - settings.RATE_LIMIT_WINDOW_SECONDS
    RATE_LIMIT_BUCKETS[limited_key] = [
        timestamp for timestamp in RATE_LIMIT_BUCKETS[limited_key] if timestamp > window_start
    ]
    if len(RATE_LIMIT_BUCKETS[limited_key]) >= settings.RATE_LIMIT_REQUESTS:
        return build_error_response(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Rate limit exceeded",
        )
    RATE_LIMIT_BUCKETS[limited_key].append(now)

    content_length = request.headers.get("content-length")
    if content_length:
        try:
            payload_size = int(content_length)
        except ValueError:
            payload_size = 0
        if payload_size > settings.MAX_REQUEST_SIZE_BYTES:
            return build_error_response(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                "Request payload is too large",
            )

    json_routes = {
        ("/auth/register", "POST"),
        ("/auth/register/teacher", "POST"),
        ("/auth/reset-password", "POST"),
        ("/users/me", "PUT"),
    }
    login_routes = {("/auth/login", "POST")}
    route_key = (request.url.path, request.method.upper())
    content_type = request.headers.get("content-type", "").split(";")[0]

    if route_key in json_routes and content_type != "application/json":
        return build_error_response(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            "Content-Type must be application/json",
        )

    if route_key in login_routes and content_type not in {
        "application/x-www-form-urlencoded",
        "multipart/form-data",
    }:
        return build_error_response(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            "Content-Type must be form data",
        )

    return await call_next(request)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    response = build_error_response(exc.status_code, str(exc.detail))
    if exc.headers:
        response.headers.update(exc.headers)
    return response


@app.exception_handler(StarletteHTTPException)
async def starlette_http_exception_handler(_: Request, exc: StarletteHTTPException):
    return build_error_response(exc.status_code, str(exc.detail))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    errors = exc.errors()
    if any(error.get("type") == "json_invalid" for error in errors):
        return build_error_response(
            status.HTTP_400_BAD_REQUEST,
            "Malformed JSON payload",
            errors,
        )
    return build_error_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Validation error",
        errors,
    )


@app.exception_handler(OperationalError)
async def operational_error_handler(_: Request, __: OperationalError):
    # Las fallas de disponibilidad de base de datos se exponen como 503 en el alcance actual del backend.
    return build_error_response(
        status.HTTP_503_SERVICE_UNAVAILABLE,
        "Required service is temporarily unavailable",
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(_: Request, __: Exception):
    # Cualquier error no controlado del servidor debe resolverse con una respuesta 500 controlada.
    return build_error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal server error",
    )

@app.get("/health")
def health_check():
    return {"status": "ok"}
