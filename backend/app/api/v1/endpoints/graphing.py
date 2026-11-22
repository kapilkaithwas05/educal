"""Graphing / plotting endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.math_input import GraphInput, GraphResult
from app.mathematics.graphing import generate_plot_data

router = APIRouter()


@router.post("/plot", response_model=GraphResult)
async def plot(
    data: GraphInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = generate_plot_data(data.expressions, data.variable, data.x_min, data.x_max, data.points)
    return result
