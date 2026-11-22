"""Quiz management and submission service."""
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.progress import Progress
from app.models.quiz import Question, Quiz
from app.schemas.quiz import QuizCreate, QuizResult, QuizSubmission


async def get_quizzes(db: AsyncSession, topic: Optional[str] = None) -> List[Quiz]:
    stmt = select(Quiz).options(selectinload(Quiz.questions))
    if topic:
        stmt = stmt.where(Quiz.topic == topic)
    res = await db.execute(stmt)
    return list(res.scalars().all())


async def get_quiz_by_id(db: AsyncSession, quiz_id: int) -> Quiz:
    stmt = select(Quiz).options(selectinload(Quiz.questions)).where(Quiz.id == quiz_id)
    res = await db.execute(stmt)
    quiz = res.scalars().first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


async def create_quiz(db: AsyncSession, quiz_in: QuizCreate) -> Quiz:
    quiz = Quiz(
        title=quiz_in.title,
        topic=quiz_in.topic,
        difficulty=quiz_in.difficulty,
        description=quiz_in.description,
    )
    db.add(quiz)
    await db.commit()
    await db.refresh(quiz)
    return quiz


async def submit_quiz(db: AsyncSession, user_id: int, submission: QuizSubmission) -> QuizResult:
    quiz = await get_quiz_by_id(db, submission.quiz_id)

    score = 0
    total_points = 0
    correct_count = 0
    explanations = {}

    for q in quiz.questions:
        total_points += q.points
        explanations[q.id] = q.explanation or f"Correct answer is option {q.correct_index + 1}"
        user_ans = submission.answers.get(q.id)
        if user_ans is not None and user_ans == q.correct_index:
            score += q.points
            correct_count += 1

    percentage = round((score / total_points * 100.0) if total_points > 0 else 0.0, 1)

    # Update student progress
    prog_res = await db.execute(select(Progress).where(Progress.user_id == user_id))
    prog = prog_res.scalars().first()
    if prog:
        prog.quizzes_completed += 1
        current_scores = dict(prog.topic_scores or {})
        prev = current_scores.get(quiz.topic, percentage)
        current_scores[quiz.topic] = round((prev + percentage) / 2.0, 1)
        prog.topic_scores = current_scores
        prog.last_active = datetime.now(timezone.utc)
        await db.commit()

    return QuizResult(
        quiz_id=quiz.id,
        score=score,
        total_points=total_points,
        percentage=percentage,
        correct_answers=correct_count,
        total_questions=len(quiz.questions),
        explanations=explanations,
    )
