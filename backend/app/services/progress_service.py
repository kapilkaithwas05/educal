"""User progress service."""
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.progress import Progress


async def get_user_progress(db: AsyncSession, user_id: int) -> Progress:
    res = await db.execute(select(Progress).where(Progress.user_id == user_id))
    progress = res.scalars().first()
    if not progress:
        progress = Progress(
            user_id=user_id,
            topic_scores={},
            quizzes_completed=0,
            calculations_done=0,
            streak_days=1,
            last_active=datetime.now(timezone.utc),
        )
        db.add(progress)
        await db.commit()
        await db.refresh(progress)
    return progress
