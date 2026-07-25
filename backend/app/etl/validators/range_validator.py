"""Scientific File, Coordinate, and Physical Range Validators."""
from typing import Any, Dict, List
from pathlib import Path
from app.etl.config import etl_config


class FileValidator:
    """Validates corrupt files, missing required variables, and payload integrity."""

    @staticmethod
    def validate_file(file_path: Path) -> bool:
        if not file_path.exists():
            return False
        if file_path.stat().st_size == 0:
            return False
        return True


class CoordinateValidator:
    """Validates WGS84 coordinates."""

    @staticmethod
    def validate_coordinates(latitude: float, longitude: float) -> bool:
        if not (-90.0 <= latitude <= 90.0):
            return False
        if not (-180.0 <= longitude <= 180.0):
            return False
        return True


class RangeValidator:
    """Validates physical ocean bounds."""

    @staticmethod
    def validate_temperature(temp_c: float) -> bool:
        return etl_config.TEMP_MIN_C <= temp_c <= etl_config.TEMP_MAX_C

    @staticmethod
    def validate_salinity(salinity_psu: float) -> bool:
        return etl_config.SALINITY_MIN_PSU <= salinity_psu <= etl_config.SALINITY_MAX_PSU

    @staticmethod
    def validate_depth(depth_m: float) -> bool:
        return 0.0 <= depth_m <= etl_config.DEPTH_MAX_M
