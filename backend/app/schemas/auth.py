from pydantic import BaseModel, EmailStr, Field


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    token: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=128)


class LoginResponse(BaseModel):
    access_token: str | None = None
    token_type: str | None = None
    requires_2fa: bool = False
    otp_token: str | None = None
    message: str | None = None
    expires_in_seconds: int | None = None


class TwoFactorVerifyRequest(BaseModel):
    otp_token: str = Field(min_length=1)
    otp_code: str = Field(pattern=r"^\d{6}$")


class TwoFactorResendRequest(BaseModel):
    otp_token: str = Field(min_length=1)
