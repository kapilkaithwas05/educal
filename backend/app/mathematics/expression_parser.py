"""Safe mathematical expression parsing without eval/exec using SymPy."""
import re
from typing import Set

import sympy as sp
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
    convert_xor,
)

# Whitelist of allowed mathematical symbols and functions
ALLOWED_NAMES = {
    # Variables
    "x", "y", "z", "t", "u", "v", "w", "s", "n", "k", "r", "theta",
    # Constants
    "pi", "E", "e", "I", "oo",
    # Functions
    "sin", "cos", "tan", "sec", "csc", "cot",
    "asin", "acos", "atan", "asec", "acsc", "acot",
    "sinh", "cosh", "tanh", "coth", "sech", "csch",
    "asinh", "acosh", "atanh",
    "exp", "log", "ln", "log10", "log2", "sqrt", "cbrt", "Abs", "abs",
    "factorial", "gamma", "erf", "sign", "sinc",
}

DISALLOWED_PATTERN = re.compile(
    r"\b(__|import|exec|eval|open|system|subprocess|globals|locals|getattr|setattr|builtins|os|sys|shutil)\b"
)


def safe_parse(expr_str: str) -> sp.Expr:
    """Parse a mathematical expression safely using SymPy."""
    if not expr_str or not expr_str.strip():
        raise ValueError("Expression cannot be empty.")

    cleaned = expr_str.strip()
    if DISALLOWED_PATTERN.search(cleaned):
        raise ValueError("Expression contains unauthorized functions or keywords.")

    try:
        # Pre-process: replace ^ with ** for safety if convert_xor isn't enough
        cleaned = cleaned.replace("^", "**")
        expr = parse_expr(cleaned, transformations=TRANSFORMATIONS, evaluate=False)

        # Validate that all symbols used are within allowed list
        used_symbols: Set[str] = {str(s) for s in expr.free_symbols}
        unknown = used_symbols - ALLOWED_NAMES
        if unknown:
            raise ValueError(f"Unknown or unauthorized variables: {', '.join(unknown)}")

        return expr
    except Exception as exc:
        if isinstance(exc, ValueError):
            raise
        raise ValueError(f"Could not parse mathematical expression: {str(exc)}") from exc
