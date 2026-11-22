"""Numerical methods algorithms: Bisection, Newton-Raphson, RK4, Quadrature."""
import math
from typing import Any, Dict, List, Optional

import numpy as np
import sympy as sp
from app.mathematics.expression_parser import safe_parse
from app.schemas.math_input import NumericalResult


def bisection_method(
    expression: str,
    variable: str = "x",
    a: Optional[float] = None,
    b: Optional[float] = None,
    tolerance: float = 1e-7,
    max_iter: int = 100,
) -> NumericalResult:
    if a is None or b is None:
        raise ValueError("Interval [a, b] is required for the Bisection method.")

    expr = safe_parse(expression)
    var = sp.Symbol(variable)
    f = sp.lambdify(var, expr, "numpy")

    fa, fb = float(f(a)), float(f(b))
    if fa * fb > 0:
        raise ValueError(
            f"f(a) and f(b) must have opposite signs. Found f({a}) = {fa:.4f}, f({b}) = {fb:.4f}."
        )

    steps: List[Dict[str, Any]] = []
    c = a
    for i in range(1, max_iter + 1):
        c = (a + b) / 2.0
        fc = float(f(c))
        err = abs(b - a) / 2.0

        steps.append({
            "iteration": i,
            "a": round(a, 6),
            "b": round(b, 6),
            "c_mid": round(c, 6),
            "f_c": round(fc, 6),
            "error": round(err, 8),
        })

        if abs(fc) < 1e-12 or err < tolerance:
            return NumericalResult(
                result=round(c, 7),
                iterations=i,
                converged=True,
                error=err,
                steps=steps,
            )

        if fa * fc < 0:
            b = c
            fb = fc
        else:
            a = c
            fa = fc

    return NumericalResult(
        result=round(c, 7),
        iterations=max_iter,
        converged=False,
        error=abs(b - a) / 2.0,
        steps=steps,
    )


def newton_raphson(
    expression: str,
    variable: str = "x",
    initial_guess: Optional[float] = None,
    tolerance: float = 1e-7,
    max_iter: int = 100,
) -> NumericalResult:
    if initial_guess is None:
        initial_guess = 1.0

    expr = safe_parse(expression)
    var = sp.Symbol(variable)
    deriv = sp.diff(expr, var)

    f = sp.lambdify(var, expr, "numpy")
    df = sp.lambdify(var, deriv, "numpy")

    x_n = float(initial_guess)
    steps: List[Dict[str, Any]] = []

    for i in range(1, max_iter + 1):
        fx = float(f(x_n))
        dfx = float(df(x_n))

        if abs(dfx) < 1e-14:
            raise ValueError(f"Derivative near zero at x = {x_n}. Newton-Raphson failed to converge.")

        x_next = x_n - (fx / dfx)
        err = abs(x_next - x_n)

        steps.append({
            "iteration": i,
            "x_n": round(x_n, 7),
            "f_xn": round(fx, 7),
            "df_xn": round(dfx, 7),
            "x_next": round(x_next, 7),
            "error": round(err, 9),
        })

        if err < tolerance or abs(fx) < 1e-12:
            return NumericalResult(
                result=round(x_next, 7),
                iterations=i,
                converged=True,
                error=err,
                steps=steps,
            )

        x_n = x_next

    return NumericalResult(
        result=round(x_n, 7),
        iterations=max_iter,
        converged=False,
        error=err,
        steps=steps,
    )


def runge_kutta_4(
    expression: str,
    variable: str = "x",
    a: Optional[float] = 0.0,
    b: Optional[float] = 1.0,
    h: Optional[float] = 0.1,
    y0: Optional[float] = 1.0,
) -> NumericalResult:
    """Solve initial value ODE y' = f(x, y) using RK4."""
    x_val = a if a is not None else 0.0
    x_end = b if b is not None else 1.0
    step_h = h if h is not None else 0.1
    y_val = y0 if y0 is not None else 1.0

    x_sym, y_sym = sp.Symbol("x"), sp.Symbol("y")
    expr = safe_parse(expression)
    f = sp.lambdify((x_sym, y_sym), expr, "numpy")

    trajectory: List[Dict[str, Any]] = [{"x": round(x_val, 4), "y": round(y_val, 6)}]
    steps_count = int(math.ceil((x_end - x_val) / step_h))

    for _ in range(steps_count):
        k1 = float(f(x_val, y_val))
        k2 = float(f(x_val + 0.5 * step_h, y_val + 0.5 * step_h * k1))
        k3 = float(f(x_val + 0.5 * step_h, y_val + 0.5 * step_h * k2))
        k4 = float(f(x_val + step_h, y_val + step_h * k3))

        y_val = y_val + (step_h / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)
        x_val = x_val + step_h
        trajectory.append({"x": round(x_val, 4), "y": round(y_val, 6)})

    return NumericalResult(
        result={"final_y": round(y_val, 6), "trajectory": trajectory},
        iterations=len(trajectory),
        converged=True,
    )


def numerical_integration(
    expression: str,
    variable: str = "x",
    a: Optional[float] = 0.0,
    b: Optional[float] = 1.0,
    n: Optional[int] = 100,
) -> NumericalResult:
    """Numerical quadrature using Simpson's Rule."""
    x_start = a if a is not None else 0.0
    x_end = b if b is not None else 1.0
    num_intervals = (n if n is not None else 100)
    if num_intervals % 2 != 0:
        num_intervals += 1

    expr = safe_parse(expression)
    var = sp.Symbol(variable)
    f = sp.lambdify(var, expr, "numpy")

    h = (x_end - x_start) / num_intervals
    x_pts = np.linspace(x_start, x_end, num_intervals + 1)
    y_pts = f(x_pts)

    integral = (h / 3.0) * (y_pts[0] + y_pts[-1] + 4 * np.sum(y_pts[1:-1:2]) + 2 * np.sum(y_pts[2:-1:2]))

    return NumericalResult(
        result=float(round(integral, 7)),
        iterations=num_intervals,
        converged=True,
    )
