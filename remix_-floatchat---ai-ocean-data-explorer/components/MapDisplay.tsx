
import React, { useState, useMemo } from 'react';
import type { MapPoint } from '../types';
import { WorldMapIcon } from './icons/WorldMapIcon';

interface MapDisplayProps {
    points: MapPoint[];
}

type Metric = 'temperature' | 'pressure';

// Simple equirectangular projection
const project = (lat: number, lon: number, width: number, height: number) => {
    const x = (lon + 180) * (width / 360);
    const y = (lat * -1 + 90) * (height / 180);
    return { x, y };
};

const getMetricRange = (points: MapPoint[], metric: Metric) => {
    if (points.length === 0) return { min: 0, max: 1 };
    const values = points.map(p => p[metric]);
    return { min: Math.min(...values), max: Math.max(...values) };
};

const valueToColor = (value: number, min: number, max: number, metric: Metric): string => {
    const normalized = max === min ? 0.5 : (value - min) / (max - min);
    if (metric === 'temperature') {
        // Blue (cold) to Red (hot)
        const hue = 240 - (normalized * 240);
        return `hsl(${hue}, 80%, 50%)`;
    } else {
        // Light Cyan to Dark Cyan
        const lightness = 70 - (normalized * 40);
        return `hsl(180, 70%, ${lightness}%)`;
    }
};


export const MapDisplay: React.FC<MapDisplayProps> = ({ points }) => {
    const width = 800;
    const height = 400;
    const [activeMetric, setActiveMetric] = useState<Metric>('temperature');

    const { min, max } = useMemo(() => getMetricRange(points, activeMetric), [points, activeMetric]);

    const metricConfig = {
        temperature: { unit: '°C' },
        pressure: { unit: ' dbar' }
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => setActiveMetric('temperature')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${activeMetric === 'temperature' ? 'bg-accent-cyan text-ocean-deep font-semibold' : 'bg-ocean-light hover:bg-slate-600'}`}>
                    Temperature
                </button>
                 <button 
                    onClick={() => setActiveMetric('pressure')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${activeMetric === 'pressure' ? 'bg-accent-cyan text-ocean-deep font-semibold' : 'bg-ocean-light hover:bg-slate-600'}`}>
                    Pressure
                </button>
            </div>
            <div className="relative w-full aspect-[2/1] bg-slate-800 rounded-md overflow-hidden flex items-center justify-center">
                <WorldMapIcon className="absolute inset-0 w-full h-full text-slate-700" />

                {points.length === 0 && (
                    <p className="text-text-secondary z-10">Map data will appear here when you ask for float locations.</p>
                )}

                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="absolute inset-0">
                    {points.map((point) => {
                        const { x, y } = project(point.lat, point.lon, width, height);
                        const value = point[activeMetric];
                        const color = valueToColor(value, min, max, activeMetric);
                        return (
                            <g key={point.id} transform={`translate(${x}, ${y})`}>
                                <circle cx="0" cy="0" r="10" fill={color} opacity="0.4" />
                                <circle cx="0" cy="0" r="5" fill={color} className="stroke-ocean-deep" strokeWidth="1.5" />
                                <text x="12" y="4" fontSize="10" fill="#e2e8f0" className="font-sans font-semibold" style={{ paintOrder: 'stroke', stroke: '#020617', strokeWidth: '3px', strokeLinecap: 'butt', strokeLinejoin: 'miter' }}>
                                    {value}{metricConfig[activeMetric].unit}
                                </text>
                                <title>{`ID: ${point.id}\nLat: ${point.lat}, Lon: ${point.lon}\n${activeMetric}: ${value}`}</title>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};
