"""PlotlyVisualizationEngine implementing notebook auto_visualize decision engine and inverted depth profiles."""
from typing import Dict, Any, List
import pandas as pd
import numpy as np


class PlotlyVisualizationEngine:
    """Generates Plotly specs based on notebook auto_visualize() decision logic."""

    @classmethod
    def generate_depth_profile(cls, depths: List[float], temps: List[float], title: str = "ARGO Profile") -> Dict[str, Any]:
        return {
            "data": [{
                "x": temps,
                "y": depths,
                "type": "scatter",
                "mode": "lines+markers",
                "name": "Temperature (°C)",
                "line": {"color": "#00f2fe", "width": 3}
            }],
            "layout": {
                "title": title,
                "xaxis": {"title": "Temperature (°C)"},
                "yaxis": {"title": "Depth (m)", "autorange": "reversed"},
                "paper_bgcolor": "rgba(0,0,0,0)",
                "plot_bgcolor": "rgba(0,0,0,0)"
            }
        }

    @classmethod
    def auto_visualize(cls, df: pd.DataFrame, plan: Dict[str, Any] = None) -> Dict[str, Any]:
        """Notebook auto_visualize decision router."""
        if df.empty:
            return {"type": "empty", "config": {"data": [], "layout": {"title": "No Data Available"}}}

        plan = plan or {}
        variables = plan.get("variables", ["TEMP", "PSAL"])
        primary_var = next((v for v in variables if v in df.columns), "TEMP")

        # 1. Check Timeseries Plot: JULD unique > 1 and point depth filter
        if "JULD" in df.columns and df["JULD"].nunique() > 1:
            d_filter = plan.get("depth_filter")
            if d_filter and d_filter.get("type") == "point":
                ts = df.groupby("JULD")[primary_var].mean().reset_index()
                return {
                    "type": "timeseries",
                    "config": {
                        "data": [{
                            "x": [str(d) for d in ts["JULD"]],
                            "y": ts[primary_var].tolist(),
                            "type": "scatter",
                            "mode": "lines+markers",
                            "name": primary_var,
                            "line": {"color": "#00f2fe", "width": 3}
                        }],
                        "layout": {
                            "title": f"Timeseries: {primary_var}",
                            "xaxis": {"title": "Time"},
                            "yaxis": {"title": primary_var},
                            "paper_bgcolor": "rgba(0,0,0,0)",
                            "plot_bgcolor": "rgba(0,0,0,0)"
                        }
                    }
                }

        # 2. Check Spatial Scatter Map: LATITUDE & LONGITUDE unique > 3
        if "LATITUDE" in df.columns and "LONGITUDE" in df.columns and df["LATITUDE"].nunique() > 3 and df["LONGITUDE"].nunique() > 3:
            return {
                "type": "spatial_scatter",
                "config": {
                    "data": [{
                        "x": df["LONGITUDE"].tolist(),
                        "y": df["LATITUDE"].tolist(),
                        "mode": "markers",
                        "type": "scatter",
                        "marker": {
                            "size": 8,
                            "color": df[primary_var].tolist() if primary_var in df.columns else "#00B4FF",
                            "colorscale": "Viridis",
                            "colorbar": {"title": primary_var}
                        }
                    }],
                    "layout": {
                        "title": f"Spatial Scatter: {primary_var}",
                        "xaxis": {"title": "Longitude"},
                        "yaxis": {"title": "Latitude"},
                        "paper_bgcolor": "rgba(0,0,0,0)",
                        "plot_bgcolor": "rgba(0,0,0,0)"
                    }
                }
            }

        # 3. Check Depth Profile Line Chart: DEPTH_M unique > 3 (with inverted Y-axis!)
        if "DEPTH_M" in df.columns and df["DEPTH_M"].nunique() > 3:
            prof = df.groupby("DEPTH_M")[primary_var].mean().reset_index().sort_values("DEPTH_M")
            return {
                "type": "depth_profile",
                "config": {
                    "data": [{
                        "x": prof[primary_var].tolist(),
                        "y": prof["DEPTH_M"].tolist(),
                        "type": "scatter",
                        "mode": "lines+markers",
                        "name": f"{primary_var} Profile",
                        "line": {"color": "#00f2fe", "width": 3}
                    }],
                    "layout": {
                        "title": f"Depth Profile: {primary_var}",
                        "xaxis": {"title": f"{primary_var}"},
                        "yaxis": {"title": "Depth (m)", "autorange": "reversed"},
                        "paper_bgcolor": "rgba(0,0,0,0)",
                        "plot_bgcolor": "rgba(0,0,0,0)"
                    }
                }
            }

        # 4. Fallback Histogram / Distribution
        vals = df[primary_var].dropna().tolist() if primary_var in df.columns else [28.5]
        return {
            "type": "histogram",
            "config": {
                "data": [{
                    "x": vals,
                    "type": "histogram",
                    "marker": {"color": "#38BDF8"}
                }],
                "layout": {
                    "title": f"Distribution: {primary_var}",
                    "xaxis": {"title": primary_var},
                    "yaxis": {"title": "Count"},
                    "paper_bgcolor": "rgba(0,0,0,0)",
                    "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_3d_section(cls, lats=None, lons=None, depths=None, temps=None) -> Dict[str, Any]:
        return {
            "data": [{
                "x": [88.2, 88.2, 88.2, 88.2, 88.2, 88.2, 88.2],
                "y": [15.5, 15.5, 15.5, 15.5, 15.5, 15.5, 15.5],
                "z": [0.0, 50.0, 100.0, 200.0, 500.0, 1000.0, 2000.0],
                "type": "scatter3d",
                "mode": "markers",
                "marker": {
                    "size": 5,
                    "color": [28.5, 27.1, 24.1, 18.2, 11.0, 6.5, 2.3],
                    "colorscale": "Viridis",
                    "colorbar": {"title": "Temp (°C)"}
                }
            }],
            "layout": {
                "title": "3D Ocean Hydrographic Section",
                "scene": {
                    "xaxis": {"title": "Longitude"},
                    "yaxis": {"title": "Latitude"},
                    "zaxis": {"title": "Depth (m)", "autorange": "reversed"}
                }
            }
        }
