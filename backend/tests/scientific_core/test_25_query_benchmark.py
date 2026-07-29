"""25-Query Scientific Benchmark Verification Suite for FloatChat Recovery."""
import pytest
from app.ai.agents.langgraph_agent import FloatChatGraphAgent


BENCHMARK_QUERIES = [
    # 1. Temperature Depth Profiles
    ("Show temperature near Bay of Bengal", "TEMPERATURE", "Bay of Bengal", "depth_profile", False),
    ("Temperature at 500m in Bay of Bengal 2023", "TEMPERATURE", "Bay of Bengal", "depth_profile", True),
    ("Surface sea temperature in Arabian Sea", "TEMPERATURE", "Arabian Sea", "depth_profile", False),
    ("Vertical temperature profile in Indian Ocean", "TEMPERATURE", "Indian Ocean", "depth_profile", False),

    # 2. Salinity & Halocline
    ("Find salinity anomalies in Arabian Sea", "SALINITY", "Arabian Sea", "ts_diagram", False),
    ("Salinity and temperature at 100m in Arabian Sea 2023", "SALINITY", "Arabian Sea", "ts_diagram", True),
    ("Salinity distribution in Bay of Bengal", "SALINITY", "Bay of Bengal", "ts_diagram", False),
    ("Plot T-S relationship in Indian Ocean", "SALINITY", "Indian Ocean", "ts_diagram", False),

    # 3. Float Discovery & Trajectories
    ("List active ARGO floats in Indian Ocean", "FLOAT_SEARCH", "Indian Ocean", "trajectory_map", False),
    ("Track Float #2901234 trajectory", "FLOAT_SEARCH", "Indian Ocean", "trajectory_map", False),
    ("Show active floats near Equatorial Indian Ocean", "FLOAT_SEARCH", "Equatorial Indian Ocean", "trajectory_map", False),

    # 4. Multi-Year Comparative Analytics
    ("Compare 2022 vs 2024 surface ocean heat", "COMPARISON", "Indian Ocean", "multi_year_overlay", False),
    ("Temperature comparison 2022 vs 2023 in Bay of Bengal", "COMPARISON", "Bay of Bengal", "multi_year_overlay", False),
    ("Salinity comparison between Arabian Sea and Bay of Bengal", "COMPARISON", "Bay of Bengal", "multi_year_overlay", False),

    # 5. Regional & Climatology
    ("Ocean profile near Southern Ocean", "TEMPERATURE", "Southern Ocean", "depth_profile", False),
    ("Analyze thermocline gradient depth in Bay of Bengal", "TEMPERATURE", "Bay of Bengal", "depth_profile", False),
    ("Equatorial Indian Ocean salinity profile", "SALINITY", "Equatorial Indian Ocean", "ts_diagram", False),
    ("Depth-time temperature heatmap for 2023", "TEMPERATURE", "Bay of Bengal", "depth_profile", False),

    # 6. Statistics & Trends
    ("Temperature time series in Indian Ocean last 6 months", "TEMPERATURE", "Indian Ocean", "depth_profile", False),
    ("Ocean depth binned statistics for Bay of Bengal", "TEMPERATURE", "Bay of Bengal", "depth_profile", False),
    ("Identify water mass characteristics in Arabian Sea", "SALINITY", "Arabian Sea", "ts_diagram", False),

    # 7. Dataset Coverage & Exports
    ("Show dataset coverage bounds for ARGO prototype", "DATASET", "Bay of Bengal", "depth_profile", False),
    ("Export CSV dataset for Bay of Bengal temperature", "DATASET", "Bay of Bengal", "depth_profile", False),

    # 8. Greetings & Non-Data Queries
    ("hi", "GREETING", None, None, False),
    ("Who are you", "GREETING", None, None, False)
]


@pytest.mark.asyncio
@pytest.mark.parametrize("query, expected_qtype, expected_region, expected_viz, check_sql", BENCHMARK_QUERIES)
async def test_scientific_benchmark_query(query, expected_qtype, expected_region, expected_viz, check_sql):
    agent = FloatChatGraphAgent()
    out = await agent.run_workflow(query)

    assert out["success"] is True
    assert out["query_type"] == expected_qtype

    if expected_qtype == "GREETING":
        assert out["generated_sql"] is None
        assert len(out["citations"]) == 0
        assert "FloatChat" in out["response"]
    else:
        assert out["response"] is not None
        assert len(out["response"]) > 20
        if expected_region:
            assert expected_region in out["response"] or expected_region in str(out["analytical_summary"])
        if check_sql:
            assert "SELECT" in out["generated_sql"]
            assert "WHERE" in out["generated_sql"]
