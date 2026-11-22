"""Calculation history Pydantic schemas."""
from datetime import datetime
from typing import Any, Dict

from pydantic import BaseModel


class CalculationHistoryRead(BaseModel):
    id: int
    topic: str
    operation: str
    input_data: Dict[str, Any]
    result_data: Dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}
