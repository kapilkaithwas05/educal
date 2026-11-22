"""Math input/output Pydantic schemas used by all calculator endpoints."""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# ── Calculus ──────────────────────────────────────────────────────────────────

class CalculusInput(BaseModel):
    expression: str
    variable: str = "x"
    order: Optional[int] = 1
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    point: Optional[float] = None


class CalculusResult(BaseModel):
    result: str
    latex: Optional[str] = None
    numeric: Optional[float] = None
    steps: Optional[List[str]] = None


# ── Matrices ──────────────────────────────────────────────────────────────────

class MatrixInput(BaseModel):
    matrix_a: List[List[float]]
    matrix_b: Optional[List[List[float]]] = None
    vector_b: Optional[List[float]] = None


class MatrixResult(BaseModel):
    result: Any
    latex: Optional[str] = None
    steps: Optional[List[str]] = None


# ── Differential Equations ────────────────────────────────────────────────────

class ODEInput(BaseModel):
    equation: str                      # e.g. "y'' + y = 0"
    variable: str = "x"
    function: str = "y"
    initial_conditions: Optional[Dict[str, float]] = None


class ODEResult(BaseModel):
    result: str
    latex: Optional[str] = None
    general_solution: Optional[str] = None
    particular_solution: Optional[str] = None


# ── Numerical Methods ─────────────────────────────────────────────────────────

class NumericalInput(BaseModel):
    expression: str
    variable: str = "x"
    a: Optional[float] = None
    b: Optional[float] = None
    tolerance: float = 1e-7
    max_iterations: int = 100
    h: Optional[float] = None
    n: Optional[int] = None
    initial_guess: Optional[float] = None
    y0: Optional[float] = None


class NumericalResult(BaseModel):
    result: Any
    iterations: Optional[int] = None
    converged: Optional[bool] = None
    error: Optional[float] = None
    steps: Optional[List[Dict[str, Any]]] = None


# ── Statistics ────────────────────────────────────────────────────────────────

class StatisticsInput(BaseModel):
    data: Optional[List[float]] = None
    x_data: Optional[List[float]] = None
    y_data: Optional[List[float]] = None
    regression_type: Optional[str] = "linear"


class StatisticsResult(BaseModel):
    result: Dict[str, Any]
    plot_data: Optional[Dict[str, Any]] = None


# ── Graphing ──────────────────────────────────────────────────────────────────

class GraphInput(BaseModel):
    expressions: List[str]
    variable: str = "x"
    x_min: float = -10.0
    x_max: float = 10.0
    points: int = 500


class GraphResult(BaseModel):
    traces: List[Dict[str, Any]]
    layout: Dict[str, Any]
