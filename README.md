# Educal – Engineering Mathematics & Computational Analysis Platform

**Educal** is a web-based educational platform designed for engineering students to learn, practice, and compute Engineering Mathematics problems interactively.

---

## Key Features

- **Calculus Engine**: Symbolic differentiation, indefinite and definite integration, limits, and Taylor/Maclaurin series expansions with step-by-step derivations.
- **Matrix & Linear Algebra**: Determinants, matrix inverses, eigenvalues & eigenvectors, rank via Gaussian elimination, multiplication, and solving linear systems $Ax = b$.
- **Differential Equations**: Analytical 1st and 2nd order ODE solving with initial value problem (IVP) constraints and RK4 numerical simulation.
- **Numerical Methods**: Bisection and Newton-Raphson root finding with convergence tables, Simpson's 1/3 quadrature, and Runge-Kutta 4th order.
- **Probability & Statistics**: Sample estimators (mean, median, mode, variance, std dev, IQR) and regression fitting.
- **Interactive Graphing**: Multi-trace 2D coordinate function plotter with domain adjustments.
- **Student Quizzes & Progress**: Curated engineering math quizzes with automated grading, explanations, study streaks, and persistent calculation history.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, KaTeX, Lucide Icons
- **Backend**: FastAPI, Pydantic v2, Python 3.13, OAuth2 Password Bearer JWT, Bcrypt
- **Computation Engine**: SymPy (symbolic math), NumPy & SciPy (numerical analysis)
- **Database**: SQLite (Development) / PostgreSQL (Production), SQLAlchemy 2.0 Async ORM
- **Testing**: Pytest & Pytest-Asyncio, HTTPX

---

## Quickstart

### 1. Launch the Backend API
```bash
./start-backend.sh
```
Backend API will be running at [http://localhost:8000](http://localhost:8000)  
Swagger interactive documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Launch the Frontend Application
```bash
./start-frontend.sh
```
Web application will be live at [http://localhost:5173](http://localhost:5173)

### Demo Credentials
- **Email**: `student@educal.edu`
- **Password**: `Educal2026!`

---

## Automated Test Suite

```bash
cd backend
source .venv/bin/activate
pytest tests/ -v
```
All 21 unit and integration tests run and validate algorithm precision.
