from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func as sql_func
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.assessment import Assessment, Result
from app.models.student import Student

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/student/{student_id}")
def list_student_reports(student_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Lista todos los reportes disponibles de un estudiante."""
    results = (
        db.query(Result, Assessment)
        .join(Assessment, Result.assessment_id == Assessment.id)
        .filter(Assessment.student_id == student_id)
        .order_by(Result.created_at.desc())
        .all()
    )
    return [
        {
            "result_id": str(r.id),
            "assessment_id": str(a.id),
            "kind": a.kind,
            "percent": float(r.percent),
            "total_items": r.total_items,
            "correct_items": r.correct_items,
            "created_at": r.created_at.isoformat(),
        }
        for r, a in results
    ]


@router.post("/export")
def export_report(
    result_id: UUID,
    send_email: bool = False,
    _=Depends(get_current_user),
):
    """
    Stub — genera el PDF de un simulacro y opcionalmente lo envía por correo.
    Se implementará con WeasyPrint + SMTP.
    """
    return {
        "status": "pending_integration",
        "message": "Generación de PDF pendiente de integración con WeasyPrint",
        "result_id": str(result_id),
        "send_email": send_email,
    }


@router.get("/group")
def group_report(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Reporte grupal con el promedio de todos los estudiantes (para docentes)."""
    stats = db.query(
        sql_func.count(Result.id).label("total_exams"),
        sql_func.avg(Result.percent).label("avg_percent"),
    ).first()

    return {
        "total_exams": stats.total_exams if stats else 0,
        "avg_percent": round(float(stats.avg_percent), 2) if stats and stats.avg_percent else 0,
    }


@router.get("/analytics")
def platform_analytics(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Métricas generales de uso de la plataforma."""
    total_students = db.query(Student).count()
    total_assessments = db.query(Assessment).count()
    total_results = db.query(Result).count()

    avg_score = db.query(sql_func.avg(Result.percent)).scalar()

    return {
        "total_students": total_students,
        "total_assessments": total_assessments,
        "total_graded": total_results,
        "avg_score_percent": round(float(avg_score), 2) if avg_score else 0,
    }
