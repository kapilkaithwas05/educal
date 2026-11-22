"""Quiz Pydantic schemas."""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class QuestionRead(BaseModel):
    id: int
    text: str
    options: List[str]
    points: int

    model_config = {"from_attributes": True}


class QuizRead(BaseModel):
    id: int
    title: str
    topic: str
    difficulty: str
    description: Optional[str]
    questions: List[QuestionRead]

    model_config = {"from_attributes": True}


class QuizCreate(BaseModel):
    title: str
    topic: str
    difficulty: str = "medium"
    description: Optional[str] = None


class QuizSubmission(BaseModel):
    quiz_id: int
    answers: Dict[int, int]   # question_id -> selected option index


class QuizResult(BaseModel):
    quiz_id: int
    score: int
    total_points: int
    percentage: float
    correct_answers: int
    total_questions: int
    explanations: Dict[int, str]
