from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.content import ContentChunk, ContentSource

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


@router.post("/index")
def index_document(
    _=Depends(get_current_user),
):
    """
    Stub — indexa un documento académico nuevo en pgvector.
    Se implementará cuando HuggingFace + pgvector estén integrados.
    """
    return {
        "status": "pending_integration",
        "message": "Indexación pendiente de integración con HuggingFace embeddings",
    }


@router.post("/search")
def search_embeddings(
    query: str,
    _=Depends(get_current_user),
):
    """
    Stub — búsqueda semántica + Cohere reranking.
    Se implementará cuando HuggingFace + Cohere estén integrados.
    """
    return {
        "status": "pending_integration",
        "message": "Búsqueda semántica pendiente de integración",
        "query": query,
        "results": [],
    }


@router.get("/status")
def embeddings_status(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Indica cuántos documentos y chunks están indexados."""
    total_sources = db.query(ContentSource).count()
    total_chunks = db.query(ContentChunk).count()
    return {
        "total_sources": total_sources,
        "total_chunks": total_chunks,
    }
