"""Progress Pydantic schemas."""
from datetime import datetime
from typing import Dict

from pydantic import BaseModel


class ProgressRead(BaseModel):
    user_id: int
    topic_scores: Dict[str, float]
    quizzes_completed: int
    calculations_done: int
    streak_days: int
    last_active: datetime

    model_config = {"from_attributes": True}
