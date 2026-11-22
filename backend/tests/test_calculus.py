"""Unit and integration tests for the Calculus engine."""
import pytest
from app.mathematics.calculus import (
    compute_derivative,
    compute_integral,
    compute_limit,
    compute_taylor_series,
)


def test_polynomial_derivative():
    res = compute_derivative("x**3 - 3*x**2 + 5*x - 2", "x", 1)
    assert res.result is not None
    assert "3*x**2 - 6*x + 5" in res.result
    assert len(res.steps) >= 2


def test_higher_order_derivative():
    res = compute_derivative("sin(x)", "x", 2)
    assert "-sin(x)" in res.result
    assert len(res.steps) >= 3


def test_indefinite_integral():
    res = compute_integral("x**2", "x")
    assert "x**3/3" in res.result.replace(" ", "")
    assert "+ C" in res.result


def test_definite_integral():
    res = compute_integral("3*x**2 + 2*x", "x", 0.0, 1.0)
    assert res.numeric is not None
    assert abs(res.numeric - 2.0) < 1e-5


def test_trigonometric_limit():
    res = compute_limit("sin(x)/x", "x", 0.0)
    assert res.result == "1"
    assert res.numeric == 1.0


def test_taylor_series_expansion():
    res = compute_taylor_series("exp(x)", "x", 0.0, 4)
    assert "x**2/2" in res.result.replace(" ", "")
    assert "x**3/6" in res.result.replace(" ", "")


@pytest.mark.asyncio
async def test_calculus_api_endpoints(client, auth_headers):
    # Test derivative endpoint
    d_res = await client.post(
        "/api/v1/calculus/derivative",
        json={"expression": "x**4 - 4*x", "variable": "x", "order": 1},
        headers=auth_headers,
    )
    assert d_res.status_code == 200
    assert "4*x**3 - 4" in d_res.json()["result"]

    # Test integral endpoint
    i_res = await client.post(
        "/api/v1/calculus/integral",
        json={"expression": "x**3", "variable": "x", "lower_bound": 0.0, "upper_bound": 2.0},
        headers=auth_headers,
    )
    assert i_res.status_code == 200
    assert abs(i_res.json()["numeric"] - 4.0) < 1e-4
