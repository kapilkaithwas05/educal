"""Statistics and Regression calculations."""
from typing import Any, Dict, List, Optional

import numpy as np
from scipy import stats
from app.schemas.math_input import StatisticsResult


def compute_descriptive_stats(data: Optional[List[float]]) -> StatisticsResult:
    if not data or len(data) == 0:
        raise ValueError("Data array cannot be empty.")

    arr = np.array(data, dtype=float)
    n = len(arr)
    mean_val = float(np.mean(arr))
    median_val = float(np.median(arr))
    variance_val = float(np.var(arr, ddof=1)) if n > 1 else 0.0
    std_val = float(np.std(arr, ddof=1)) if n > 1 else 0.0
    min_val = float(np.min(arr))
    max_val = float(np.max(arr))
    q25 = float(np.percentile(arr, 25))
    q75 = float(np.percentile(arr, 75))
    iqr = q75 - q25

    # Mode
    mode_res = stats.mode(arr, keepdims=True)
    mode_val = float(mode_res.mode[0])

    res_dict: Dict[str, Any] = {
        "count": n,
        "mean": round(mean_val, 4),
        "median": round(median_val, 4),
        "mode": round(mode_val, 4),
        "variance": round(variance_val, 4),
        "std_dev": round(std_val, 4),
        "min": round(min_val, 4),
        "max": round(max_val, 4),
        "range": round(max_val - min_val, 4),
        "q1": round(q25, 4),
        "q3": round(q75, 4),
        "iqr": round(iqr, 4),
    }

    # Histogram data for frontend chart
    counts, bin_edges = np.histogram(arr, bins="auto")
    bin_centers = 0.5 * (bin_edges[:-1] + bin_edges[1:])
    plot_data = {
        "histogram": {
            "x": [round(float(b), 3) for b in bin_centers],
            "y": [int(c) for c in counts],
        }
    }

    return StatisticsResult(result=res_dict, plot_data=plot_data)


def compute_regression(
    x_data: Optional[List[float]],
    y_data: Optional[List[float]],
    regression_type: str = "linear",
) -> StatisticsResult:
    if not x_data or not y_data or len(x_data) != len(y_data):
        raise ValueError("x_data and y_data must have matching non-zero lengths.")

    x = np.array(x_data, dtype=float)
    y = np.array(y_data, dtype=float)

    if regression_type == "polynomial":
        coeffs = np.polyfit(x, y, 2)
        p = np.poly1d(coeffs)
        y_pred = p(x)
        r2 = float(1 - np.sum((y - y_pred) ** 2) / np.sum((y - np.mean(y)) ** 2))
        res_dict = {
            "type": "polynomial_deg_2",
            "equation": f"y = {coeffs[0]:.4f}x² + {coeffs[1]:.4f}x + {coeffs[2]:.4f}",
            "r_squared": round(r2, 4),
        }
    else:
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
        res_dict = {
            "type": "linear",
            "slope": round(float(slope), 4),
            "intercept": round(float(intercept), 4),
            "r_squared": round(float(r_value ** 2), 4),
            "p_value": round(float(p_value), 6),
            "std_err": round(float(std_err), 4),
            "equation": f"y = {slope:.4f}x + {intercept:.4f}",
        }

    return StatisticsResult(result=res_dict)
