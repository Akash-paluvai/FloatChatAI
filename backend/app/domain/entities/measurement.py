"""Measurement domain entity."""
from dataclasses import dataclass
from typing import Optional


@dataclass
class Measurement:
    depth_m: float
    temperature_celsius: float
    salinity_psu: float
    pressure_dbar: Optional[float] = None
    density_kg_m3: Optional[float] = None
