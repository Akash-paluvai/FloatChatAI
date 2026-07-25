"""Test Query Planner & Filter Builder."""
import pytest
from app.database.planner.planner import QueryPlanner, FilterBuilder, QueryPlanSpec


def test_query_planner_spec():
    params = {"mode": "radius", "lat": 12.0, "lon": 80.0, "radius_km": 50.0}
    spec = QueryPlanner.plan_query(params)
    assert spec.spatial_mode == "radius"
    assert spec.lat == 12.0
    assert spec.radius_km == 50.0


def test_filter_builder():
    spec = QueryPlanSpec(spatial_mode="bounding_box", min_lat=0.0, max_lat=20.0, min_lon=60.0, max_lon=90.0)
    stmt = FilterBuilder.build_profile_query(spec)
    assert stmt is not None
