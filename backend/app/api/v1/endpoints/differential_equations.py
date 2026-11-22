"""Differential equations endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.math_input import ODEInput, ODEResult
from app.mathematics.differential_equations import solve_ode, solve_ode_system
from app.services.history_service import save_calculation

router = APIRouter()


@router.post("/solve", response_model=ODEResult)
async def solve(
    data: ODEInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = solve_ode(data.equation, data.variable, data.function, data.initial_conditions)
    await save_calculation(db, current_user.id, "ode_solve", data.dict(), result)
    return result
