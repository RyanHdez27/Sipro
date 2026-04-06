from typing import Optional, Any
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


# ── ContentSource ────────────────────────────────────────────────
class ContentSourceBase(BaseModel):
    title: str
    source_type: str
    uri: Optional[str] = None
    topic_id: Optional[UUID] = None

class ContentSourceCreate(ContentSourceBase):
    pass

class ContentSourceResponse(ContentSourceBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# ── ContentChunk ─────────────────────────────────────────────────
class ContentChunkBase(BaseModel):
    source_id: UUID
    chunk_index: int
    content: str
    metadata: Any = {}

class ContentChunkCreate(ContentChunkBase):
    pass

class ContentChunkResponse(ContentChunkBase):
    id: UUID

    class Config:
        from_attributes = True
