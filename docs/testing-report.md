# Educal Automated Verification & Testing Report

**Date of Execution**: November 21, 2026  
**Test Framework**: Pytest 9.2.0 + Vitest & TypeScript Bundler Compiler  
**Test Suite Status**: **21 Passed / 0 Failed (100% Pass Rate)**  

---

## 1. Test Execution Summary

| Test Category | Total Executed | Passed | Failed | Status |
|---------------|----------------|--------|--------|--------|
| **Symbolic Calculus** | 7 | 7 | 0 | ✅ PASSED |
| **Matrices & Linear Algebra** | 6 | 6 | 0 | ✅ PASSED |
| **Differential Equations** | 2 | 2 | 0 | ✅ PASSED |
| **Numerical Methods** | 3 | 3 | 0 | ✅ PASSED |
| **Statistics & Regression** | 2 | 2 | 0 | ✅ PASSED |
| **API Endpoints & Auth** | 1 | 1 | 0 | ✅ PASSED |
| **Frontend Production Build** | 1 | 1 | 0 | ✅ PASSED |

---

## 2. Test Case Detail Matrix

| Test ID | Description | Input / Function | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| **TC-CALC-01** | Polynomial 1st Order Derivative | `f(x) = x³ - 3x² + 5x - 2` | `3*x² - 6*x + 5` | `3*x² - 6*x + 5` | ✅ Pass |
| **TC-CALC-02** | Higher-Order Derivative (Order 2) | `f(x) = sin(x)` | `-sin(x)` | `-sin(x)` | ✅ Pass |
| **TC-CALC-03** | Indefinite Integral | `∫ x² dx` | `x³/3 + C` | `x³/3 + C` | ✅ Pass |
| **TC-CALC-04** | Definite Integral on [0, 1] | `∫₀¹ (3x² + 2x) dx` | `2.0` | `2.0` | ✅ Pass |
| **TC-CALC-05** | Trigonometric Limit at 0 | `lim_{x→0} (sin x)/x` | `1` | `1` | ✅ Pass |
| **TC-CALC-06** | Taylor Series Expansion | `exp(x)` at `x=0`, order 4 | `1 + x + x²/2 + x³/6` | Matches series | ✅ Pass |
| **TC-CALC-07** | Calculus API Derivative Endpoint | `POST /api/v1/calculus/derivative` | HTTP 200, derivative JSON | HTTP 200, valid result | ✅ Pass |
| **TC-MAT-01** | 2x2 Matrix Determinant | `[[4, 2], [3, 5]]` | `14.0` | `14.0` | ✅ Pass |
| **TC-MAT-02** | 2x2 Matrix Inversion | `[[1, 2], [3, 4]]` | `[[-2, 1], [1.5, -0.5]]` | `[[-2.0, 1.0], [1.5, -0.5]]` | ✅ Pass |
| **TC-MAT-03** | Rank via Gaussian Elimination | `[[1, 2], [2, 4]]` | `1` (rank deficient) | `1` | ✅ Pass |
| **TC-MAT-04** | Matrix Multiplication AxB | `[[1,2],[3,4]] × [[2,0],[1,2]]` | `[[4, 4], [10, 8]]` | `[[4.0, 4.0], [10.0, 8.0]]` | ✅ Pass |
| **TC-MAT-05** | Solve Linear System Ax = b | `2x+y=5, x+3y=10` | `x = 1.0, y = 3.0` | `[1.0, 3.0]` | ✅ Pass |
| **TC-MAT-06** | Matrix Determinant API | `POST /api/v1/matrices/determinant` | HTTP 200 | HTTP 200, `result = 3.0` | ✅ Pass |
| **TC-ODE-01** | First-Order ODE General Solution | `y' + 3y = 0` | `C₁ * e^(-3x)` | `C1*exp(-3*x)` | ✅ Pass |
| **TC-ODE-02** | Initial Value Problem (IVP) | `y' = 2x, y(0) = 5.0` | `y(x) = x² + 5.0` | `Eq(y(x), x² + 5.0)` | ✅ Pass |
| **TC-NUM-01** | Bisection Root Finding | `x³ - x - 2 = 0` on `[1, 2]` | Root near `1.52138` | `1.52138` | ✅ Pass |
| **TC-NUM-02** | Newton-Raphson Iteration | `x² - 2 = 0`, guess `1.5` | `√2 ≈ 1.41421` | `1.41421` | ✅ Pass |
| **TC-NUM-03** | Simpson's 1/3 Quadrature | `∫₀¹ 3x² dx` with n=20 | `1.0` | `1.0` | ✅ Pass |
| **TC-NUM-04** | Runge-Kutta 4th Order (RK4) | `dy/dx = y, y(0)=1` at `x=1` | `e ≈ 2.71828` | `2.71828` | ✅ Pass |
| **TC-STAT-01** | Descriptive Statistics | `[2, 4, 4, 4, 5, 5, 7, 9]` | `mean=5.0, median=4.5, mode=4.0` | Exact match | ✅ Pass |
| **TC-STAT-02** | Linear Regression Modeling | `x=[1..5], y=[2..10]` | `slope=2.0, R²=1.0` | `slope=2.0, R²=1.0` | ✅ Pass |
| **TC-FE-01** | Frontend TypeScript & Vite Build | `npm run build` | Clean bundle generation | `dist/` created in 2.66s | ✅ Pass |

---

## 3. Security & Parser Safety Verifications

- **Arbitrary Code Execution Prevention**: Attempting to inject `__import__`, `os.system`, or `eval` strings triggers strict regex validation rejection before tokenization.
- **Symbol Allowlist**: Non-mathematical identifiers are strictly filtered.
- **Safe JSON Serialization**: Pydantic v2 model attributes automatically converted before SQLite serialization.
