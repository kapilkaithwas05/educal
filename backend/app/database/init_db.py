"""Database initialization and initial seed data."""
from sqlalchemy import select

from app.core.security import get_password_hash
from app.database.base import Base
from app.database.session import async_session_factory, engine
from app.models.calculation_history import CalculationHistory  # noqa: F401
from app.models.progress import Progress  # noqa: F401
from app.models.quiz import Question, Quiz  # noqa: F401
from app.models.user import User


async def init_db() -> None:
    """Create all tables and seed sample data if not already present."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        # Seed demo user if no users exist
        user_res = await session.execute(select(User).limit(1))
        if not user_res.scalars().first():
            demo_user = User(
                email="student@educal.edu",
                full_name="Alex Rivera",
                hashed_password=get_password_hash("Educal2026!"),
                is_active=True,
                is_superuser=False,
            )
            session.add(demo_user)
            await session.flush()

            demo_progress = Progress(
                user_id=demo_user.id,
                topic_scores={"Calculus": 85.0, "Matrices": 90.0, "ODEs": 75.0, "Numerical": 80.0, "Statistics": 95.0},
                quizzes_completed=5,
                calculations_done=18,
                streak_days=3,
            )
            session.add(demo_progress)

        # Seed quizzes if none exist
        quiz_res = await session.execute(select(Quiz).limit(1))
        if not quiz_res.scalars().first():
            quizzes_data = [
                {
                    "title": "Calculus Fundamentals",
                    "topic": "calculus",
                    "difficulty": "medium",
                    "description": "Test your mastery of derivatives, integrals, and limits.",
                    "questions": [
                        {
                            "text": "What is the derivative of f(x) = x³ - 3x² + 5x - 7 with respect to x?",
                            "options": ["3x² - 6x + 5", "x² - 3x + 5", "3x² - 6x", "3x³ - 6x² + 5"],
                            "correct_index": 0,
                            "explanation": "Applying power rule: d/dx(x³) = 3x², d/dx(-3x²) = -6x, d/dx(5x) = 5.",
                            "points": 1,
                        },
                        {
                            "text": "Evaluate the definite integral ∫ from 0 to 1 of (3x² + 2x) dx.",
                            "options": ["1", "2", "3", "0.5"],
                            "correct_index": 1,
                            "explanation": "[x³ + x²] from 0 to 1 = (1 + 1) - (0) = 2.",
                            "points": 1,
                        },
                        {
                            "text": "What is the limit of (sin x)/x as x approaches 0?",
                            "options": ["0", "1", "Undefined", "Infinity"],
                            "correct_index": 1,
                            "explanation": "Standard trigonometric limit: lim(x->0) sin(x)/x = 1.",
                            "points": 1,
                        },
                    ],
                },
                {
                    "title": "Linear Algebra & Matrix Operations",
                    "topic": "matrices",
                    "difficulty": "medium",
                    "description": "Evaluate determinants, eigenvalues, and linear system solutions.",
                    "questions": [
                        {
                            "text": "What is the determinant of the 2x2 matrix [[4, 2], [3, 5]]?",
                            "options": ["14", "26", "20", "6"],
                            "correct_index": 0,
                            "explanation": "det(A) = ad - bc = (4)(5) - (2)(3) = 20 - 6 = 14.",
                            "points": 1,
                        },
                        {
                            "text": "If a square matrix A has det(A) = 0, which of the following is TRUE?",
                            "options": ["A has full rank", "A is invertible", "A is singular (non-invertible)", "A has no eigenvalues"],
                            "correct_index": 2,
                            "explanation": "A matrix with zero determinant is singular and does not have a multiplicative inverse.",
                            "points": 1,
                        },
                    ],
                },
                {
                    "title": "Ordinary Differential Equations",
                    "topic": "differential_equations",
                    "difficulty": "medium",
                    "description": "First-order ODEs, integrating factors, and Euler's method.",
                    "questions": [
                        {
                            "text": "What is the general solution of dy/dx = 3y?",
                            "options": ["y = C * e^(3x)", "y = 3x + C", "y = C * ln(3x)", "y = e^(x/3) + C"],
                            "correct_index": 0,
                            "explanation": "Separable ODE: dy/y = 3 dx => ln|y| = 3x + C => y = C * e^(3x).",
                            "points": 1,
                        },
                        {
                            "text": "What order of local truncation error does the standard RK4 (Runge-Kutta 4th Order) method have?",
                            "options": ["O(h)", "O(h²)", "O(h⁴)", "O(h⁵)"],
                            "correct_index": 3,
                            "explanation": "Local truncation error of RK4 is O(h⁵), giving global error O(h⁴).",
                            "points": 1,
                        },
                    ],
                },
                {
                    "title": "Numerical Methods & Root Finding",
                    "topic": "numerical_methods",
                    "difficulty": "hard",
                    "description": "Bisection, Newton-Raphson, and numerical quadrature algorithms.",
                    "questions": [
                        {
                            "text": "The Newton-Raphson iteration formula for finding roots of f(x)=0 is:",
                            "options": ["x_{n+1} = x_n - f(x_n)/f'(x_n)", "x_{n+1} = x_n + f(x_n)/f'(x_n)", "x_{n+1} = f'(x_n)/f(x_n)", "x_{n+1} = (x_n + x_{n-1})/2"],
                            "correct_index": 0,
                            "explanation": "Newton-Raphson uses tangent line linear approximation: x_{n+1} = x_n - f(x_n)/f'(x_n).",
                            "points": 1,
                        },
                        {
                            "text": "What is the order of convergence of the Newton-Raphson method for a simple root?",
                            "options": ["1 (Linear)", "1.618 (Superlinear)", "2 (Quadratic)", "3 (Cubic)"],
                            "correct_index": 2,
                            "explanation": "Newton-Raphson exhibits quadratic convergence (order 2) near simple roots.",
                            "points": 1,
                        },
                    ],
                },
                {
                    "title": "Engineering Probability & Statistics",
                    "topic": "statistics",
                    "difficulty": "easy",
                    "description": "Descriptive statistics, variance, standard deviation, and regression.",
                    "questions": [
                        {
                            "text": "For the dataset [2, 4, 4, 4, 5, 5, 7, 9], what is the mean?",
                            "options": ["4", "5", "4.5", "5.5"],
                            "correct_index": 1,
                            "explanation": "Sum = 35 + 5 = 40. Mean = 40 / 8 = 5.0.",
                            "points": 1,
                        },
                        {
                            "text": "The sample variance s² is divided by (n - 1) rather than n to achieve:",
                            "options": ["Smaller value", "Bessel's correction for an unbiased estimator", "Normal distribution fit", "Standardized scale"],
                            "correct_index": 1,
                            "explanation": "Bessel's correction (dividing by n - 1) makes sample variance an unbiased estimator of population variance.",
                            "points": 1,
                        },
                    ],
                },
            ]

            for q_data in quizzes_data:
                quiz = Quiz(
                    title=q_data["title"],
                    topic=q_data["topic"],
                    difficulty=q_data["difficulty"],
                    description=q_data["description"],
                )
                session.add(quiz)
                await session.flush()

                for item in q_data["questions"]:
                    question = Question(
                        quiz_id=quiz.id,
                        text=item["text"],
                        options=item["options"],
                        correct_index=item["correct_index"],
                        explanation=item["explanation"],
                        points=item.get("points", 1),
                    )
                    session.add(question)

        await session.commit()
