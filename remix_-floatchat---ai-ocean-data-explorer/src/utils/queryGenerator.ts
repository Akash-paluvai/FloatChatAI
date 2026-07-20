import { ChatMessage } from '../types/ocean';
import { MOCK_ARGO_FLOATS } from './mockOceanData';

export function processUserQuery(userText: string): ChatMessage {
  const textLower = userText.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Response for Bay of Bengal / Temperature query
  if (textLower.includes('bay of bengal') || textLower.includes('temperature') || textLower.includes('profile')) {
    const points = MOCK_ARGO_FLOATS.filter(f => f.region === 'Bay of Bengal').map(f => ({
      id: f.id,
      lat: f.latitude,
      lon: f.longitude,
      temp: f.profiles[0].measurements[0].temperature,
      salinity: f.profiles[0].measurements[0].salinity,
      floatId: f.platformNumber
    }));

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: "I analyzed 142 ARGO float profiles in the Bay of Bengal region for early 2024. The upper ocean (0–50m) shows a strong warm layer averaging 28.5°C to 29.4°C with steep thermocline gradient between 50m and 200m depth.",
      generatedSql: `SELECT f.platform_number, p.latitude, p.longitude, m.depth_m, m.temperature_c, m.salinity_psu
FROM argo_profiles p
JOIN argo_floats f ON p.float_id = f.id
JOIN argo_measurements m ON m.profile_id = p.id
WHERE ST_Contains(ST_MakeEnvelope(80.0, 10.0, 95.0, 22.0, 4326), ST_SetSRID(ST_MakePoint(p.longitude, p.latitude), 4326))
  AND p.juld >= '2024-01-01'
ORDER BY m.depth_m ASC;`,
      ragContext: {
        retrievedDocs: 18,
        matchedFloatIds: ['2902745', '2903321'],
        relevanceScore: 0.96
      },
      mcpToolCall: {
        toolName: 'mcp_argo_postgis_query',
        arguments: { bbox: [80.0, 10.0, 95.0, 22.0], startDate: '2024-01-01', variables: ['TEMP', 'PSAL'] },
        status: 'success'
      },
      mapData: {
        title: "Bay of Bengal Active ARGO Trajectories & Profiles",
        points,
        center: [16.5, 88.8],
        zoom: 6
      },
      chartData: {
        title: "Temperature Profile vs Depth (Bay of Bengal 2024)",
        type: "depth-profile",
        xAxisLabel: "Temperature (°C)",
        yAxisLabel: "Depth (meters)",
        data: [
          { depth: 5, temp: 29.4, tempArabian: 30.1 },
          { depth: 25, temp: 28.9, tempArabian: 29.8 },
          { depth: 50, temp: 26.8, tempArabian: 27.5 },
          { depth: 100, temp: 22.1, tempArabian: 23.2 },
          { depth: 200, temp: 16.4, tempArabian: 17.1 },
          { depth: 500, temp: 10.2, tempArabian: 11.4 },
          { depth: 1000, temp: 6.8, tempArabian: 7.2 },
          { depth: 1500, temp: 4.2, tempArabian: 4.8 },
          { depth: 2000, temp: 2.9, tempArabian: 3.2 }
        ]
      },
      confidenceScore: 0.96,
      sources: ['INCOIS ARGO NetCDF DB v3.4', 'ChromaDB Vector Index #BOB-2024', 'PostGIS Geometry Filter']
    };
  }

  // Response for Salinity or Arabian Sea query
  if (textLower.includes('salinity') || textLower.includes('arabian sea')) {
    const points = MOCK_ARGO_FLOATS.filter(f => f.region === 'Arabian Sea').map(f => ({
      id: f.id,
      lat: f.latitude,
      lon: f.longitude,
      temp: f.profiles[0].measurements[0].temperature,
      salinity: f.profiles[0].measurements[0].salinity,
      floatId: f.platformNumber
    }));

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: "Salinity analysis for Arabian Sea (Float 1901789) indicates high surface salinity (~36.4-36.8 PSU) caused by intense evaporation and high Arabian Sea High Salinity Water mass (ASHSW) formation in top 100m.",
      generatedSql: `SELECT p.date, m.depth_m, m.salinity_psu, m.temperature_c 
FROM argo_measurements m
JOIN argo_profiles p ON m.profile_id = p.id
WHERE p.region = 'Arabian Sea' AND m.depth_m BETWEEN 0 AND 200
ORDER BY p.date DESC LIMIT 500;`,
      ragContext: {
        retrievedDocs: 14,
        matchedFloatIds: ['1901789'],
        relevanceScore: 0.94
      },
      mcpToolCall: {
        toolName: 'mcp_argo_salinity_inspector',
        arguments: { region: 'Arabian Sea', maxDepth: 200 },
        status: 'success'
      },
      mapData: {
        title: "Arabian Sea Float Trajectory (1901789)",
        points,
        center: [12.1, 65.4],
        zoom: 6
      },
      chartData: {
        title: "Salinity Profile vs Depth (Arabian Sea vs Bay of Bengal)",
        type: "salinity-dist",
        xAxisLabel: "Salinity (PSU)",
        yAxisLabel: "Depth (meters)",
        data: [
          { depth: 5, salinityArabian: 36.4, salinityBoB: 33.2 },
          { depth: 25, salinityArabian: 36.6, salinityBoB: 33.5 },
          { depth: 50, salinityArabian: 36.8, salinityBoB: 34.1 },
          { depth: 100, salinityArabian: 36.5, salinityBoB: 34.8 },
          { depth: 200, salinityArabian: 35.9, salinityBoB: 35.1 },
          { depth: 500, salinityArabian: 35.4, salinityBoB: 35.0 },
          { depth: 1000, salinityArabian: 35.1, salinityBoB: 34.9 }
        ]
      },
      confidenceScore: 0.95,
      sources: ['NOAA Global ARGO GDAC', 'PostGIS Salinity Grid', 'FAISS Index #ASHSW-2024']
    };
  }

  // Response for Oxygen or T-S Diagram query
  if (textLower.includes('oxygen') || textLower.includes('diagram') || textLower.includes('compare')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      text: "T-S (Temperature vs Salinity) and Oxygen comparison demonstrates distinct water mass signatures. Arabian Sea features a severe Oxygen Minimum Zone (OMZ) at 200m depth (<20 µmol/kg), whereas Bay of Bengal maintains slightly higher oxygen due to riverine influx stratification.",
      generatedSql: `SELECT m.temperature_c, m.salinity_psu, m.oxygen_umol, p.region
FROM argo_measurements m
JOIN argo_profiles p ON m.profile_id = p.id
WHERE p.region IN ('Arabian Sea', 'Bay of Bengal')
ORDER BY p.date DESC;`,
      ragContext: {
        retrievedDocs: 24,
        matchedFloatIds: ['2902745', '1901789'],
        relevanceScore: 0.98
      },
      mcpToolCall: {
        toolName: 'mcp_compute_ts_diagram',
        arguments: { floatIds: ['2902745', '1901789'] },
        status: 'success'
      },
      chartData: {
        title: "T-S (Temperature vs Salinity) Curve",
        type: "ts-diagram",
        xAxisLabel: "Salinity (PSU)",
        yAxisLabel: "Temperature (°C)",
        data: [
          { salinity: 33.2, tempBoB: 29.4, tempAS: null },
          { salinity: 34.1, tempBoB: 26.8, tempAS: null },
          { salinity: 34.8, tempBoB: 22.1, tempAS: null },
          { salinity: 35.1, tempBoB: 16.4, tempAS: 17.1 },
          { salinity: 36.4, tempBoB: null, tempAS: 30.1 },
          { salinity: 36.8, tempBoB: null, tempAS: 27.5 },
          { salinity: 35.9, tempBoB: null, tempAS: 17.1 },
        ]
      },
      confidenceScore: 0.97,
      sources: ['CSIRO Hydrographic Data', 'INCOIS Marine Portal', 'OpenAI Embedding Vector DB']
    };
  }

  // Fallback response for general queries
  const points = MOCK_ARGO_FLOATS.map(f => ({
    id: f.id,
    lat: f.latitude,
    lon: f.longitude,
    temp: f.profiles[0].measurements[0].temperature,
    salinity: f.profiles[0].measurements[0].salinity,
    floatId: f.platformNumber
  }));

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp,
    text: `I synthesized data across ${MOCK_ARGO_FLOATS.length} active ARGO floats in your target domain. Here are the latest surface measurements, geospatial coordinates, and depth profiles retrieved via Vector Search & PostGIS.`,
    generatedSql: `SELECT platform_number, latitude, longitude, last_update_date FROM argo_floats WHERE status = 'Active';`,
    ragContext: {
      retrievedDocs: 8,
      matchedFloatIds: MOCK_ARGO_FLOATS.map(f => f.platformNumber),
      relevanceScore: 0.92
    },
    mcpToolCall: {
      toolName: 'mcp_general_ocean_retriever',
      arguments: { query: userText },
      status: 'success'
    },
    mapData: {
      title: "Global Active ARGO Floats Overview",
      points,
      center: [10.0, 78.0],
      zoom: 4
    },
    chartData: {
      title: "Regional Temperature Profile Summary",
      type: "time-series",
      xAxisLabel: "Depth (m)",
      yAxisLabel: "Temperature (°C)",
      data: [
        { depth: 5, BoB: 29.4, AS: 30.1, IO: 28.2 },
        { depth: 100, BoB: 22.1, AS: 23.2, IO: 20.5 },
        { depth: 500, BoB: 10.2, AS: 11.4, IO: 8.9 },
        { depth: 1000, BoB: 6.8, AS: 7.2, IO: 5.1 }
      ]
    },
    confidenceScore: 0.93,
    sources: ['ARGO GDAC Server', 'PostGIS Geometry Index']
  };
}
