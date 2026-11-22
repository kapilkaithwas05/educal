"""Numerical methods endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_optional_current_user
from app.models.user import User
from app.schemas.math_input import NumericalInput, NumericalResult
from app.mathematics.numerical_methods import (
    bisection_method,
    newton_raphson,
    runge_kutta_4,
    numerical_integration,
)
from app.services.history_service import save_calculation

router = APIRouter()


@router.post("/bisection", response_model=NumericalResult)
async def bisection(
    data: NumericalInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = bisection_method(data.expression, data.variable, data.a, data.b, data.tolerance)
    if current_user:
        await save_calculation(db, current_user.id, "bisection", data.model_dump(), result)
    return result


@router.post("/newton-raphson", response_model=NumericalResult)
async def newton_raphson_endpoint(
    data: NumericalInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = newton_raphson(data.expression, data.variable, data.initial_guess, data.tolerance)
    if current_user:
        await save_calculation(db, current_user.id, "newton_raphson", data.model_dump(), result)
    return result


@router.post("/runge-kutta", response_model=NumericalResult)
async def runge_kutta(
    data: NumericalInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = runge_kutta_4(data.expression, data.variable, data.a, data.b, data.h, data.y0)
    if current_user:
        await save_calculation(db, current_user.id, "runge_kutta", data.model_dump(), result)
    return result


@router.post("/integration", response_model=NumericalResult)
async def integration(
    data: NumericalInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = numerical_integration(
        data.expression, data.variable, data.a or 0.0, data.b or 1.0, data.intervals or 100, data.method or "simpson"
    )
    if current_user:
        await save_calculation(db, current_user.id, "num_integration", data.model_dump(), result)
    return result
