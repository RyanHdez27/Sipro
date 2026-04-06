import uuid
from datetime import datetime, timezone
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.assessment import Assessment, AssessmentItem, Response, Result, CompetencyResult
from app.models.question import Question
from app.schemas.assessment import (
    AssessmentResponse,
    ResultResponse,
    ExamSubmission,
)

router = APIRouter(prefix="/evaluation", tags=["evaluation"])


@router.post("/submit", response_model=ResultResponse)
def submit_evaluation(
    submission: ExamSubmission,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """
    Recibe las respuestas del estudiante, califica (Agente 1 — lógica determinista)
    y guarda el resultado en la base de datos.
    """
    # 1. Verificar que el assessment existe
    assessment = db.query(Assessment).filter(Assessment.id == submission.assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # 2. Obtener los assessment_items con sus preguntas
    items = (
        db.query(AssessmentItem, Question)
        .join(Question, AssessmentItem.question_id == Question.id)
        .filter(AssessmentItem.assessment_id == assessment.id)
        .all()
    )
    item_map = {str(item.id): (item, question) for item, question in items}

    # 3. Calificar cada respuesta (Agente 1 — determinista)
    total = 0
    correct_count = 0
    for answer_data in submission.answers:
        item_id = str(answer_data.get("assessment_item_id"))
        student_answer = answer_data.get("answer")

        if item_id not in item_map:
            continue

        ai, question = item_map[item_id]
        is_correct = student_answer == question.answer_key
        total += 1
        if is_correct:
            correct_count += 1

        # Guardar la respuesta
        response = Response(
            id=uuid.uuid4(),
            assessment_item_id=ai.id,
            answer=student_answer,
            is_correct=is_correct,
            score=Decimal("1.0") if is_correct else Decimal("0.0"),
            answered_at=datetime.now(timezone.utc),
        )
        db.add(response)

    # 4. Calcular porcentaje y guardar resultado
    percent = Decimal(str(round(correct_count / total * 100, 2))) if total > 0 else Decimal("0")
    result = Result(
        id=uuid.uuid4(),
        assessment_id=assessment.id,
        total_items=total,
        correct_items=correct_count,
        percent=percent,
        report_json={
            "total": total,
            "correct": correct_count,
            "percent": float(percent),
        },
        created_at=datetime.now(timezone.utc),
    )
    db.add(result)

    # 5. Actualizar estado del assessment
    assessment.status = "graded"
    assessment.graded_at = datetime.now(timezone.utc)
    assessment.submitted_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(result)
    return result


@router.get("/{assessment_id}/report", response_model=ResultResponse)
def get_evaluation_report(assessment_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve el reporte completo de un simulacro calificado."""
    result = db.query(Result).filter(Result.assessment_id == assessment_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Result not found for this assessment")
    return result


@router.get("/{assessment_id}/status")
def get_evaluation_status(assessment_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Indica si el simulacro está en progreso, enviado o calificado."""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"assessment_id": str(assessment.id), "status": assessment.status}
