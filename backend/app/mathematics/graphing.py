"""Interactive 2D graph trace generation for Plotly.js."""
from typing import Any, Dict, List

import numpy as np
import sympy as sp
from app.mathematics.expression_parser import safe_parse
from app.schemas.math_input import GraphResult

COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]


def generate_plot_data(
    expressions: List[str],
    variable: str = "x",
    x_min: float = -10.0,
    x_max: float = 10.0,
    points: int = 500,
) -> GraphResult:
    if x_min >= x_max:
        raise ValueError(f"x_min ({x_min}) must be strictly less than x_max ({x_max}).")

    var = sp.Symbol(variable)
    x_vals = np.linspace(x_min, x_max, points)
    traces: List[Dict[str, Any]] = []

    for idx, expr_str in enumerate(expressions):
        try:
            expr = safe_parse(expr_str)
            f = sp.lambdify(var, expr, modules=["numpy"])
            y_vals = f(x_vals)

            # Filter out infinite / NaN values for clean rendering
            y_clean = [
                None if (np.isnan(v) or np.isinf(v) or abs(v) > 1e6) else round(float(v), 5)
                for v in np.asarray(y_vals).flatten()
            ]

            traces.append({
                "x": [round(float(x), 4) for x in x_vals],
                "y": y_clean,
                "type": "scatter",
                "mode": "lines",
                "name": f"f({variable}) = {expr_str}",
                "line": {"color": COLORS[idx % len(COLORS)], "width": 2.5},
            })
        except Exception as exc:
            traces.append({
                "x": [],
                "y": [],
                "name": f"Error: {expr_str} ({str(exc)})",
                "error": str(exc),
            })

    layout = {
        "title": "Interactive Function Plotter",
        "xaxis": {"title": variable, "gridcolor": "#334155", "zerolinecolor": "#64748b"},
        "yaxis": {"title": "f(" + variable + ")", "gridcolor": "#334155", "zerolinecolor": "#64748b"},
        "paper_bgcolor": "transparent",
        "plot_bgcolor": "transparent",
        "font": {"color": "#94a3b8"},
        "hovermode": "x unified",
    }

    return GraphResult(traces=traces, layout=layout)
