# FloatChat AI Explorer — Frontend Client 🌊

The frontend interface for FloatChat AI is a modern React 19 web application for exploring real ARGO ocean observations through conversational AI, dynamic interactive Plotly charts, live metric cards, and a multi-tab ocean analytics dashboard.

---

## 🎨 Features & Capabilities

- **Interactive Plotly Visualizations**:
  - Inverted depth profiles ($0\text{m} \to 2000\text{m}$) showing thermocline drop.
  - Temperature & Salinity distribution histograms.
  - T-S diagram scatter plots.
  - Inter-annual multi-year overlay comparisons.
- **Data-Driven Chat Explorer (`/demo`)**:
  - Live query processing with streaming status.
  - Real-time stat grid cards (observations, mean temp, thermocline zone, centroid coordinates).
  - Rich Markdown text rendering with plain-language summary paragraphs.
  - Dynamic follow-up suggestion chips.
  - PostGIS SQL query preview.
- **Ocean Analytics Dashboard (`/dashboard`)**:
  - **Overview Tab**: Dataset size by month chart, spatial coverage bounds, region quick-navigation.
  - **Datasets Tab**: Interactive catalog table listing 36 Parquet dataset files, file sizes, latitude/longitude bounds, and temporal ranges.
  - **Region Explorer Tab**: Live statistics computed directly from Parquet files for Bay of Bengal, Arabian Sea, Southern Ocean, and Equatorial Indian Ocean.

---

## 🔑 Environment Configuration

Create a `.env` file in the frontend root directory if you need to point to a custom API URL:

```ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

---

## 🛠️ Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The application will run at `http://localhost:5173`.
