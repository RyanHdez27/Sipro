from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from pydantic import BaseModel


# ── ChatSession ──────────────────────────────────────────────────
class ChatSessionBase(BaseModel):
    student_id: UUID
    context: Any = {}

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionResponse(ChatSessionBase):
    id: UUID
    summary: Optional[str] = None
    created_at: datetime
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── ChatMessage ──────────────────────────────────────────────────
class ChatMessageBase(BaseModel):
    chat_session_id: UUID
    role: str
    content: str
    metadata: Any = {}

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ── MessageCitation ──────────────────────────────────────────────
class MessageCitationBase(BaseModel):
    chat_message_id: UUID
    content_chunk_id: UUID
    score: Decimal
    span: Optional[Any] = None

class MessageCitationCreate(MessageCitationBase):
    pass

class MessageCitationResponse(MessageCitationBase):
    id: UUID

    class Config:
        from_attributes = True
