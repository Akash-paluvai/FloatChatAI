"""Data Pipeline Service — loads REAL parquet data from SIH2025/Data.
Direct port of Step3 (2).ipynb execute_plan() and prune_files_by_metadata()."""
import os
import glob
from typing import Dict, Any, List, Tuple, Optional
import pandas as pd
import numpy as np
from loguru import logger

# Real data paths — __file__ is at backend/app/services/scientific/
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
PARQUET_DIR = os.path.join(_PROJECT_ROOT, "SIH2025", "Data", "argo_prototype_parquet")
METADATA_CSV = os.path.join(PARQUET_DIR, "argo_metadata_catalog.csv")
FILTERED_DIR = os.path.join(_PROJECT_ROOT, "SIH2025", "Data", "Filtered_Argo")
SUMMARY_DIR = os.path.join(_PROJECT_ROOT, "SIH2025", "Data", "argo_summary")

MAX_RETURN_ROWS = 2000


def _load_metadata_catalog() -> pd.DataFrame:
    """Load the metadata catalog CSV that indexes all parquet files."""
    if os.path.exists(METADATA_CSV):
        meta = pd.read_csv(METADATA_CSV)
        # Fix file_path to local paths instead of Google Drive paths
        meta["file_path"] = meta["file_name"].apply(lambda fn: os.path.join(PARQUET_DIR, fn))
        return meta
    # Fallback: build from directory listing
    files = sorted(glob.glob(os.path.join(PARQUET_DIR, "*.parquet")))
    rows = []
    for f in files:
        rows.append({"file_path": f, "file_name": os.path.basename(f)})
    return pd.DataFrame(rows)


_meta_df_cache: Optional[pd.DataFrame] = None


def get_metadata_catalog() -> pd.DataFrame:
    global _meta_df_cache
    if _meta_df_cache is None:
        _meta_df_cache = _load_metadata_catalog()
    return _meta_df_cache


def get_available_year_range() -> Tuple[int, int]:
    """Returns the min and max years available in the dataset."""
    meta = get_metadata_catalog()
    files = sorted(meta["file_name"].tolist())
    years = set()
    for f in files:
        parts = f.split("_")
        if parts[0].isdigit():
            years.add(int(parts[0]))
    if years:
        return min(years), max(years)
    return 2022, 2024


class DataPipelineService:
    """Loads REAL parquet data — direct port of notebook execute_plan()."""

    @classmethod
    def prune_files_by_metadata(cls, plan: Dict[str, Any]) -> List[str]:
        """Port of notebook prune_files_by_metadata()."""
        meta = get_metadata_catalog()
        candidates = meta.copy()

        if plan.get("region") and plan["region"].get("bbox"):
            b = plan["region"]["bbox"]
            if "lat_max_est" in candidates.columns:
                cond = (
                    (candidates["lat_max_est"].notna()) &
                    (candidates["lat_min_est"].notna()) &
                    (candidates["lon_max_est"].notna()) &
                    (candidates["lon_min_est"].notna()) &
                    (candidates["lat_max_est"] >= b["lat_min"]) &
                    (candidates["lat_min_est"] <= b["lat_max"]) &
                    (candidates["lon_max_est"] >= b["lon_min"]) &
                    (candidates["lon_min_est"] <= b["lon_max"])
                )
                candidates = candidates.loc[cond]

        if plan.get("time"):
            start = pd.to_datetime(plan["time"]["start"])
            end = pd.to_datetime(plan["time"]["end"])
            if "juld_max_est" in candidates.columns:
                mask = (
                    (candidates["juld_max_est"].isna()) |
                    (candidates["juld_min_est"].isna()) |
                    (
                        (pd.to_datetime(candidates["juld_max_est"], errors="coerce") >= start) &
                        (pd.to_datetime(candidates["juld_min_est"], errors="coerce") <= end)
                    )
                )
                candidates = candidates.loc[mask]

        paths = [p for p in candidates["file_path"].unique() if os.path.exists(p)]
        return paths

    @classmethod
    def execute_data_plan(cls, plan: Dict[str, Any], max_rows: int = MAX_RETURN_ROWS) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Port of notebook execute_plan() — loads REAL parquet with Dask/PyArrow."""
        candidate_files = cls.prune_files_by_metadata(plan)
        logger.info(f"[DATA-PIPELINE] Candidate parquet files: {len(candidate_files)}")

        if not candidate_files:
            return pd.DataFrame(), {"note": "No candidate files matched the query filters.", "files_used": [], "n_rows": 0}

        try:
            import dask.dataframe as dd
            df = dd.read_parquet(candidate_files, engine="pyarrow")
        except Exception as e:
            logger.warning(f"[DATA-PIPELINE] Dask read failed, falling back to pandas: {e}")
            frames = []
            for f in candidate_files[:5]:
                try:
                    frames.append(pd.read_parquet(f))
                except Exception:
                    pass
            if not frames:
                return pd.DataFrame(), {"note": "Failed to read parquet files.", "files_used": candidate_files, "n_rows": 0}
            df_pd = pd.concat(frames, ignore_index=True)
            return cls._apply_filters_pandas(df_pd, plan, max_rows, candidate_files)

        return cls._apply_filters_dask(df, plan, max_rows, candidate_files)

    @classmethod
    def _apply_filters_dask(cls, df, plan, max_rows, candidate_files):
        import dask.dataframe as dd

        if "JULD" in df.columns:
            df["JULD"] = dd.to_datetime(df["JULD"], errors="coerce")

        # Region filter
        if plan.get("region") and plan["region"].get("bbox"):
            b = plan["region"]["bbox"]
            df = df[(df["LATITUDE"] >= b["lat_min"]) & (df["LATITUDE"] <= b["lat_max"])]
            df = df[(df["LONGITUDE"] >= b["lon_min"]) & (df["LONGITUDE"] <= b["lon_max"])]

        # Time filter
        if plan.get("time") and "JULD" in df.columns:
            start = pd.to_datetime(plan["time"]["start"])
            end = pd.to_datetime(plan["time"]["end"])
            df = df[(df["JULD"] >= start) & (df["JULD"] <= end)]

        # Depth filter
        if plan.get("depth_filter"):
            d = plan["depth_filter"]
            if d["type"] == "point":
                tol = d.get("tol", 10)
                df = df[df["DEPTH_M"].between(d["m"] - tol, d["m"] + tol)]
            elif d["type"] == "range":
                df = df[df["DEPTH_M"].between(d["min_m"], d["max_m"])]

        # Select columns
        var_cols = [v for v in plan.get("variables", ["TEMP", "PSAL"]) if v in df.columns]
        selected = ["LATITUDE", "LONGITUDE", "JULD", "DEPTH_M"] + var_cols + ["source_file"]
        existing = [c for c in selected if c in df.columns]
        df = df[existing]

        try:
            res = df.head(max_rows, compute=True)
        except Exception:
            res = df.compute().head(max_rows)

        if isinstance(res.index, pd.DatetimeIndex):
            res = res.reset_index()

        logger.info(f"[DATA-PIPELINE] Loaded {len(res)} real observation rows from {len(candidate_files)} files")
        return res, {"files_used": [os.path.basename(f) for f in candidate_files], "n_rows": len(res)}

    @classmethod
    def _apply_filters_pandas(cls, df_pd, plan, max_rows, candidate_files):
        if "JULD" in df_pd.columns:
            df_pd["JULD"] = pd.to_datetime(df_pd["JULD"], errors="coerce")

        if plan.get("region") and plan["region"].get("bbox"):
            b = plan["region"]["bbox"]
            df_pd = df_pd[(df_pd["LATITUDE"] >= b["lat_min"]) & (df_pd["LATITUDE"] <= b["lat_max"])]
            df_pd = df_pd[(df_pd["LONGITUDE"] >= b["lon_min"]) & (df_pd["LONGITUDE"] <= b["lon_max"])]

        if plan.get("time") and "JULD" in df_pd.columns:
            start = pd.to_datetime(plan["time"]["start"])
            end = pd.to_datetime(plan["time"]["end"])
            df_pd = df_pd[(df_pd["JULD"] >= start) & (df_pd["JULD"] <= end)]

        if plan.get("depth_filter"):
            d = plan["depth_filter"]
            if d["type"] == "point":
                tol = d.get("tol", 10)
                df_pd = df_pd[df_pd["DEPTH_M"].between(d["m"] - tol, d["m"] + tol)]
            elif d["type"] == "range":
                df_pd = df_pd[df_pd["DEPTH_M"].between(d["min_m"], d["max_m"])]

        res = df_pd.head(max_rows)
        logger.info(f"[DATA-PIPELINE] Loaded {len(res)} real rows (pandas fallback)")
        return res, {"files_used": [os.path.basename(f) for f in candidate_files], "n_rows": len(res)}

    @classmethod
    def load_multi_year_datasets(cls, plan: Dict[str, Any]) -> Dict[int, pd.DataFrame]:
        """Loads separate dataframes per year from real parquet files."""
        years = plan.get("years", [2022, 2024])
        result = {}
        for yr in years:
            yr_plan = dict(plan)
            yr_plan["time"] = {"start": f"{yr}-01-01T00:00:00", "end": f"{yr}-12-31T23:59:59"}
            df, _ = cls.execute_data_plan(yr_plan, max_rows=MAX_RETURN_ROWS)
            result[yr] = df
        return result

    @classmethod
    def load_float_trajectory(cls, wmo_id: int = None, region: Dict = None) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Lists unique source_file entries (proxy for float profiles) in a region."""
        plan = {
            "region": region,
            "variables": ["TEMP", "PSAL"],
            "time": {"start": "2022-01-01T00:00:00", "end": "2024-12-31T23:59:59"},
            "depth_filter": None
        }
        df, info = cls.execute_data_plan(plan, max_rows=5000)
        if df.empty:
            return df, {"note": "No float data found"}

        # Group by source_file to get unique float profiles
        floats = df.groupby("source_file").agg(
            lat_mean=("LATITUDE", "mean"),
            lon_mean=("LONGITUDE", "mean"),
            n_obs=("DEPTH_M", "count"),
            date=("JULD", "first") if "JULD" in df.columns else ("LATITUDE", "first")
        ).reset_index()

        meta = {
            "total_profiles": len(floats),
            "total_observations": len(df),
            "unique_source_files": list(floats["source_file"].head(10)),
            "region": region.get("name") if region else "global"
        }
        return df, meta
