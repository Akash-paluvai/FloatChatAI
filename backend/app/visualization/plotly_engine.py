"""PlotlyVisualizationEngine generating scientific Plotly chart specifications."""
from typing import Dict, Any, List


class PlotlyVisualizationEngine:
    """Generates Plotly JSON specifications for 3D ocean sections, depth profiles, heatmaps, and trajectories."""

    @staticmethod
    def generate_depth_profile(depths: List[float], temps: List[float], title: str = "Temperature Profile") -> Dict[str, Any]:
        return {
            "data": [
                {
                    "x": temps,
                    "y": depths,
                    "type": "scatter",
                    "mode": "lines+markers",
                    "name": "Temperature (°C)",
                    "line": {"color": "#00f2fe", "width": 3}
                }
            ],
            "layout": {
                "title": title,
                "xaxis": {"title": "Temperature (°C)"},
                "yaxis": {"title": "Depth (m)", "autorange": "reversed"},
                "paper_bgcolor": "rgba(0,0,0,0)",
                "plot_bgcolor": "rgba(0,0,0,0)"
            }
        }

    @staticmethod
    def generate_3d_section(latitudes: List[float], longitudes: List[float], depths: List[float], temps: List[float]) -> Dict[str, Any]:
        return {
            "data": [
                {
                    "x": longitudes,
                    "y": latitudes,
                    "z": depths,
                    "type": "scatter3d",
                    "mode": "markers",
                    "marker": {
                        "size": 5,
                        "color": temps,
                        "colorscale": "Viridis",
                        "colorbar": {"title": "Temp (°C)"}
                    }
                }
            ],
            "layout": {
                "title": "3D Ocean Hydrographic Section",
                "scene": {
                    "xaxis": {"title": "Longitude"},
                    "yaxis": {"title": "Latitude"},
                    "zaxis": {"title": "Depth (m)", "autorange": "reversed"}
                }
            }
        }
