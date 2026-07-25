"""Visualization domain entity."""
from dataclasses import dataclass


@dataclass
class Visualization:
    id: str
    title: str
    viz_type: str  # temperature_profile, 3d_contour, spatial_heatmap
    ocean_region: str
    plotly_config: dict
