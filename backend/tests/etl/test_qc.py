"""Test Validation & Quality Control Engine."""
import pytest
from app.etl.validators.range_validator import CoordinateValidator, RangeValidator
from app.etl.quality_control.flags import QCFlag
from app.etl.quality_control.qc_engine import QCEngine, QCReportGenerator


def test_coordinate_validator():
    assert CoordinateValidator.validate_coordinates(15.5, 88.2) is True
    assert CoordinateValidator.validate_coordinates(105.5, 88.2) is False


def test_range_validator():
    assert RangeValidator.validate_temperature(28.5) is True
    assert RangeValidator.validate_temperature(50.0) is False
    assert RangeValidator.validate_salinity(34.2) is True


def test_qc_engine_evaluation():
    engine = QCEngine()
    raw = {
        "latitude": 15.5,
        "longitude": 88.2,
        "variables": {
            "depth_m": [0.0, 100.0],
            "temp_c": [28.5, 24.1],
            "salinity_psu": [33.2, 34.5],
        }
    }
    evaluated = engine.evaluate_profile(raw)
    assert evaluated["qc_passed"] is True
    assert evaluated["variables"]["qc_flags"] == [int(QCFlag.GOOD), int(QCFlag.GOOD)]

    report = QCReportGenerator.generate_report(evaluated)
    assert report["pass_rate_pct"] == 100.0
