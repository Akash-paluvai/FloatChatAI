"""Ocean Analytics Engine — computes REAL statistics from loaded dataframes.
Direct port of notebook summarize_by_depth(), generate_natural_language_insights()."""
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np


class OceanAnalyticsEngine:
    """Computes real statistics from real data — no hardcoded numbers."""

    @staticmethod
    def summarize_by_depth(df: pd.DataFrame, var_list: List[str] = None, depth_col: str = "DEPTH_M") -> pd.DataFrame:
        """Port of notebook summarize_by_depth() — bins depth into oceanographic intervals."""
        if df.empty or depth_col not in df.columns:
            return pd.DataFrame()

        var_list = var_list or ["TEMP", "PSAL"]
        bins = [0, 10, 50, 100, 200, 500, 1000, 2000]
        labels = ["0-10m", "10-50m", "50-100m", "100-200m", "200-500m", "500-1000m", "1000-2000m"]

        df_copy = df.copy()
        df_copy["DEPTH_BIN"] = pd.cut(df_copy[depth_col].astype(float), bins=bins, labels=labels, right=False)

        valid_vars = [v for v in var_list if v in df_copy.columns]
        if not valid_vars:
            return pd.DataFrame()
        summary = df_copy.groupby("DEPTH_BIN", observed=False)[valid_vars].agg(["mean", "std", "min", "max", "count"]).reset_index()
        return summary

    @staticmethod
    def compute_thermocline_and_stats(df: pd.DataFrame, region_name: str = "") -> Dict[str, Any]:
        """Computes REAL thermocline statistics from actual data — no hardcoded numbers."""
        if df.empty:
            return {"summary": "No observations matched the query filters.", "total_observations": 0}

        stats: Dict[str, Any] = {"region_name": region_name, "total_observations": len(df)}

        if "TEMP" in df.columns:
            temp_series = df["TEMP"].dropna()
            if not temp_series.empty:
                stats["avg_temp"] = f"{float(temp_series.mean()):.2f}°C"
                stats["min_temp"] = f"{float(temp_series.min()):.2f}°C"
                stats["max_temp"] = f"{float(temp_series.max()):.2f}°C"
                stats["std_temp"] = f"{float(temp_series.std()):.2f}°C"

        if "PSAL" in df.columns:
            psal_series = df["PSAL"].dropna()
            # Filter out obvious bad values (QC)
            psal_series = psal_series[(psal_series > 2) & (psal_series < 42)]
            if not psal_series.empty:
                stats["salinity_range"] = f"{float(psal_series.min()):.2f} – {float(psal_series.max()):.2f} PSU"
                stats["avg_salinity"] = f"{float(psal_series.mean()):.2f} PSU"

        if "LATITUDE" in df.columns and "LONGITUDE" in df.columns:
            stats["spatial_centroid"] = f"{float(df['LATITUDE'].mean()):.2f}°N, {float(df['LONGITUDE'].mean()):.2f}°E"
            stats["lat_range"] = f"{float(df['LATITUDE'].min()):.2f}° – {float(df['LATITUDE'].max()):.2f}°"
            stats["lon_range"] = f"{float(df['LONGITUDE'].min()):.2f}° – {float(df['LONGITUDE'].max()):.2f}°"

        if "DEPTH_M" in df.columns:
            stats["depth_range"] = f"{float(df['DEPTH_M'].min()):.1f}m – {float(df['DEPTH_M'].max()):.1f}m"

        if "JULD" in df.columns:
            juld = pd.to_datetime(df["JULD"], errors="coerce").dropna()
            if not juld.empty:
                stats["time_range"] = f"{juld.min().strftime('%Y-%m-%d')} to {juld.max().strftime('%Y-%m-%d')}"

        # Thermocline detection from real data
        if "TEMP" in df.columns and "DEPTH_M" in df.columns and len(df) > 5:
            shallow = df[df["DEPTH_M"] <= 20]["TEMP"].mean()
            if not pd.isna(shallow):
                deep_mask = (shallow - df["TEMP"]) >= 10.0
                if deep_mask.any():
                    therm_depth = float(df.loc[deep_mask, "DEPTH_M"].min())
                    stats["thermocline_gradient_depth"] = f"{int(max(0, therm_depth - 30))}m – {int(therm_depth + 50)}m"
                else:
                    stats["thermocline_gradient_depth"] = "Not detected in this depth range"

        # Unique source files = proxy for unique floats
        if "source_file" in df.columns:
            unique_files = df["source_file"].nunique()
            stats["unique_profiles"] = unique_files
            stats["cited_source_files"] = list(df["source_file"].unique()[:10])

        return stats

    @staticmethod
    def compute_multi_year_comparison(df_dict: Dict[int, pd.DataFrame], variable: str = "TEMP") -> Dict[str, Any]:
        """Computes REAL year-over-year statistics from actual data."""
        years = sorted(list(df_dict.keys()))
        summaries = {}
        for yr in years:
            df = df_dict[yr]
            if df.empty or variable not in df.columns:
                summaries[yr] = {"mean_val": None, "obs_count": 0, "note": "No data for this year"}
                continue
            vals = df[variable].dropna()
            if variable == "PSAL":
                vals = vals[(vals > 2) & (vals < 42)]
            summaries[yr] = {
                "mean_val": round(float(vals.mean()), 3) if not vals.empty else None,
                "std_val": round(float(vals.std()), 3) if not vals.empty else None,
                "min_val": round(float(vals.min()), 3) if not vals.empty else None,
                "max_val": round(float(vals.max()), 3) if not vals.empty else None,
                "obs_count": len(vals)
            }

        # Compute real delta
        first_yr, last_yr = years[0], years[-1]
        m1 = summaries[first_yr].get("mean_val")
        m2 = summaries[last_yr].get("mean_val")
        if m1 is not None and m2 is not None:
            delta = round(m2 - m1, 3)
            trend = "Warming" if delta > 0 else "Cooling" if delta < 0 else "Stable"
        else:
            delta = None
            trend = "Insufficient data"

        return {
            "years_compared": years,
            "variable": variable,
            "yearly_summaries": summaries,
            "overall_delta": f"{'+' if delta and delta > 0 else ''}{delta}°C" if delta is not None else "N/A",
            "trend_direction": trend
        }

    @staticmethod
    def compute_salinity_analytics(df: pd.DataFrame, region_name: str = "") -> Dict[str, Any]:
        """Computes REAL salinity analytics from actual data."""
        if df.empty or "PSAL" not in df.columns:
            return {"summary": "No salinity data found for this query."}

        psal = df["PSAL"].dropna()
        psal = psal[(psal > 2) & (psal < 42)]  # QC filter
        if psal.empty:
            return {"summary": "No valid salinity observations after QC filtering."}

        mean_psal = float(psal.mean())
        result = {
            "region_name": region_name,
            "mean_salinity": f"{mean_psal:.3f} PSU",
            "salinity_range": f"{float(psal.min()):.3f} – {float(psal.max()):.3f} PSU",
            "std_salinity": f"{float(psal.std()):.3f} PSU",
            "total_observations": len(psal),
            "regime": "High Salinity (Evaporation-Dominated)" if mean_psal > 35.0 else "Low Salinity (Freshwater-Influenced)"
        }

        if "TEMP" in df.columns:
            temp = df["TEMP"].dropna()
            result["mean_temp"] = f"{float(temp.mean()):.2f}°C"
            result["ts_correlation"] = f"{float(df[['TEMP','PSAL']].dropna().corr().iloc[0,1]):.3f}" if len(df.dropna(subset=["TEMP","PSAL"])) > 5 else "N/A"

        return result
