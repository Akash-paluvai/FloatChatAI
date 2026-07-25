"""OceanProfile domain entity."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional
from app.domain.entities.measurement import Measurement
from app.domain.value_objects.coordinates import Coordinates


@dataclass
class OceanProfile:
    profile_id: str
    wmo_id: int
    coordinates: Coordinates
    timestamp: datetime
    ocean_region: str
    measurements: List[Measurement] = field(default_factory=list)
    quality_flag: int = 1
