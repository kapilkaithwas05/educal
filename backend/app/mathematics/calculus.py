"""Calculus symbolic and numerical computation."""
from typing import Dict, List, Optional, Union

import sympy as sp
from app.mathematics.expression_parser import safe_parse
from app.schemas.math_input import CalculusResult


def compute_derivative(expression: str, variable: str = "x", order: int = 1) -> CalculusResult:
    """Compute n-th derivative symbolically with steps and LaTeX representation."""
    expr = safe_parse(expression)
    var = sp.Symbol(variable)

    steps: List[str] = [
        f"Input Expression: f({variable}) = {sp.latex(expr)}",
        f"Differentiating with respect to {variable} (Order {order})",
    ]

    current = expr
    for step_num in range(1, order + 1):
        deriv = sp.diff(current, var)
        steps.append(f"Step {step_num}: d^{step_num}/d{variable}^{step_num} = {sp.latex(deriv)}")
        current = deriv

    simplified = sp.simplify(current)
    if simplified != current:
        steps.append(f"Simplified form: {sp.latex(simplified)}")

    return CalculusResult(
        result=str(simplified),
        latex=sp.latex(simplified),
        steps=steps,
    )


def compute_integral(
    expression: str,
    variable: str = "x",
    lower: Optional[float] = None,
    upper: Optional[float] = None,
) -> CalculusResult:
    """Compute definite or indefinite integral with steps."""
    expr = safe_parse(expression)
    var = sp.Symbol(variable)

    if lower is not None and upper is not None:
        # Definite integral
        steps = [
            f"Set up definite integral: ∫ from {lower} to {upper} of ({sp.latex(expr)}) d{variable}",
        ]
        antiderivative = sp.integrate(expr, var)
        steps.append(f"Antiderivative F({variable}) = {sp.latex(antiderivative)}")

        f_upper = antiderivative.subs(var, upper)
        f_lower = antiderivative.subs(var, lower)
        definite_val = sp.integrate(expr, (var, lower, upper))
        numeric_val = float(definite_val.evalf()) if definite_val.is_number else None

        steps.append(f"Evaluate at bounds: F({upper}) - F({lower}) = {sp.latex(f_upper)} - ({sp.latex(f_lower)})")
        steps.append(f"Definite Result = {sp.latex(definite_val)}")

        return CalculusResult(
            result=str(definite_val),
            latex=sp.latex(definite_val),
            numeric=numeric_val,
            steps=steps,
        )
    else:
        # Indefinite integral
        indef = sp.integrate(expr, var)
        steps = [
            f"Compute indefinite integral: ∫ ({sp.latex(expr)}) d{variable}",
            f"Antiderivative: {sp.latex(indef)} + C",
        ]
        return CalculusResult(
            result=f"{indef} + C",
            latex=f"{sp.latex(indef)} + C",
            steps=steps,
        )


def compute_limit(expression: str, variable: str = "x", point: Optional[float] = 0.0) -> CalculusResult:
    """Compute limit of an expression as variable approaches point."""
    expr = safe_parse(expression)
    var = sp.Symbol(variable)
    target = point if point is not None else 0.0

    steps = [f"Evaluate limit as {variable} → {target} for f({variable}) = {sp.latex(expr)}"]

    try:
        lim_val = sp.limit(expr, var, target)
        numeric_val = float(lim_val.evalf()) if lim_val.is_number else None
        steps.append(f"Result: {sp.latex(lim_val)}")
        return CalculusResult(
            result=str(lim_val),
            latex=sp.latex(lim_val),
            numeric=numeric_val,
            steps=steps,
        )
    except Exception as exc:
        raise ValueError(f"Limit computation failed: {str(exc)}") from exc


def compute_taylor_series(
    expression: str,
    variable: str = "x",
    point: float = 0.0,
    order: int = 6,
) -> CalculusResult:
    """Compute Taylor / Maclaurin series expansion."""
    expr = safe_parse(expression)
    var = sp.Symbol(variable)

    steps = [
        f"Taylor series expansion of {sp.latex(expr)} around {variable} = {point} up to O({variable}^{order})",
    ]

    series = sp.series(expr, var, point, n=order)
    series_poly = series.removeO()
    steps.append(f"Series approximation: {sp.latex(series_poly)}")

    return CalculusResult(
        result=str(series),
        latex=sp.latex(series),
        steps=steps,
    )
