"""Float domain entity."""
from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from app.domain.value_objects.coordinates import Coordinates


@dataclass
class Float:
    wmo_id: int
    coordinates: Coordinates
    ocean_region: str
    status: str  # active, inactive, calibrating
    last_telemetry: datetime
    data_center: str = "INCOIS"
    platform_type: Optional[str] = "APEX"
