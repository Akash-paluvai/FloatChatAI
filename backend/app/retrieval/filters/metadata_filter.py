"""MetadataFilterEngine implementing notebook metadata pruning and dataset time clamping."""
from typing import Dict, Any, List
import pandas as pd


class MetadataFilterEngine:
    """Evaluates metadata catalog bounds, clamps query time windows, and prunes file paths."""

    @staticmethod
    def adjust_time_to_metadata(plan: Dict[str, Any], meta_df: pd.DataFrame) -> Dict[str, Any]:
        """Clamps query start/end dates to actual available dataset min/max bounds."""
        if meta_df.empty:
            return plan

        meta_df['juld_min_dt'] = pd.to_datetime(meta_df.get('juld_min_est', None), errors='coerce')
        meta_df['juld_max_dt'] = pd.to_datetime(meta_df.get('juld_max_est', None), errors='coerce')

        dataset_start = meta_df['juld_min_dt'].min()
        dataset_end = meta_df['juld_max_dt'].max()

        if pd.isna(dataset_start) or pd.isna(dataset_end):
            dataset_end = pd.Timestamp.utcnow().replace(tzinfo=None)
            dataset_start = dataset_end - pd.DateOffset(years=2)

        if dataset_start.tzinfo is not None:
            dataset_start = dataset_start.tz_convert(None)
        if dataset_end.tzinfo is not None:
            dataset_end = dataset_end.tz_convert(None)

        time_spec = plan.get('time', {})
        user_start = pd.to_datetime(time_spec.get('start', '2024-01-01')).replace(tzinfo=None)
        user_end = pd.to_datetime(time_spec.get('end', '2024-12-31')).replace(tzinfo=None)

        if user_start > dataset_end or user_end < dataset_start:
            # Query range outside dataset -> fallback to full dataset window
            user_start = dataset_start
            user_end = dataset_end
        else:
            user_start = max(user_start, dataset_start)
            user_end = min(user_end, dataset_end)

        plan['time'] = {
            'start': user_start.isoformat(),
            'end': user_end.isoformat()
        }
        return plan

    @staticmethod
    def prune_files_by_metadata(plan: Dict[str, Any], meta_df: pd.DataFrame) -> List[str]:
        """Prunes file paths by intersecting bounding box and time window."""
        if meta_df.empty:
            return []

        candidates = meta_df.copy()

        # Filter by region bounding box
        if plan.get("region") and plan["region"].get("bbox"):
            b = plan["region"]["bbox"]
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

        # Filter by time bounds
        if plan.get("time"):
            start = pd.to_datetime(plan["time"]["start"])
            end = pd.to_datetime(plan["time"]["end"])
            mask_time = (
                (candidates["juld_max_est"].isna()) |
                (candidates["juld_min_est"].isna()) |
                ((pd.to_datetime(candidates["juld_max_est"], errors='coerce') >= start) &
                 (pd.to_datetime(candidates["juld_min_est"], errors='coerce') <= end))
            )
            candidates = candidates.loc[mask_time]

        file_col = "file_path" if "file_path" in candidates.columns else "source_file"
        return list(candidates[file_col].unique()) if file_col in candidates.columns else []

    @staticmethod
    def matches_filters(metadata: Dict[str, Any], filter_params: Dict[str, Any]) -> bool:
        if not filter_params:
            return True
        if "ocean_region" in filter_params and filter_params["ocean_region"]:
            target_region = str(filter_params["ocean_region"]).lower()
            item_region = str(metadata.get("ocean_region", "")).lower()
            if target_region not in item_region and item_region not in target_region:
                return False
        return True
