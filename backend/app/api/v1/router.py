"""API v1 router – aggregates all endpoint routers."""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    calculus,
    matrices,
    differential_equations,
    numerical_methods,
    statistics,
    graphing,
    quizzes,
    history,
    progress,
)

api_router = APIRouter()

api_router.include_router(auth.router,                   prefix="/auth",   tags=["Authentication"])
api_router.include_router(users.router,                  prefix="/users",  tags=["Users"])
api_router.include_router(calculus.router,               prefix="/calculus", tags=["Calculus"])
api_router.include_router(matrices.router,               prefix="/matrices", tags=["Matrices"])
api_router.include_router(differential_equations.router, prefix="/odes",   tags=["Differential Equations"])
api_router.include_router(numerical_methods.router,      prefix="/numerical", tags=["Numerical Methods"])
api_router.include_router(statistics.router,             prefix="/statistics", tags=["Statistics"])
api_router.include_router(graphing.router,               prefix="/graphing", tags=["Graphing"])
api_router.include_router(quizzes.router,                prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(history.router,                prefix="/history", tags=["History"])
api_router.include_router(progress.router,               prefix="/progress", tags=["Progress"])
