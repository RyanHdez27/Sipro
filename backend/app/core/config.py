from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg://postgres:password@localhost:5432/sipro_db"
    SECRET_KEY: str = "super-secret-key-12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MAX_REQUEST_SIZE_BYTES: int = 1048576
    RATE_LIMIT_REQUESTS: int = 5
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
