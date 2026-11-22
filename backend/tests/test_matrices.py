"""Unit and integration tests for Matrices and Linear Algebra."""
import pytest
from app.mathematics.matrices import (
    compute_determinant,
    compute_eigenvalues,
    compute_inverse,
    compute_rank,
    multiply_matrices,
    solve_linear_system,
)


def test_matrix_determinant_2x2():
    A = [[4.0, 2.0], [3.0, 5.0]]
    res = compute_determinant(A)
    assert abs(res.result - 14.0) < 1e-6


def test_matrix_inverse():
    A = [[1.0, 2.0], [3.0, 4.0]]
    res = compute_inverse(A)
    # Inverse of [[1,2],[3,4]] is [[-2, 1], [1.5, -0.5]]
    assert abs(res.result[0][0] - (-2.0)) < 1e-5
    assert abs(res.result[0][1] - 1.0) < 1e-5


def test_matrix_rank():
    A = [[1.0, 2.0], [2.0, 4.0]]
    res = compute_rank(A)
    assert res.result == 1


def test_matrix_multiplication():
    A = [[1.0, 2.0], [3.0, 4.0]]
    B = [[2.0, 0.0], [1.0, 2.0]]
    res = multiply_matrices(A, B)
    # [[1*2+2*1, 1*0+2*2], [3*2+4*1, 3*0+4*2]] = [[4, 4], [10, 8]]
    assert res.result == [[4.0, 4.0], [10.0, 8.0]]


def test_solve_linear_system():
    # 2x + y = 5, x + 3y = 10 -> x = 1, y = 3
    A = [[2.0, 1.0], [1.0, 3.0]]
    b = [5.0, 10.0]
    res = solve_linear_system(A, b)
    assert abs(res.result[0] - 1.0) < 1e-5
    assert abs(res.result[1] - 3.0) < 1e-5


@pytest.mark.asyncio
async def test_matrices_api(client, auth_headers):
    res = await client.post(
        "/api/v1/matrices/determinant",
        json={"matrix_a": [[2.0, 1.0], [1.0, 2.0]]},
        headers=auth_headers,
    )
    assert res.status_code == 200
    assert abs(res.json()["result"] - 3.0) < 1e-5
