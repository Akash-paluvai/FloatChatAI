"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { MapPoint } from '../types';
import { CloseIcon } from './icons/CloseIcon';

// Declare Leaflet global 'L' to satisfy TypeScript since it's loaded from a CDN
declare const L: any;

type Metric = 'temperature' | 'pressure';

interface LeafletMapModalProps {
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

export const LeafletMapModal: React.FC<LeafletMapModalProps> = ({ isOpen, onClose, points }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any | null>(null);
    const markersLayerRef = useRef<any | null>(null);
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
        if (!isOpen || !mapContainerRef.current || typeof L === 'undefined') return;

        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapContainerRef.current, {
                center: [10, 0],
                zoom: 2,
                zoomControl: true,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(mapInstanceRef.current);
            
            setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
        }

        if (markersLayerRef.current) {
            markersLayerRef.current.clearLayers();
        } else {
            markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
        }
        
        points.forEach(point => {
            const value = point[activeMetric];
            const color = valueToColor(value, metricRange.min, metricRange.max, activeMetric);
            const marker = L.circleMarker([point.lat, point.lon], {
                radius: 7,
                fillColor: color,
                color: '#ffffff',
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.9,
            });

            const popupContent = `
                <div class="p-1">
                    <strong class="text-accent-cyan font-semibold">Float ID:</strong> ${point.id}<br>
                    <strong class="text-accent-cyan font-semibold">${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)}:</strong> ${value.toFixed(2)}
                </div>
            `;
            
            marker.bindPopup(popupContent, {
                closeButton: false,
                className: 'custom-leaflet-popup'
            });

            marker.addTo(markersLayerRef.current);
        });

    }, [isOpen, points, activeMetric, metricRange]);

    if (!isOpen) return null;

    const metricConfig = {
        temperature: { unit: '°C' },
        pressure: { unit: 'dbar' }
    };

    const popupStyleFix = `
      .custom-leaflet-popup .leaflet-popup-content-wrapper {
        background-color: #0f172a;
        color: #e2e8f0;
        border: 1px solid #1e293b;
        border-radius: 8px;
        box-shadow: none;
      }
      .custom-leaflet-popup .leaflet-popup-tip {
        background: #1e293b;
      }
      .custom-leaflet-popup .leaflet-popup-content {
        margin: 0;
        padding: 4px;
        font-size: 12px;
        line-height: 1.5;
      }
    `;

    return (
        <div className="fixed inset-0 bg-ocean-deep/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <style>{popupStyleFix}</style>
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
                <div className="flex-grow relative rounded-b-xl overflow-hidden">
                     <div ref={mapContainerRef} className="w-full h-full" />
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