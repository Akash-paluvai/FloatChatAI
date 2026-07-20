"use client";

import React from 'react';
import type { EquationPayload } from '../types';
import { ChartDisplay } from './ChartDisplay';

interface EquationDisplayProps {
    payload: EquationPayload;
}

export const EquationDisplay: React.FC<EquationDisplayProps> = ({ payload }) => {
    const { title, equation, explanation, chartPayload } = payload;

    const parseEquation = (eq: string): { slope: number; intercept: number } | null => {
        // Matches "y = m * x + b" or "y = m * x - b"
        const match = eq.match(/=\s*(-?[\d.]+)\s*\*.+\s*([+\-]\s*[\d.]+)/);
        if (match && match[1] && match[2]) {
            const slope = parseFloat(match[1]);
            const intercept = parseFloat(match[2].replace(/\s/g, ''));
            return { slope, intercept };
        }
        return null;
    };

    const model = parseEquation(equation);
    let annotatedChartPayload = chartPayload;

    if (model && chartPayload && chartPayload.data.length > 0) {
        const { data, config } = chartPayload;
        const xKey = config.xAxisKey;
        
        const xValues = data.map(d => d[xKey]);
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);

        const minY = model.slope * minX + model.intercept;
        const maxY = model.slope * maxX + model.intercept;
        
        const annotations = [{
            type: 'line' as const,
            start: [minX, minY],
            end: [maxX, maxY],
            style: {
                stroke: '#f59e0b', // A nice amber/orange color
                lineWidth: 2,
                lineDash: [4, 4],
            },
        }];
        
        annotatedChartPayload = {
            ...chartPayload,
            config: {
                ...chartPayload.config,
                annotations,
            }
        };
    }
    
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary text-center">{title}</h3>
            <div className="p-3 bg-ocean-light rounded-lg text-center">
                 <p className="font-mono text-base text-accent-light tracking-wide">{equation}</p>
            </div>
            <p className="text-xs text-text-secondary px-1 italic">{explanation}</p>
            {annotatedChartPayload && (
                 <div className="h-64">
                    <ChartDisplay payload={annotatedChartPayload} isScatter={true} />
                 </div>
            )}
        </div>
    );
};