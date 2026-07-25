"""Test Scientific Database Models & EAV Schema."""
import pytest
from app.database.models.unit import UnitModel
from app.database.models.variable import VariableModel
from app.database.models.region import OceanRegionModel
from app.database.models.profile import ProfileModel


def test_unit_model():
    unit = UnitModel(id="unit-1", name="Celsius", symbol="°C", si_unit="K")
    assert unit.symbol == "°C"


def test_variable_model():
    var = VariableModel(id="var-1", code="TEMP", name="Temperature")
    assert var.code == "TEMP"


def test_ocean_region_model():
    reg = OceanRegionModel(id="reg-1", code="bob", name="Bay of Bengal", ocean="Indian Ocean", eez="India EEZ")
    assert reg.eez == "India EEZ"


def test_profile_vector_fields():
    prof = ProfileModel(
        profile_id="p-1",
        float_wmo_id=2901234,
        latitude=15.5,
        longitude=88.2,
        embedding_status="pending",
        indexed=False
    )
    assert prof.indexed is False
    assert prof.embedding_status == "pending"
