"""Differential equations endpoints."""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_optional_current_user
from app.models.user import User
from app.schemas.math_input import ODEInput, ODEResult
from app.mathematics.differential_equations import solve_ode
from app.services.history_service import save_calculation

router = APIRouter()


@router.post("/solve", response_model=ODEResult)
async def solve(
    data: ODEInput,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = solve_ode(data.equation, data.variable, data.function, data.initial_conditions)
    if current_user:
        await save_calculation(db, current_user.id, "ode_solve", data.model_dump(), result)
    return result
