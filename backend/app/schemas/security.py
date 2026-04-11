from pydantic import BaseModel


class UserSecurityResponse(BaseModel):
    two_factor_enabled: bool


class UserSecurityUpdate(BaseModel):
    two_factor_enabled: bool
