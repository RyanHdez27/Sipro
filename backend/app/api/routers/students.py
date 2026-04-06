from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.student import Student
from app.models.pedagogy import StudentMastery
from app.models.assessment import Assessment, Result
from app.models.question import Competency
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse
from app.schemas.pedagogy import StudentMasteryResponse

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: UUID,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    for field, value in student_in.model_dump(exclude_unset=True).items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student


@router.get("/{student_id}/progress", response_model=list[StudentMasteryResponse])
def get_student_progress(student_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve el puntaje de dominio por competencia del estudiante."""
    mastery = db.query(StudentMastery).filter(StudentMastery.student_id == student_id).all()
    return mastery


@router.get("/{student_id}/history")
def get_student_history(student_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Lista todos los simulacros realizados con sus puntajes."""
    assessments = (
        db.query(Assessment, Result)
        .outerjoin(Result, Result.assessment_id == Assessment.id)
        .filter(Assessment.student_id == student_id)
        .order_by(Assessment.started_at.desc())
        .all()
    )
    history = []
    for assessment, result in assessments:
        entry = {
            "assessment_id": str(assessment.id),
            "kind": assessment.kind,
            "status": assessment.status,
            "started_at": assessment.started_at.isoformat() if assessment.started_at else None,
            "submitted_at": assessment.submitted_at.isoformat() if assessment.submitted_at else None,
        }
        if result:
            entry["total_items"] = result.total_items
            entry["correct_items"] = result.correct_items
            entry["percent"] = float(result.percent)
        history.append(entry)
    return history
