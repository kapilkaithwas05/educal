"""Unit and integration tests for Differential Equations & Numerical Methods."""
import pytest
from app.mathematics.differential_equations import solve_ode
from app.mathematics.numerical_methods import (
    bisection_method,
    newton_raphson,
    numerical_integration,
    runge_kutta_4,
)
from app.mathematics.statistics import compute_descriptive_stats, compute_regression


def test_ode_first_order():
    res = solve_ode("y' + 3*y = 0", variable="x", function="y")
    assert "exp(-3*x)" in res.result.replace(" ", "")


def test_ode_initial_value():
    res = solve_ode("y' = 2*x", variable="x", function="y", initial_conditions={"y(0)": 5.0})
    assert res.particular_solution is not None
    assert "x**2+5" in res.result.replace(" ", "") or "x**2+5.0" in res.result.replace(" ", "")


def test_bisection_root_finding():
    # f(x) = x³ - x - 2, root near 1.52138
    res = bisection_method("x**3 - x - 2", variable="x", a=1.0, b=2.0, tolerance=1e-5)
    assert res.converged is True
    assert abs(res.result - 1.52138) < 1e-3


def test_newton_raphson_root_finding():
    # f(x) = x² - 2, root sqrt(2) ≈ 1.41421356
    res = newton_raphson("x**2 - 2", variable="x", initial_guess=1.5, tolerance=1e-6)
    assert res.converged is True
    assert abs(res.result - 1.41421356) < 1e-5


def test_simpsons_quadrature():
    # ∫ from 0 to 1 of 3x² dx = 1.0
    res = numerical_integration("3*x**2", variable="x", a=0.0, b=1.0, n=20)
    assert abs(res.result - 1.0) < 1e-5


def test_runge_kutta_4():
    # dy/dx = y, y(0) = 1 => y(1) = e ≈ 2.71828
    res = runge_kutta_4("y", variable="x", a=0.0, b=1.0, h=0.05, y0=1.0)
    final_y = res.result["final_y"]
    assert abs(final_y - 2.71828) < 1e-3


def test_statistics_descriptive():
    data = [2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]
    res = compute_descriptive_stats(data)
    assert res.result["count"] == 8
    assert abs(res.result["mean"] - 5.0) < 1e-5
    assert abs(res.result["median"] - 4.5) < 1e-5
    assert abs(res.result["mode"] - 4.0) < 1e-5


def test_statistics_regression():
    xs = [1.0, 2.0, 3.0, 4.0, 5.0]
    ys = [2.0, 4.0, 6.0, 8.0, 10.0]
    res = compute_regression(xs, ys, "linear")
    assert abs(res.result["slope"] - 2.0) < 1e-5
    assert abs(res.result["r_squared"] - 1.0) < 1e-5
