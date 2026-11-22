"""Statistics endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_optional_current_user
from app.models.user import User
from app.schemas.math_input import StatisticsInput, StatisticsResult
from app.mathematics.statistics import compute_descriptive_stats, compute_regression
from app.services.history_service import save_calculation

router = APIRouter()


@router.post("/descriptive", response_model=StatisticsResult)
async def descriptive(
    data: StatisticsInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_descriptive_stats(data.data)
    if current_user:
        await save_calculation(db, current_user.id, "descriptive_stats", data.model_dump(), result)
    return result


@router.post("/regression", response_model=StatisticsResult)
async def regression(
    data: StatisticsInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_regression(data.x_data, data.y_data, data.regression_type or "linear")
    if current_user:
        await save_calculation(db, current_user.id, "regression", data.model_dump(), result)
    return result
