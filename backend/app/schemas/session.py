from datetime import datetime

from pydantic import BaseModel


class ActiveSessionResponse(BaseModel):
    session_id: str
    ip: str | None = None
    user_agent: str | None = None
    created_at: datetime
    last_seen_at: datetime | None = None
    expires_at: datetime
    is_current: bool


class SessionRevokeResponse(BaseModel):
    revoked: bool
    revoked_session_id: str
    was_current: bool


class RevokeAllSessionsResponse(BaseModel):
    revoked_count: int
    current_session_revoked: bool
