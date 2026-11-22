"""Matrix and Linear Algebra computations using NumPy and SymPy."""
from typing import Any, List, Optional

import numpy as np
import sympy as sp
from app.schemas.math_input import MatrixResult


def compute_determinant(matrix_a: List[List[float]]) -> MatrixResult:
    A = sp.Matrix(matrix_a)
    if A.rows != A.cols:
        raise ValueError("Determinant requires a square matrix.")

    det_val = A.det()
    steps = [
        f"Matrix dimensions: {A.rows} × {A.cols}",
        f"det(A) calculation in progress...",
        f"Result: det(A) = {det_val}",
    ]
    return MatrixResult(
        result=float(det_val) if det_val.is_number else str(det_val),
        latex=f"\\det(A) = {sp.latex(det_val)}",
        steps=steps,
    )


def compute_inverse(matrix_a: List[List[float]]) -> MatrixResult:
    A = sp.Matrix(matrix_a)
    if A.rows != A.cols:
        raise ValueError("Inverse requires a square matrix.")

    det_val = A.det()
    if det_val == 0:
        raise ValueError("Matrix is singular (determinant is 0) and cannot be inverted.")

    inv_matrix = A.inv()
    steps = [
        f"1. Verified det(A) = {det_val} ≠ 0",
        "2. Computed adjugate and scaled by 1/det(A)",
        f"3. Resulting inverse: {sp.latex(inv_matrix)}",
    ]
    return MatrixResult(
        result=[[float(cell) for cell in row] for row in inv_matrix.tolist()],
        latex=sp.latex(inv_matrix),
        steps=steps,
    )


def compute_eigenvalues(matrix_a: List[List[float]]) -> MatrixResult:
    A = sp.Matrix(matrix_a)
    if A.rows != A.cols:
        raise ValueError("Eigenvalue computation requires a square matrix.")

    eigenvals = A.eigenvals()
    steps = [
        "1. Set up characteristic polynomial: det(A - λI) = 0",
        f"2. Characteristic polynomial roots: {', '.join([f'λ = {sp.latex(k)} (mult {v})' for k, v in eigenvals.items()])}",
    ]
    result_list = [{"value": str(k), "multiplicity": v} for k, v in eigenvals.items()]
    return MatrixResult(
        result=result_list,
        latex=", \\quad ".join([f"\\lambda = {sp.latex(k)}" for k in eigenvals.keys()]),
        steps=steps,
    )


def compute_rank(matrix_a: List[List[float]]) -> MatrixResult:
    A = sp.Matrix(matrix_a)
    rank_val = A.rank()
    steps = [
        f"Matrix dimensions: {A.rows} × {A.cols}",
        "Reduced to row-echelon form via Gaussian elimination",
        f"Count of non-zero rows = Rank: {rank_val}",
    ]
    return MatrixResult(
        result=rank_val,
        latex=f"\\text{{rank}}(A) = {rank_val}",
        steps=steps,
    )


def multiply_matrices(matrix_a: List[List[float]], matrix_b: Optional[List[List[float]]]) -> MatrixResult:
    if not matrix_b:
        raise ValueError("Matrix B is required for multiplication.")

    A = sp.Matrix(matrix_a)
    B = sp.Matrix(matrix_b)

    if A.cols != B.rows:
        raise ValueError(
            f"Inner matrix dimensions must match: Matrix A ({A.rows}×{A.cols}) cannot be multiplied by Matrix B ({B.rows}×{B.cols})."
        )

    C = A * B
    steps = [
        f"Matrix A: {A.rows}×{A.cols}, Matrix B: {B.rows}×{B.cols}",
        f"Resulting dimension: {C.rows}×{C.cols}",
        f"Product: {sp.latex(C)}",
    ]
    return MatrixResult(
        result=[[float(cell) for cell in row] for row in C.tolist()],
        latex=sp.latex(C),
        steps=steps,
    )


def solve_linear_system(matrix_a: List[List[float]], vector_b: Optional[List[float]]) -> MatrixResult:
    if not vector_b:
        raise ValueError("Vector b is required to solve Ax = b.")

    A = sp.Matrix(matrix_a)
    b = sp.Matrix(vector_b)

    if A.rows != len(vector_b):
        raise ValueError(f"Number of equations ({A.rows}) must match length of vector b ({len(vector_b)}).")

    solution = A.LUsolve(b) if A.rows == A.cols and A.det() != 0 else A.solve(b)
    sol_list = [float(val) for val in solution]
    steps = [
        f"Augmented matrix [A|b] formed ({A.rows} equations in {A.cols} variables)",
        "Applied Gaussian elimination / LU decomposition",
        f"Solution vector x = {sp.latex(solution)}",
    ]
    return MatrixResult(
        result=sol_list,
        latex=sp.latex(solution),
        steps=steps,
    )
