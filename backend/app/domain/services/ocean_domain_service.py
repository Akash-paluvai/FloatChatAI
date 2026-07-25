"""OceanDomainService containing domain business logic abstractions."""
from typing import List
from app.domain.entities.measurement import Measurement
from app.domain.value_objects.depth_range import ThermoclineBounds


class OceanDomainService:
    """Domain service for calculating physical ocean properties & thermoclines."""

    @staticmethod
    def calculate_thermocline_bounds(measurements: List[Measurement]) -> ThermoclineBounds:
        """Domain logic to find thermocline gradient boundary."""
        if not measurements:
            return ThermoclineBounds(upper_boundary_m=100.0, lower_boundary_m=300.0)

        # Simplified placeholder domain calculation
        return ThermoclineBounds(
            upper_boundary_m=80.0,
            lower_boundary_m=250.0,
            temp_gradient_c_per_m=0.08
        )
