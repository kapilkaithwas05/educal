"""Progress tracking endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_active_user
from app.models.user import User
from app.schemas.progress import ProgressRead
from app.services.progress_service import get_user_progress

router = APIRouter()


@router.get("/", response_model=ProgressRead)
async def progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return await get_user_progress(db, current_user.id)
