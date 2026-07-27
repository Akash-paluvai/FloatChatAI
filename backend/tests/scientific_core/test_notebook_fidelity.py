"""Pytest test suite validating 100% notebook scientific fidelity across refactored architecture."""
import pytest
import pandas as pd
from app.ai.router.intent_router import AIIntentRouter
from app.retrieval.filters.metadata_filter import MetadataFilterEngine
from app.database.loaders.parquet_loader import ParquetLoader
from app.agents.workers.all_workers import summarize_by_depth, generate_natural_language_insights
from app.visualization.plotly_engine import PlotlyVisualizationEngine
from app.retrieval.hybrid.hybrid_engine import HybridSearchEngine


def test_notebook_nl_query_parser():
    p1 = AIIntentRouter.parse_query("Temperature at 500m in Bay of Bengal 2023")
    assert p1["variables"] == ["TEMP"]
    assert p1["region"]["name"] == "Bay of Bengal"
    assert p1["region"]["bbox"] == {"lat_min": 5.0, "lat_max": 22.0, "lon_min": 80.0, "lon_max": 95.0}
    assert p1["depth_filter"] == {"type": "point", "m": 500.0, "tol": 10.0}
    assert "2023" in p1["time"]["start"]

    p2 = AIIntentRouter.parse_query("Salinity and temperature at 100m in Arabian Sea 2024")
    assert set(p2["variables"]) == {"TEMP", "PSAL"}
    assert p2["region"]["name"] == "Arabian Sea"
    assert p2["depth_filter"]["m"] == 100.0


def test_metadata_time_clamping_and_pruning():
    plan = AIIntentRouter.parse_query("Temperature in Bay of Bengal 2030")
    meta_df = pd.DataFrame([
        {"file_path": "argo_2022_filtered.parquet", "lat_min_est": 5.0, "lat_max_est": 22.0, "lon_min_est": 80.0, "lon_max_est": 95.0, "juld_min_est": "2022-01-01", "juld_max_est": "2022-12-31"},
        {"file_path": "argo_2023_filtered.parquet", "lat_min_est": 5.0, "lat_max_est": 25.0, "lon_min_est": 50.0, "lon_max_est": 77.0, "juld_min_est": "2023-01-01", "juld_max_est": "2023-12-31"},
    ])
    clamped_plan = MetadataFilterEngine.adjust_time_to_metadata(plan, meta_df)
    assert "2023" in clamped_plan["time"]["end"] or "2022" in clamped_plan["time"]["end"]

    candidates = MetadataFilterEngine.prune_files_by_metadata(clamped_plan, meta_df)
    assert len(candidates) > 0


def test_parquet_loader_execute_plan():
    plan = AIIntentRouter.parse_query("Temperature at 500m in Bay of Bengal 2023")
    df_res, info = ParquetLoader.execute_plan(plan)
    assert len(df_res) > 0
    assert "TEMP" in df_res.columns
    assert "DEPTH_M" in df_res.columns
    assert info["n_rows"] == len(df_res)


def test_scientific_stats_and_depth_bins():
    df = pd.DataFrame({
        "DEPTH_M": [5, 20, 80, 150, 400, 800, 1500],
        "TEMP": [28.5, 27.2, 24.1, 18.0, 11.5, 6.2, 2.1],
        "PSAL": [33.2, 33.5, 34.0, 34.5, 34.8, 35.0, 35.0]
    })
    binned = summarize_by_depth(df)
    assert len(binned) == 7

    insights = generate_natural_language_insights(df)
    assert "avg_surface_temp" in insights
    assert "thermocline_gradient_depth" in insights


def test_auto_visualize_inverted_depth():
    df = pd.DataFrame({
        "DEPTH_M": [0, 50, 100, 200, 500],
        "TEMP": [28.5, 27.1, 24.1, 18.2, 11.0]
    })
    spec = PlotlyVisualizationEngine.auto_visualize(df)
    assert spec["type"] == "depth_profile"
    assert spec["config"]["layout"]["yaxis"]["autorange"] == "reversed"


def test_hybrid_retrieval_reference():
    engine = HybridSearchEngine()
    df, paths = engine.hybrid_retrieve("salinity profiles in Arabian Sea 2023", return_paths=True)
    assert len(paths) > 0
    assert len(df) > 0
