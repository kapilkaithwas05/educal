"""Calculation history service."""
from typing import Any, Dict, List, Optional

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.calculation_history import CalculationHistory
from app.models.progress import Progress


def _to_json_compatible(data: Any) -> Any:
    if hasattr(data, "model_dump"):
        return data.model_dump()
    if hasattr(data, "dict"):
        return data.dict()
    if isinstance(data, dict):
        return {k: _to_json_compatible(v) for k, v in data.items()}
    if isinstance(data, (list, tuple)):
        return [_to_json_compatible(v) for v in data]
    return data


async def save_calculation(
    db: AsyncSession,
    user_id: int,
    operation: str,
    input_data: Any,
    result_data: Any,
    topic: str = "general",
) -> CalculationHistory:
    clean_input = _to_json_compatible(input_data)
    clean_result = _to_json_compatible(result_data)

    history_entry = CalculationHistory(
        user_id=user_id,
        topic=topic,
        operation=operation,
        input_data=clean_input,
        result_data=clean_result,
    )
    db.add(history_entry)

    # Increment calculations_done in Progress
    prog_res = await db.execute(select(Progress).where(Progress.user_id == user_id))
    prog = prog_res.scalars().first()
    if prog:
        prog.calculations_done += 1

    await db.commit()
    await db.refresh(history_entry)
    return history_entry


async def get_user_history(
    db: AsyncSession,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    topic: Optional[str] = None,
) -> List[CalculationHistory]:
    stmt = select(CalculationHistory).where(CalculationHistory.user_id == user_id)
    if topic:
        stmt = stmt.where(CalculationHistory.topic == topic)
    stmt = stmt.order_by(CalculationHistory.created_at.desc()).offset(skip).limit(limit)
    res = await db.execute(stmt)
    return list(res.scalars().all())


async def delete_history_entry(db: AsyncSession, user_id: int, entry_id: int) -> None:
    await db.execute(
        delete(CalculationHistory).where(
            CalculationHistory.id == entry_id,
            CalculationHistory.user_id == user_id,
        )
    )
    await db.commit()
