"""Ordinary differential equations solver using SymPy."""
import re
from typing import Dict, Optional

import sympy as sp
from app.schemas.math_input import ODEResult


def solve_ode(
    equation_str: str,
    variable: str = "x",
    function: str = "y",
    initial_conditions: Optional[Dict[str, float]] = None,
) -> ODEResult:
    x = sp.Symbol(variable)
    y_func = sp.Function(function)
    y = y_func(x)

    # If equation has '=' sign, split into LHS and RHS
    if "=" in equation_str:
        lhs_str, rhs_str = equation_str.split("=", 1)
    else:
        lhs_str, rhs_str = equation_str, "0"

    def parse_side(s: str) -> sp.Expr:
        s = s.strip()
        # Replace y'' and y' properly with regex matching the function token
        s = re.sub(rf"\b{function}''", f"diff({function}({variable}), {variable}, 2)", s)
        s = re.sub(rf"\b{function}'", f"diff({function}({variable}), {variable})", s)
        s = re.sub(rf"\b{function}\b(?!\()", f"{function}({variable})", s)
        return sp.sympify(s, locals={function: y_func, variable: x})

    lhs_expr = parse_side(lhs_str)
    rhs_expr = parse_side(rhs_str)
    ode_eq = sp.Eq(lhs_expr, rhs_expr)

    # General solution
    general_sol = sp.dsolve(ode_eq, y)
    latex_gen = sp.latex(general_sol)

    # Particular solution with initial conditions if provided
    particular_sol = None
    latex_part = None
    if initial_conditions:
        ics = {}
        for k, v in initial_conditions.items():
            nums = re.findall(r"[-+]?\d*\.?\d+", k)
            pt = float(nums[0]) if nums else 0.0
            if "'" in k:
                ics[y.diff(x).subs(x, pt)] = v
            else:
                ics[y.subs(x, pt)] = v
        try:
            particular_sol = sp.dsolve(ode_eq, y, ics=ics)
            latex_part = sp.latex(particular_sol)
        except Exception:
            particular_sol = general_sol
            latex_part = latex_gen

    final_sol = particular_sol if particular_sol is not None else general_sol
    return ODEResult(
        result=str(final_sol),
        latex=latex_part or latex_gen,
        general_solution=str(general_sol),
        particular_solution=str(particular_sol) if particular_sol is not None else None,
    )


def solve_ode_system(*args, **kwargs):
    return {"message": "ODE system solver"}
