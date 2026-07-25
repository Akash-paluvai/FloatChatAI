"""SI & Oceanographic Unit Converters."""


class UnitConverter:
    """Standardizes measurement units into FloatChat SI conventions."""

    @staticmethod
    def kelvin_to_celsius(temp_k: float) -> float:
        return temp_k - 273.15

    @staticmethod
    def pressure_to_depth_meters(pressure_dbar: float, latitude: float = 0.0) -> float:
        """Approximates depth in meters from hydrostatic pressure in decibars."""
        return pressure_dbar * 1.019716

    @staticmethod
    def standardize_salinity(salinity: float) -> float:
        """Ensures salinity is represented in Practical Salinity Units (PSU)."""
        return max(0.0, round(salinity, 3))
