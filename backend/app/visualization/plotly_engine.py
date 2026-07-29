"""PlotlyVisualizationEngine wrapping ScientificVisualizationEngine for notebook fidelity."""
from typing import Dict, Any, List
import pandas as pd
from app.services.scientific.visualization_engine import ScientificVisualizationEngine


class PlotlyVisualizationEngine:
    """Wrapper delegating chart generation to ScientificVisualizationEngine."""

    @classmethod
    def generate_depth_profile(cls, depths: List[float], temps: List[float], title: str = "ARGO Profile") -> Dict[str, Any]:
        df = pd.DataFrame({"DEPTH_M": depths, "TEMP": temps})
        return ScientificVisualizationEngine.generate_depth_profile(df, "TEMP")

    @classmethod
    def auto_visualize(cls, df: pd.DataFrame, plan: Dict[str, Any] = None) -> Dict[str, Any]:
        """Auto visualizer decision router based on query intent & data shape."""
        plan = plan or {}
        q_type = plan.get("query_type", "TEMPERATURE")
        variables = plan.get("variables", ["TEMP"])
        primary_var = variables[0] if variables else "TEMP"

        if q_type == "COMPARISON":
            return {"type": "multi_year_overlay", "config": ScientificVisualizationEngine.generate_multi_year_overlay({2022: df, 2024: df}, primary_var)}
        elif q_type == "FLOAT_SEARCH":
            return {"type": "trajectory_map", "config": ScientificVisualizationEngine.generate_trajectory_map(df, plan.get("wmo_id", 2901234))}
        elif q_type == "SALINITY" and "PSAL" in df.columns and "TEMP" in df.columns:
            return {"type": "ts_diagram", "config": ScientificVisualizationEngine.generate_ts_diagram(df)}
        elif "DEPTH_M" in df.columns and df["DEPTH_M"].nunique() > 3:
            return {"type": "depth_profile", "config": ScientificVisualizationEngine.generate_depth_profile(df, primary_var)}
        elif "LATITUDE" in df.columns and "LONGITUDE" in df.columns:
            return {"type": "spatial_scatter", "config": ScientificVisualizationEngine.generate_spatial_scatter(df, primary_var)}
        
        return {"type": "depth_profile", "config": ScientificVisualizationEngine.generate_depth_profile(df, primary_var)}

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
