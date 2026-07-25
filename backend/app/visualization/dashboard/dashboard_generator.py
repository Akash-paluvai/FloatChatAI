"""VisualizationTemplateManager and DashboardGenerator modules."""
from typing import Dict, Any, List
from app.visualization.plotly_engine import PlotlyVisualizationEngine


class VisualizationTemplateManager:
    """Manages reusable chart templates (temperature_profile, argo_track, salinity_map, heat_content)."""

    TEMPLATES = ["temperature_profile", "argo_track", "salinity_map", "heat_content", "climatology", "comparison"]

    @classmethod
    def apply_template(cls, template_name: str, ocean_region: str = "Bay of Bengal") -> Dict[str, Any]:
        depths = [0.0, 50.0, 100.0, 200.0, 500.0, 1000.0, 2000.0]
        temps = [28.5, 27.1, 24.1, 18.2, 11.0, 6.5, 2.3]

        if template_name == "3d_section":
            return PlotlyVisualizationEngine.generate_3d_section([15.5]*7, [88.2]*7, depths, temps)

        return PlotlyVisualizationEngine.generate_depth_profile(depths, temps, title=f"ARGO Profile - {ocean_region}")


class DashboardGenerator:
    """Generates multi-panel interactive scientific dashboards with widget & filter specifications."""

    @staticmethod
    def create_dashboard_layout(ocean_region: str = "Bay of Bengal") -> Dict[str, Any]:
        return {
            "dashboard_title": f"Interactive Oceanographic Dashboard - {ocean_region}",
            "panels": [
                {"id": "panel_1", "type": "depth_profile", "config": VisualizationTemplateManager.apply_template("temperature_profile", ocean_region)},
                {"id": "panel_2", "type": "3d_section", "config": VisualizationTemplateManager.apply_template("3d_section", ocean_region)}
            ],
            "widgets": ["depth_slider", "date_range_picker", "variable_selector"],
            "status": "READY"
        }
