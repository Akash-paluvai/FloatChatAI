
import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { MapPoint } from '../types';
import { useGoogleMapsScript } from '../hooks/useGoogleMapsScript';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { CloseIcon } from './icons/CloseIcon';

type Metric = 'temperature' | 'pressure';

interface GoogleMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    points: MapPoint[];
}

const getMetricRange = (points: MapPoint[], metric: Metric) => {
    if (points.length === 0) return { min: 0, max: 1 };
    const values = points.map(p => p[metric]);
    return { min: Math.min(...values), max: Math.max(...values) };
};

const valueToColor = (value: number, min: number, max: number, metric: Metric): string => {
    const normalized = max === min ? 0.5 : (value - min) / (max - min);
    if (metric === 'temperature') {
        // Blue (cold, HSL 240) to Red (hot, HSL 0)
        const hue = 240 - (normalized * 240);
        return `hsl(${hue}, 90%, 60%)`;
    } else {
        // Light Cyan to Dark Cyan
        const lightness = 70 - (normalized * 40);
        return `hsl(180, 80%, ${lightness}%)`;
    }
};

export const GoogleMapModal: React.FC<GoogleMapModalProps> = ({ isOpen, onClose, points }) => {
    const { isLoaded, error } = useGoogleMapsScript();
    const mapRef = useRef<HTMLDivElement>(null);
    // Fix: Use 'any' for Google Maps objects as type definitions are not available.
    const mapInstanceRef = useRef<any | null>(null);
    // Fix: Use 'any' for Google Maps objects as type definitions are not available.
    const markersRef = useRef<any[]>([]);
    const [activeMetric, setActiveMetric] = useState<Metric>('temperature');

    const metricRange = useMemo(() => getMetricRange(points, activeMetric), [points, activeMetric]);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !isLoaded || !mapRef.current) return;

        if (!mapInstanceRef.current) {
            // Fix: Instantiate google.maps.Map via the window object to bypass TypeScript type checking.
            mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
                center: { lat: 10, lng: 0 },
                zoom: 2,
                mapId: 'FLOAT_CHAT_MAP',
                disableDefaultUI: true,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
                    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d1d5db' }] },
                    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
                    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
                    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
                    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#273345' }] },
                    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
                ],
            });
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add new markers
        points.forEach(point => {
            const value = point[activeMetric];
            const color = valueToColor(value, metricRange.min, metricRange.max, activeMetric);
            // Fix: Instantiate google.maps.Marker via the window object to bypass TypeScript type checking.
            const marker = new (window as any).google.maps.Marker({
                position: { lat: point.lat, lng: point.lon },
                map: mapInstanceRef.current,
                icon: {
                    // Fix: Access google.maps.SymbolPath via the window object to bypass TypeScript type checking.
                    path: (window as any).google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: color,
                    fillOpacity: 0.9,
                    strokeColor: '#ffffff',
                    strokeWeight: 1.5,
                },
                title: `ID: ${point.id}\n${activeMetric}: ${value}`,
            });
            markersRef.current.push(marker);
        });

    }, [isOpen, isLoaded, points, activeMetric, metricRange]);

    if (!isOpen) return null;

    const metricConfig = {
        temperature: { unit: '°C' },
        pressure: { unit: 'dbar' }
    };

    return (
        <div className="fixed inset-0 bg-ocean-deep/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full h-full max-w-6xl max-h-[90vh] bg-ocean-mid rounded-xl border border-ocean-light shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex items-center justify-between border-b border-ocean-light flex-shrink-0">
                    <h2 className="text-lg font-bold">ARGO Float Geospatial View</h2>
                    <div className="flex items-center gap-4">
                         <div className="flex gap-2">
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
                        <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors" aria-label="Close map">
                           <CloseIcon />
                        </button>
                    </div>
                </header>
                <div className="flex-grow relative">
                    {!isLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ocean-mid z-10">
                            <LoadingSpinner />
                            <p className="mt-2 text-text-secondary">{error ? error.message : "Loading map..."}</p>
                        </div>
                    )}
                    <div ref={mapRef} className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                 <footer className="p-2 border-t border-ocean-light flex-shrink-0 text-xs text-text-secondary flex justify-center items-center gap-4">
                    <span>Color Scale ({activeMetric}):</span>
                    <div className="w-48 h-4 rounded-full" style={{background: `linear-gradient(to right, ${valueToColor(metricRange.min, metricRange.min, metricRange.max, activeMetric)}, ${valueToColor(metricRange.max, metricRange.min, metricRange.max, activeMetric)})`}}></div>
                    <span className="font-mono">{metricRange.min.toFixed(1)} {metricConfig[activeMetric].unit}</span>
                    <span>to</span>
                     <span className="font-mono">{metricRange.max.toFixed(1)} {metricConfig[activeMetric].unit}</span>
                </footer>
            </div>
        </div>
    );
};
