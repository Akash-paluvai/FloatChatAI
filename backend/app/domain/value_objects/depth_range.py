"""DepthRange & ThermoclineBounds value objects."""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class DepthRange:
    min_depth_meters: float = 0.0
    max_depth_meters: float = 2000.0

    def __post_init__(self):
        if self.min_depth_meters < 0:
            raise ValueError("min_depth_meters must be >= 0")
        if self.max_depth_meters < self.min_depth_meters:
            raise ValueError("max_depth_meters must be >= min_depth_meters")


@dataclass(frozen=True)
class ThermoclineBounds:
    upper_boundary_m: float
    lower_boundary_m: float
    temp_gradient_c_per_m: Optional[float] = None
