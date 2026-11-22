"""Numerical methods endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
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
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = bisection_method(data.expression, data.variable, data.a, data.b, data.tolerance)
    await save_calculation(db, current_user.id, "bisection", data.dict(), result)
    return result


@router.post("/newton-raphson", response_model=NumericalResult)
async def newton_raphson_endpoint(
    data: NumericalInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = newton_raphson(data.expression, data.variable, data.initial_guess, data.tolerance)
    await save_calculation(db, current_user.id, "newton_raphson", data.dict(), result)
    return result


@router.post("/runge-kutta", response_model=NumericalResult)
async def runge_kutta(
    data: NumericalInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = runge_kutta_4(data.expression, data.variable, data.a, data.b, data.h, data.y0)
    await save_calculation(db, current_user.id, "runge_kutta", data.dict(), result)
    return result


@router.post("/integration", response_model=NumericalResult)
async def integration(
    data: NumericalInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = numerical_integration(data.expression, data.variable, data.a, data.b, data.n)
    await save_calculation(db, current_user.id, "numerical_integration", data.dict(), result)
    return result
