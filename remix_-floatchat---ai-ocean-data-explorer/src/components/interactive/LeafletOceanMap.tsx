import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapPoint {
  id: string;
  lat: number;
  lon: number;
  temp: number;
  salinity: number;
  floatId: string;
}

interface LeafletOceanMapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  title?: string;
}

export const LeafletOceanMap: React.FC<LeafletOceanMapProps> = ({
  points,
  center = [14.5, 85.0],
  zoom = 5,
  height = '380px',
  title
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Map with dark tiles
    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false
    });

    // Dark CartoDB tile layer for premium deep ocean theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Create polyline connecting trajectory points
    if (points.length > 1) {
      const latLngs = points.map(p => [p.lat, p.lon] as [number, number]);
      L.polyline(latLngs, {
        color: '#5EE6FF',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 10'
      }).addTo(map);
    }

    // Custom Glowing Circle Markers for ARGO Floats
    points.forEach(p => {
      const marker = L.circleMarker([p.lat, p.lon], {
        radius: 8,
        fillColor: p.temp > 28 ? '#00B4FF' : '#5EE6FF',
        color: '#FFFFFF',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      marker.bindPopup(`
        <div style="background:#031B2E; color:#FFF; padding:8px; border-radius:8px; border:1px solid #5EE6FF; font-family:sans-serif; font-size:12px;">
          <strong style="color:#5EE6FF;">ARGO Float #${p.floatId}</strong><br/>
          Lat: ${p.lat.toFixed(2)}°, Lon: ${p.lon.toFixed(2)}°<br/>
          Temp: <span style="color:#38BDF8;">${p.temp}°C</span><br/>
          Salinity: ${p.salinity} PSU
        </div>
      `);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [points, center, zoom]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#5EE6FF]/20 shadow-2xl glass-panel">
      {title && (
        <div className="bg-[#031B2E]/90 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <span className="font-heading font-semibold text-xs text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5EE6FF] animate-ping" />
            {title}
          </span>
          <span className="text-[10px] font-mono text-[#A8C7D8]">Interactive Map Layer</span>
        </div>
      )}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />
    </div>
  );
};
