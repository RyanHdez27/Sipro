import uuid
from datetime import datetime, timezone
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatSessionResponse

router = APIRouter(prefix="/tutor", tags=["tutor"])


@router.post("/session/start", response_model=ChatSessionResponse)
def start_session(
    student_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Crea una nueva sesión de tutoría y devuelve el session_id."""
    session = ChatSession(
        id=uuid.uuid4(),
        student_id=student_id,
        context={},
        created_at=datetime.now(timezone.utc),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/session/{session_id}", response_model=ChatSessionResponse)
def get_session(session_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve los datos de una sesión activa."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return session


@router.get("/session/{session_id}/messages")
def get_session_messages(session_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve todos los mensajes de una sesión de chat."""
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return [
        {
            "id": str(m.id),
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat(),
        }
        for m in messages
    ]


@router.delete("/session/{session_id}")
def close_session(session_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Cierra manualmente una sesión de tutoría."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    session.closed_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Session closed", "session_id": str(session_id)}


# ── WebSocket placeholder ────────────────────────────────────────
# El WebSocket /tutor/chat/{session_id} se implementará cuando se integre
# el Agente 3 con LangGraph. Requiere:
# - from fastapi import WebSocket, WebSocketDisconnect
# - Loop de recepción/envío de mensajes
# - Integración con LLM
