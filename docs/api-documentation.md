# Educal API Reference

All requests must be prefixed with `/api/v1`. Protected endpoints require an `Authorization: Bearer <TOKEN>` header.

## 1. Authentication & User Profile

- `POST /api/v1/auth/register` — Register a student account (`email`, `full_name`, `password`)
- `POST /api/v1/auth/token` — Obtain OAuth2 JWT access token (`username`, `password`)
- `GET /api/v1/users/me` — Retrieve active authenticated user profile
- `PATCH /api/v1/users/me` — Update user profile information

## 2. Symbolic Calculus

- `POST /api/v1/calculus/derivative` — Compute n-th order symbolic derivative with steps
- `POST /api/v1/calculus/integral` — Compute definite or indefinite integral
- `POST /api/v1/calculus/limit` — Compute limit as variable approaches a target
- `POST /api/v1/calculus/taylor` — Taylor/Maclaurin series expansion

## 3. Matrix & Linear Algebra

- `POST /api/v1/matrices/determinant` — Compute matrix determinant
- `POST /api/v1/matrices/inverse` — Invert non-singular square matrix
- `POST /api/v1/matrices/eigenvalues` — Solve characteristic equation for eigenvalues
- `POST /api/v1/matrices/rank` — Row-reduction rank determination
- `POST /api/v1/matrices/multiply` — Matrix multiplication A × B
- `POST /api/v1/matrices/solve` — Solve linear system Ax = b

## 4. Differential Equations

- `POST /api/v1/odes/solve` — Solve 1st & 2nd order ordinary differential equations

## 5. Numerical Methods

- `POST /api/v1/numerical/bisection` — Bisection root finding with iteration history
- `POST /api/v1/numerical/newton-raphson` — Newton-Raphson tangent line root finding
- `POST /api/v1/numerical/runge-kutta` — Runge-Kutta 4th Order initial value simulation
- `POST /api/v1/numerical/integration` — Simpson's 1/3 rule numerical quadrature

## 6. Statistics & Graphing

- `POST /api/v1/statistics/descriptive` — Sample mean, median, variance, std dev, quartiles
- `POST /api/v1/statistics/regression` — Linear and polynomial regression fitting
- `POST /api/v1/graphing/plot` — Multi-trace 2D curve sampling

## 7. Quizzes & Analytics

- `GET /api/v1/quizzes/` — List all topic quiz assessments
- `GET /api/v1/quizzes/{id}` — Fetch quiz questions
- `POST /api/v1/quizzes/submit` — Submit answers, grade, and record progress
- `GET /api/v1/progress/` — Get student topic mastery scores and streak
- `GET /api/v1/history/` — List persistent calculation history entries
- `DELETE /api/v1/history/{id}` — Delete history record
