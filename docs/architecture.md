# Educal System Architecture

Educal is designed as an educational platform with a clean separation of concerns:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interface (Browser)                        │
│   React 18 + TypeScript + Vite + Tailwind CSS + KaTeX + Plotly.js      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / JSON + JWT
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend (Python)                        │
│   Auth / JWT Middleware │ Pydantic Validation │ Endpoint Routers       │
└───────────────┬────────────────────────────────────────┬───────────────┘
                │                                        │
                ▼                                        ▼
┌───────────────────────────────┐        ┌───────────────────────────────┐
│     Database / Persistence    │        │  Mathematical Engine Layer   │
│   SQLite (Dev) / Postgres     │        │   SymPy (Symbolic)            │
│   SQLAlchemy 2.0 Async        │        │   NumPy / SciPy (Numerical)   │
│   User, Quiz, Progress, Hist  │        │   Safe AST Expression Parser  │
└───────────────────────────────┘        └───────────────────────────────┘
```

## Architectural Layers

1. **Frontend Client Layer**: Single Page Application (SPA) powered by React, TypeScript, and Vite. Utilizes Tailwind CSS for responsive dark-mode UI, KaTeX for mathematical rendering, and Plotly/SVG for interactive graph curves.
2. **REST API & Security Layer**: FastAPI application providing token-based authentication via OAuth2 Bearer JWT. Centralized exception handling, CORS configuration, and Pydantic v2 schemas for all payload validation.
3. **Mathematical Computation Engine**: Decoupled Python computation module (`app.mathematics`) isolating symbolic manipulations from database concerns. Uses SymPy for exact algebra, derivatives, integrals, and limits, and NumPy/SciPy for numerical algorithms.
4. **Data Persistence**: Asynchronous SQLAlchemy 2.0 ORM with `aiosqlite` for development and native compatibility with PostgreSQL via `asyncpg`.
