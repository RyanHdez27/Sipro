from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.pedagogy import StudentMastery
from app.models.assessment import CompetencyResult, Result
from app.schemas.pedagogy import StudentMasteryResponse

router = APIRouter(prefix="/pedagogy", tags=["pedagogy"])


@router.post("/analyze")
def analyze_results(
    result_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """
    Stub para el Agente 2 — recibe el result_id y ejecutará el análisis pedagógico.
    Cuando LangChain/LangGraph estén integrados, aquí se llamará al LLM con RAG.
    """
    result = db.query(Result).filter(Result.id == result_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    return {
        "status": "pending_llm_integration",
        "message": "Agente 2 pendiente de integración con LangChain/LangGraph",
        "result_id": str(result_id),
    }


@router.get("/{student_id}/profile", response_model=list[StudentMasteryResponse])
def get_pedagogical_profile(student_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve el perfil pedagógico acumulado del estudiante (dominio por competencia)."""
    mastery = db.query(StudentMastery).filter(StudentMastery.student_id == student_id).all()
    return mastery


@router.get("/{student_id}/feedback")
def get_last_feedback(student_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """
    Stub — devuelve la última retroalimentación generada.
    Se implementará con la integración del Agente 2 (LLM).
    """
    return {
        "status": "pending_llm_integration",
        "message": "Retroalimentación pendiente de integración con Agente 2",
        "student_id": str(student_id),
    }


@router.post("/recovery-test")
def generate_recovery_test(
    student_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """
    Stub para generar test de recuperación basado en debilidades.
    Se implementará con la integración del Agente 2 (LLM).
    """
    return {
        "status": "pending_llm_integration",
        "message": "Test de recuperación pendiente de integración con Agente 2",
        "student_id": str(student_id),
    }
