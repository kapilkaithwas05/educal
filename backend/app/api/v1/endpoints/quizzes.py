"""Quiz endpoints."""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.quiz import QuizCreate, QuizRead, QuizSubmission, QuizResult
from app.services.quiz_service import (
    get_quizzes,
    get_quiz_by_id,
    create_quiz,
    submit_quiz,
)

router = APIRouter()


@router.get("/", response_model=List[QuizRead])
async def list_quizzes(
    topic: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return await get_quizzes(db, topic=topic)


@router.get("/{quiz_id}", response_model=QuizRead)
async def get_quiz(
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return await get_quiz_by_id(db, quiz_id)


@router.post("/submit", response_model=QuizResult)
async def submit(
    submission: QuizSubmission,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return await submit_quiz(db, current_user.id, submission)
