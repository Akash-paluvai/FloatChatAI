"""Scientific Visualization Engine — generates Plotly specs from REAL data.
Direct port of notebook auto_visualize(), plot_variable(), and plotting cells."""
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np


class ScientificVisualizationEngine:
    """Generates multiple Plotly chart specs from real dataframes — no fake data."""

    @classmethod
    def generate_all_visualizations(cls, df: pd.DataFrame, plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generates ALL applicable visualizations for a query result — like the notebooks do."""
        if df.empty:
            return [{"type": "empty", "title": "No Data", "config": {"data": [], "layout": {"title": "No observations matched your query."}}}]

        charts = []
        variables = plan.get("variables", ["TEMP", "PSAL"])
        primary_var = next((v for v in variables if v in df.columns), None)

        # 1. Depth Profile (if depth data exists)
        if "DEPTH_M" in df.columns and df["DEPTH_M"].nunique() > 3 and primary_var:
            charts.append(cls.generate_depth_profile(df, primary_var))

        # 2. Spatial Scatter Map (if lat/lon spread)
        if "LATITUDE" in df.columns and "LONGITUDE" in df.columns and primary_var:
            if df["LATITUDE"].nunique() > 2 and df["LONGITUDE"].nunique() > 2:
                charts.append(cls.generate_spatial_scatter(df, primary_var))

        # 3. T-S Diagram (if both TEMP and PSAL)
        if "TEMP" in df.columns and "PSAL" in df.columns:
            charts.append(cls.generate_ts_diagram(df))

        # 4. Timeseries (if JULD with spread)
        if "JULD" in df.columns and primary_var:
            juld = pd.to_datetime(df["JULD"], errors="coerce").dropna()
            if juld.nunique() > 2:
                charts.append(cls.generate_timeseries(df, primary_var))

        # 5. Histogram
        if primary_var and primary_var in df.columns:
            charts.append(cls.generate_histogram(df, primary_var))

        # 6. Second variable depth profile
        secondary_var = next((v for v in variables if v in df.columns and v != primary_var), None)
        if secondary_var and "DEPTH_M" in df.columns and df["DEPTH_M"].nunique() > 3:
            charts.append(cls.generate_depth_profile(df, secondary_var))

        if not charts:
            charts.append({"type": "info", "title": "Data Retrieved", "config": {"data": [], "layout": {"title": f"Retrieved {len(df)} observations"}}})

        return charts

    @classmethod
    def generate_depth_profile(cls, df: pd.DataFrame, variable: str = "TEMP") -> Dict[str, Any]:
        """Inverted Y-axis depth profile from REAL data — port of notebook plot."""
        if df.empty or "DEPTH_M" not in df.columns or variable not in df.columns:
            return {"type": "depth_profile", "title": "No Profile Data", "config": {"data": [], "layout": {"title": "No data"}}}

        prof = df.groupby("DEPTH_M")[variable].mean().reset_index().sort_values("DEPTH_M")
        unit = "°C" if variable == "TEMP" else "PSU" if variable == "PSAL" else ""

        return {
            "type": "depth_profile",
            "title": f"Depth Profile: {variable}",
            "config": {
                "data": [{
                    "x": [round(float(v), 3) for v in prof[variable].tolist()],
                    "y": [round(float(v), 2) for v in prof["DEPTH_M"].tolist()],
                    "type": "scatter",
                    "mode": "lines+markers",
                    "name": f"{variable} Profile",
                    "line": {"color": "#00f2fe" if variable == "TEMP" else "#38BDF8", "width": 2},
                    "marker": {"size": 4}
                }],
                "layout": {
                    "title": f"Vertical {variable} Profile ({len(prof)} depth levels)",
                    "xaxis": {"title": f"{variable} ({unit})"},
                    "yaxis": {"title": "Depth (m)", "autorange": "reversed"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_spatial_scatter(cls, df: pd.DataFrame, variable: str = "TEMP") -> Dict[str, Any]:
        """Spatial scatter from REAL data — port of notebook scatter plot."""
        if df.empty:
            return {"type": "spatial_scatter", "title": "No Data", "config": {"data": [], "layout": {}}}

        sample = df.head(1000)
        unit = "°C" if variable == "TEMP" else "PSU" if variable == "PSAL" else ""

        return {
            "type": "spatial_scatter",
            "title": f"Spatial Distribution: {variable}",
            "config": {
                "data": [{
                    "x": [round(float(v), 4) for v in sample["LONGITUDE"].tolist()],
                    "y": [round(float(v), 4) for v in sample["LATITUDE"].tolist()],
                    "mode": "markers",
                    "type": "scatter",
                    "marker": {
                        "size": 6,
                        "color": [round(float(v), 2) for v in sample[variable].tolist()] if variable in sample.columns else "#00B4FF",
                        "colorscale": "Viridis",
                        "colorbar": {"title": f"{variable} ({unit})"}
                    }
                }],
                "layout": {
                    "title": f"Spatial {variable} Distribution ({len(sample)} obs)",
                    "xaxis": {"title": "Longitude (°E)"},
                    "yaxis": {"title": "Latitude (°N)"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_ts_diagram(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """T-S diagram from REAL data."""
        if df.empty or "TEMP" not in df.columns or "PSAL" not in df.columns:
            return {"type": "ts_diagram", "title": "No T-S Data", "config": {"data": [], "layout": {}}}

        clean = df[["TEMP", "PSAL"]].dropna()
        clean = clean[(clean["PSAL"] > 2) & (clean["PSAL"] < 42)]
        sample = clean.head(1000)

        depth_color = df.loc[sample.index, "DEPTH_M"].tolist() if "DEPTH_M" in df.columns else [0] * len(sample)

        return {
            "type": "ts_diagram",
            "title": "T-S Diagram",
            "config": {
                "data": [{
                    "x": [round(float(v), 3) for v in sample["PSAL"].tolist()],
                    "y": [round(float(v), 3) for v in sample["TEMP"].tolist()],
                    "mode": "markers",
                    "type": "scatter",
                    "marker": {"size": 5, "color": [round(float(v), 1) for v in depth_color], "colorscale": "Plasma", "colorbar": {"title": "Depth (m)"}}
                }],
                "layout": {
                    "title": f"Temperature–Salinity Diagram ({len(sample)} obs)",
                    "xaxis": {"title": "Salinity (PSU)"},
                    "yaxis": {"title": "Temperature (°C)"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_timeseries(cls, df: pd.DataFrame, variable: str = "TEMP") -> Dict[str, Any]:
        """Timeseries from REAL data — port of notebook timeseries plot."""
        if df.empty or "JULD" not in df.columns or variable not in df.columns:
            return {"type": "timeseries", "title": "No Data", "config": {"data": [], "layout": {}}}

        ts = df.copy()
        ts["JULD"] = pd.to_datetime(ts["JULD"], errors="coerce")
        ts = ts.dropna(subset=["JULD", variable])
        ts_agg = ts.groupby(ts["JULD"].dt.date)[variable].mean().reset_index()
        ts_agg.columns = ["date", variable]
        unit = "°C" if variable == "TEMP" else "PSU"

        return {
            "type": "timeseries",
            "title": f"Time Series: {variable}",
            "config": {
                "data": [{
                    "x": [str(d) for d in ts_agg["date"].tolist()],
                    "y": [round(float(v), 3) for v in ts_agg[variable].tolist()],
                    "type": "scatter",
                    "mode": "lines+markers",
                    "name": f"Daily Mean {variable}",
                    "line": {"color": "#5EE6FF", "width": 2}
                }],
                "layout": {
                    "title": f"{variable} Time Series ({len(ts_agg)} days)",
                    "xaxis": {"title": "Date"},
                    "yaxis": {"title": f"{variable} ({unit})"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_histogram(cls, df: pd.DataFrame, variable: str = "TEMP") -> Dict[str, Any]:
        """Histogram from REAL data."""
        if df.empty or variable not in df.columns:
            return {"type": "histogram", "title": "No Data", "config": {"data": [], "layout": {}}}

        vals = df[variable].dropna()
        if variable == "PSAL":
            vals = vals[(vals > 2) & (vals < 42)]
        unit = "°C" if variable == "TEMP" else "PSU"

        return {
            "type": "histogram",
            "title": f"Distribution: {variable}",
            "config": {
                "data": [{
                    "x": [round(float(v), 3) for v in vals.head(2000).tolist()],
                    "type": "histogram",
                    "nbinsx": 40,
                    "marker": {"color": "#00B4FF"}
                }],
                "layout": {
                    "title": f"{variable} Distribution ({len(vals)} observations)",
                    "xaxis": {"title": f"{variable} ({unit})"},
                    "yaxis": {"title": "Count"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_multi_year_overlay(cls, df_dict: Dict[int, pd.DataFrame], variable: str = "TEMP") -> Dict[str, Any]:
        """Multi-year overlay from REAL data."""
        colors = {2022: "#38BDF8", 2023: "#5EE6FF", 2024: "#00B4FF"}
        traces = []
        for yr, df in sorted(df_dict.items()):
            if not df.empty and "DEPTH_M" in df.columns and variable in df.columns:
                prof = df.groupby("DEPTH_M")[variable].mean().reset_index().sort_values("DEPTH_M")
                traces.append({
                    "x": [round(float(v), 3) for v in prof[variable].tolist()],
                    "y": [round(float(v), 2) for v in prof["DEPTH_M"].tolist()],
                    "type": "scatter", "mode": "lines+markers",
                    "name": f"Year {yr} ({len(df)} obs)",
                    "line": {"color": colors.get(yr, "#00B4FF"), "width": 2}
                })

        return {
            "type": "multi_year_overlay",
            "title": f"Multi-Year {variable} Comparison",
            "config": {
                "data": traces,
                "layout": {
                    "title": f"Multi-Year {variable} Profile Comparison",
                    "xaxis": {"title": f"{variable} ({'°C' if variable == 'TEMP' else 'PSU'})"},
                    "yaxis": {"title": "Depth (m)", "autorange": "reversed"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }

    @classmethod
    def generate_trajectory_map(cls, df: pd.DataFrame) -> Dict[str, Any]:
        """Float trajectory from REAL data."""
        if df.empty or "LATITUDE" not in df.columns:
            return {"type": "trajectory_map", "title": "No Data", "config": {"data": [], "layout": {}}}

        sample = df.head(1000)
        return {
            "type": "trajectory_map",
            "title": "Float Observation Map",
            "config": {
                "data": [{
                    "x": [round(float(v), 4) for v in sample["LONGITUDE"].tolist()],
                    "y": [round(float(v), 4) for v in sample["LATITUDE"].tolist()],
                    "type": "scatter", "mode": "markers",
                    "name": "Float Positions",
                    "marker": {"size": 6, "color": "#5EE6FF"}
                }],
                "layout": {
                    "title": f"ARGO Float Observation Positions ({len(sample)} profiles)",
                    "xaxis": {"title": "Longitude (°E)"},
                    "yaxis": {"title": "Latitude (°N)"},
                    "paper_bgcolor": "rgba(0,0,0,0)", "plot_bgcolor": "rgba(0,0,0,0)"
                }
            }
        }
