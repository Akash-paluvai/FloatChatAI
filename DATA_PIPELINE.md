# 🌊 FloatChat AI — Scientific Data Pipeline & Analytics Engine

This document provides a technical deep-dive into FloatChat's scientific data ingestion, out-of-core Parquet dataset pruning, physical oceanography analytics engine, and Plotly visualization generation.

---

## 🏛️ Data Ingestion & Storage Architecture

FloatChat processes real oceanographic observations sourced from the **ARGO Global Data Assembly Center (GDAC)**. The raw NetCDF files (`.nc`) collected by autonomous drifting buoys are converted into optimized **columnar Apache Parquet archives** partitioned by month:

```
ARGO GDAC NetCDF Archives (.nc)
              │
              ▼
  Multi-Resolution Chunker & Cleaner
              │
              ▼
  Apache Parquet Monthly Archives (.parquet)
  (SIH2025/Data/argo_prototype_parquet/2022_01_MINIMAL.parquet ... 2024_12_MINIMAL.parquet)
              │
              ▼
  Catalog Bounding Box Index
  (SIH2025/Data/argo_metadata_catalog.csv)
```

---

## 📊 Dataset Schema Reference

Each monthly Parquet file contains the following primary physical oceanography attributes:

| Column Name | Data Type | Units | Physical Description |
| :--- | :--- | :--- | :--- |
| `TEMP` / `temperature_c` | Float32 / Float64 | °C | Sea water temperature in degrees Celsius |
| `PSAL` / `salinity_psu` | Float32 / Float64 | PSU | Practical Salinity Units |
| `DEPTH_M` / `PRES` | Float32 / Float64 | meters (m) | Measurement depth below sea surface |
| `LATITUDE` | Float64 | °N / °S | Geographical latitude (-90.0° to +90.0°) |
| `LONGITUDE` | Float64 | °E / °W | Geographical longitude (-180.0° to +180.0°) |
| `JULD` / `time` | Timestamp / ISO-8601 | UTC | Date and time of profile measurement cycle |
| `platform_number` / `wmo_id` | String / Integer | ID | Unique WMO ARGO float identifier |

---

## ⚡ Out-of-Core Data Plan Execution Flow

FloatChat evaluates queries over **54+ Million observations** across 36 Parquet dataset files without loading unnecessary data into memory:

```
User Query ("Show temperature in Bay of Bengal")
                      │
                      ▼
 1. Query Planner Service (`query_planner_service.py`)
    - Identifies Intent: `TEMPERATURE`
    - Resolves Bounding Box: [5°N, 80°E, 22°N, 95°E]
    - Extracts Time/Depth filters
                      │
                      ▼
 2. Metadata Catalog Pruner (`data_pipeline_service.py`)
    - Scans `argo_metadata_catalog.csv` (lat_min, lat_max, lon_min, lon_max, juld_min, juld_max)
    - Prunes non-overlapping Parquet files
                      │
                      ▼
 3. PyArrow Selective Column Read
    - Reads ONLY `[TEMP, PSAL, DEPTH_M, LATITUDE, LONGITUDE]` columns from candidate files
    - Filters rows by latitude, longitude, depth, and time in memory
                      │
                      ▼
 4. Ocean Analytics Engine (`analytics_engine.py`)
    - Computes mean, std, min, max, centroid
    - Calculates thermocline gradient zone (dT/dz)
    - Determines salinity regimes and inter-annual deltas
                      │
                      ▼
 5. Plotly Viz Engine & Synthesizer (`visualization_engine.py` & `mock_provider.py`)
    - Generates inverted depth profile curve & histogram
    - Outputs Markdown text with GDAC citations & plain text summary
```

---

## 🔬 Oceanographic Analytics Formulas

### 1. Thermocline Gradient Detection ($\frac{dT}{dz}$)
The thermocline is defined as the depth range where water temperature drops most rapidly with increasing depth. FloatChat computes the vertical thermal gradient between adjacent depth measurements:

$$\frac{dT}{dz} = \frac{T(z_{i+1}) - T(z_i)}{z_{i+1} - z_i}$$

The thermocline boundary is identified by locating the maximum negative gradient $|\frac{dT}{dz}|_{\max}$ in the upper $0\text{m} - 500\text{m}$ water column.

---

### 2. Salinity Regime Classification
Salinity measurements ($S$) are evaluated against regional oceanographic baselines:

- **High Salinity Regime ($S_{\text{mean}} > 35.5\text{ PSU}$)**: Characterizes evaporation-dominated basins such as the Arabian Sea High Salinity Water (ASHSW).
- **Low Salinity Regime ($S_{\text{mean}} < 34.0\text{ PSU}$)**: Characterizes riverine runoff-influenced surface layers such as the Bay of Bengal.
- **Normal Oceanic Regime ($34.0\text{ PSU} \le S_{\text{mean}} \le 35.5\text{ PSU}$)**: Open ocean tropical/subtropical waters.

---

### 3. Inter-Annual Comparative Delta ($\Delta T, \Delta S$)
For multi-year comparisons (e.g., $2022$ vs $2024$), FloatChat computes the exact inter-annual parameter shift:

$$\Delta T = \bar{T}_{\text{Year}_2} - \bar{T}_{\text{Year}_1}$$

- If $\Delta T > +0.10^\circ\text{C} \implies$ **Warming Trend**
- If $\Delta T < -0.10^\circ\text{C} \implies$ **Cooling Trend**
- If $|\Delta T| \le 0.10^\circ\text{C} \implies$ **Stable Regime**
