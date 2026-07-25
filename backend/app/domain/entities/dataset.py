"""Dataset & Visualization domain entities."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class Dataset:
    id: str
    name: str
    source: str  # ARGO, ERDDAP, Argovis, INCOIS
    year: int
    record_count: int
    file_size_bytes: int
    format: str  # Parquet, NetCDF, CSV
    status: str = "Ready"


@dataclass
class Visualization:
    id: str
    title: str
    viz_type: str  # temperature_profile, 3d_contour, spatial_heatmap
    ocean_region: str
    plotly_config: dict
