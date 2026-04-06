from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func as sql_func
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.question import Question, Competency, Topic
from app.schemas.question import (
    QuestionCreate,
    QuestionResponse,
    QuestionWithAnswer,
    CompetencyResponse,
)

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("/categories", response_model=list[CompetencyResponse])
def list_categories(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Lista todas las competencias disponibles del ICFES."""
    return db.query(Competency).all()


@router.post("/exam", response_model=list[QuestionResponse])
def generate_exam(
    n_questions: int = Query(default=10, ge=1, le=50),
    competency_code: str | None = Query(default=None),
    max_difficulty: int = Query(default=5, ge=1, le=5),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Genera un simulacro con N preguntas aleatorias según criterios."""
    query = db.query(Question).filter(
        Question.is_active == True,
        Question.difficulty <= max_difficulty,
    )
    if competency_code:
        query = query.join(Competency).filter(Competency.code == competency_code)

    questions = query.order_by(sql_func.random()).limit(n_questions).all()
    return questions


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(question_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve una pregunta sin la clave de respuesta (para el estudiante)."""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.get("/{question_id}/answer", response_model=QuestionWithAnswer)
def get_question_answer(question_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Devuelve la clave de respuesta — solo para calificación interna (Agente 1)."""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.post("/", response_model=QuestionResponse, status_code=201)
def create_question(question_in: QuestionCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Crea una nueva pregunta en el banco (solo administradores)."""
    question = Question(**question_in.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question
