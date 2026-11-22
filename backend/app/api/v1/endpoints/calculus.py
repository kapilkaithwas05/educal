"""Calculus computation endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.math_input import CalculusInput, CalculusResult
from app.mathematics.calculus import (
    compute_derivative,
    compute_integral,
    compute_limit,
    compute_taylor_series,
)
from app.services.history_service import save_calculation

router = APIRouter()


@router.post("/derivative", response_model=CalculusResult)
async def derivative(
    data: CalculusInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_derivative(data.expression, data.variable, data.order or 1)
    await save_calculation(db, current_user.id, "derivative", data.dict(), result)
    return result


@router.post("/integral", response_model=CalculusResult)
async def integral(
    data: CalculusInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_integral(data.expression, data.variable, data.lower_bound, data.upper_bound)
    await save_calculation(db, current_user.id, "integral", data.dict(), result)
    return result


@router.post("/limit", response_model=CalculusResult)
async def limit(
    data: CalculusInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_limit(data.expression, data.variable, data.point)
    await save_calculation(db, current_user.id, "limit", data.dict(), result)
    return result


@router.post("/taylor", response_model=CalculusResult)
async def taylor(
    data: CalculusInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_taylor_series(data.expression, data.variable, data.point or 0, data.order or 6)
    await save_calculation(db, current_user.id, "taylor", data.dict(), result)
    return result
