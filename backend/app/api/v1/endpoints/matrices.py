"""Matrix operation endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.math_input import MatrixInput, MatrixResult
from app.mathematics.matrices import (
    compute_determinant,
    compute_inverse,
    compute_eigenvalues,
    compute_rank,
    multiply_matrices,
    solve_linear_system,
)
from app.services.history_service import save_calculation

router = APIRouter()


@router.post("/determinant", response_model=MatrixResult)
async def determinant(
    data: MatrixInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_determinant(data.matrix_a)
    await save_calculation(db, current_user.id, "determinant", data.dict(), result)
    return result


@router.post("/inverse", response_model=MatrixResult)
async def inverse(
    data: MatrixInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_inverse(data.matrix_a)
    await save_calculation(db, current_user.id, "inverse", data.dict(), result)
    return result


@router.post("/eigenvalues", response_model=MatrixResult)
async def eigenvalues(
    data: MatrixInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_eigenvalues(data.matrix_a)
    await save_calculation(db, current_user.id, "eigenvalues", data.dict(), result)
    return result


@router.post("/rank", response_model=MatrixResult)
async def rank(
    data: MatrixInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = compute_rank(data.matrix_a)
    await save_calculation(db, current_user.id, "rank", data.dict(), result)
    return result


@router.post("/multiply", response_model=MatrixResult)
async def multiply(
    data: MatrixInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = multiply_matrices(data.matrix_a, data.matrix_b)
    await save_calculation(db, current_user.id, "multiply", data.dict(), result)
    return result


@router.post("/solve", response_model=MatrixResult)
async def solve(
    data: MatrixInput,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    result = solve_linear_system(data.matrix_a, data.vector_b)
    await save_calculation(db, current_user.id, "linear_solve", data.dict(), result)
    return result
