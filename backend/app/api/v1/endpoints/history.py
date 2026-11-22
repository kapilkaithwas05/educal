"""Calculation history endpoints."""
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.calculation import CalculationHistoryRead
from app.services.history_service import get_user_history, delete_history_entry

router = APIRouter()


@router.get("/", response_model=List[CalculationHistoryRead])
async def list_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    topic: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return await get_user_history(db, current_user.id, skip=skip, limit=limit, topic=topic)


@router.delete("/{entry_id}", status_code=204)
async def delete_entry(
    entry_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    await delete_history_entry(db, current_user.id, entry_id)
