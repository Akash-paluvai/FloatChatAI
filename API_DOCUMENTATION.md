# 📡 FloatChat AI — REST API Documentation

FloatChat provides a high-speed, asynchronous REST API built with FastAPI. All API responses follow a standardized JSON envelope structure with correlation `X-Request-ID` tracking for auditability and diagnostic telemetry.

---

## 🌐 Base URL & Interactive Docs

- **Base Endpoint URL**: `http://127.0.0.1:8000/api/v1`
- **OpenAPI Interactive UI (Swagger)**: [http://127.0.0.1:8000/api/v1/docs](http://127.0.0.1:8000/api/v1/docs)
- **ReDoc Documentation**: [http://127.0.0.1:8000/api/v1/redoc](http://127.0.0.1:8000/api/v1/redoc)

---

## 📦 Standard API Response Envelope

Every endpoint returns responses wrapped in the standardized `APIResponse[T]` envelope:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "metadata": {
    "timestamp": "2026-07-31T00:00:00.000000+00:00",
    "version": "v1",
    "request_id": "req_a1b2c3d4e5"
  }
}
```

---

## 🛠️ Endpoints Reference

### 1. `POST /api/v1/chat` — Conversational & Scientific Query Execution

Main AI endpoint for executing natural language oceanographic queries. Translates user prompts into spatial/temporal bounding box filters, selective PyArrow columnar Parquet reads, thermocline/salinity analytics calculations, multi-chart Plotly specifications, and plain-language summaries.

#### Request Body
```json
{
  "message": "Show temperature near Bay of Bengal",
  "session_id": "sess_12345"
}
```

#### Curl Command
```bash
curl -X POST http://127.0.0.1:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show temperature near Bay of Bengal"}'
```

#### Response Example
```json
{
  "success": true,
  "message": "Query executed successfully",
  "data": {
    "response_text": "## Bay Of Bengal — Temperature Analysis\n\n**Key Findings:**\n- **Average temperature**: 12.60°C (σ = 7.88°C)\n- **Temperature range**: 2.66°C to 28.04°C\n- **Depth coverage**: 0.4m – 2020.9m\n- **Thermocline zone**: 85m – 165m\n- **Total observations**: 2,000\n\n**Summary**: Across 2,000 measurements in Bay Of Bengal...",
    "viz_spec": [
      {
        "chart_type": "depth_profile",
        "title": "Depth Profile: TEMP in Bay of Bengal",
        "data": [
          {
            "x": [28.04, 12.60, 2.66],
            "y": [0.4, 500.0, 2020.9],
            "type": "scatter",
            "mode": "lines+markers",
            "name": "Temperature Profile"
          }
        ],
        "layout": {
          "title": "Depth Profile: TEMP in Bay of Bengal",
          "yaxis": { "autorange": "reversed", "title": "Depth (m)" },
          "xaxis": { "title": "Temperature (°C)" }
        }
      }
    ],
    "analytics_summary": {
      "region_name": "Bay of Bengal",
      "total_observations": 2000,
      "avg_temp": "12.60°C",
      "min_temp": "2.66°C",
      "max_temp": "28.04°C",
      "thermocline_gradient_depth": "85m – 165m",
      "spatial_centroid": "13.20°N, 84.68°E"
    },
    "sql_query": "SELECT p.latitude, p.longitude, m.depth_m, m.temperature_c FROM argo_profiles p JOIN argo_measurements m ON m.profile_id = p.id WHERE ST_Contains(ST_MakeEnvelope(80, 5, 95, 22, 4326), ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326)) ORDER BY m.depth_m ASC LIMIT 50;",
    "cited_source_files": [
      "20220103_prof.nc"
    ],
    "suggested_followups": [
      "Show depth profile in Bay of Bengal",
      "Generate T-S diagram for Bay of Bengal",
      "Compare 2022 vs 2024 temperature trends"
    ]
  },
  "metadata": {
    "timestamp": "2026-07-31T00:00:00.000000+00:00",
    "version": "v1",
    "request_id": "req_88f921a1bc"
  }
}
```

---

### 2. `GET /api/v1/dashboard/summary` — Global Catalog Telemetry & Dataset Repository

Returns catalog-wide statistics aggregated across all 36 monthly Parquet files (~54 Million observations), spatial bounds, date ranges, monthly dataset file sizes, and sample statistics.

#### Curl Command
```bash
curl -s http://127.0.0.1:8000/api/v1/dashboard/summary
```

#### Response Example
```json
{
  "success": true,
  "message": "Dashboard summary generated from real parquet catalog",
  "data": {
    "total_parquet_files": 36,
    "total_catalog_entries": 36,
    "estimated_total_observations": 54000000,
    "time_range": {
      "start": "2022-01-01T00:00:00",
      "end": "2024-12-22T00:00:00"
    },
    "spatial_bounds": {
      "lat_min": -40.0,
      "lat_max": 26.8,
      "lon_min": 30.0,
      "lon_max": 110.0
    },
    "sample_statistics": {
      "sample_file": "2024_08_MINIMAL.parquet",
      "sample_rows": 905858,
      "mean_surface_temp": 24.2,
      "mean_salinity": 33.91,
      "depth_range": "0 – 5131.0m",
      "unique_positions": 1282
    },
    "datasets": [
      {
        "file_name": "2022_01_MINIMAL.parquet",
        "size_mb": 6.2,
        "n_profiles_est": 0,
        "lat_range": "-39.869 – 25.53076",
        "lon_range": "30.86684 – 109.9503",
        "time_range": "2022-01-01T00:29:52.800000 – 2022-01-26T20:43:46.272000"
      }
    ],
    "regions": [
      {
        "name": "Bay of Bengal",
        "bbox": [5, 80, 22, 95],
        "description": "Tropical semi-enclosed basin, riverine-influenced low salinity"
      },
      {
        "name": "Arabian Sea",
        "bbox": [5, 50, 25, 78],
        "description": "Evaporation-dominated, high salinity, strong monsoon dynamics"
      }
    ],
    "data_format": "Apache Parquet (columnar)",
    "source": "ARGO Global Data Assembly Center (GDAC)"
  }
}
```

---

### 3. `GET /api/v1/dashboard/region-stats/{region_name}` — Regional Real Data Statistics

Computes real-time statistics directly from Parquet files for a named ocean region (e.g., `Bay of Bengal`, `Arabian Sea`, `Southern Ocean`, `Equatorial Indian Ocean`).

#### Path Parameters
- `region_name` (string, required): URL-encoded name of the ocean region.

#### Curl Command
```bash
curl -s "http://127.0.0.1:8000/api/v1/dashboard/region-stats/Arabian%20Sea"
```

#### Response Example
```json
{
  "success": true,
  "message": "Region stats for Arabian Sea",
  "data": {
    "region_name": "Arabian Sea",
    "total_observations": 2000,
    "avg_temp": "12.81°C",
    "min_temp": "3.07°C",
    "max_temp": "28.33°C",
    "std_temp": "5.25°C",
    "spatial_centroid": "11.40°N, 69.37°E",
    "lat_range": "11.16° – 11.64°",
    "lon_range": "68.88° – 69.88°",
    "depth_range": "4.2m – 1997.3m",
    "time_range": "2022-01-03 to 2022-01-03",
    "thermocline_gradient_depth": "98m – 178m",
    "unique_profiles": 1,
    "cited_source_files": [
      "20220103_prof.nc"
    ]
  }
}
```

---

### 4. `GET /api/v1/health` — System Health & Telemetry

Diagnostic health check endpoint returning system status, application version, environment, server uptime in seconds, and service dependency indicators.

#### Curl Command
```bash
curl -s http://127.0.0.1:8000/api/v1/health
```

#### Response Example
```json
{
  "success": true,
  "message": "FloatChat Backend Operational",
  "data": {
    "status": "operational",
    "app_name": "FloatChat",
    "version": "1.0.0",
    "environment": "development",
    "uptime_seconds": 1981.15,
    "dependencies": {
      "database": "configured_placeholder",
      "redis_cache": "configured_placeholder",
      "vector_db": "configured_placeholder"
    }
  },
  "metadata": {
    "timestamp": "2026-07-31T00:00:00.000000+00:00",
    "version": "v1",
    "request_id": "req_c48fe0e6a4"
  }
}
```
