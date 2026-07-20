"use client";

import React from 'react';
import type { ChartPayload } from '../types';
// Fix: The antd chart components are now in '@ant--design/plots'
import { Line, Column } from '@ant-design/plots';
import type { LineConfig, ColumnConfig } from '@ant-design/plots';

interface ChartDisplayProps {
    payload: ChartPayload | null;
    isScatter?: boolean;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ payload, isScatter = false }) => {
    if (!payload) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-text-secondary">Charts will appear here when you ask for a visualization.</p>
            </div>
        );
    }

    const { title, data, config: chartConfig } = payload;

    const commonConfig = {
        data,
        xField: chartConfig.xAxisKey,
        yField: chartConfig.yAxisKey,
        theme: 'dark' as const,
        autoFit: true,
        height: 200,
        xAxis: {
            title: {
                text: chartConfig.xAxisKey.charAt(0).toUpperCase() + chartConfig.xAxisKey.slice(1),
                style: { fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter, sans-serif' }
            },
            label: {
                style: { fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter, sans-serif' }
            },
            line: { style: { stroke: '#334155' } },
            tickLine: { style: { stroke: '#334155' } },
        },
        yAxis: {
             title: {
                text: chartConfig.yAxisKey.charAt(0).toUpperCase() + chartConfig.yAxisKey.slice(1),
                style: { fill: '#94a3b8', fontSize: 12, fontFamily: 'Inter, sans-serif' }
            },
            label: {
                style: { fill: '#94a3b8', fontSize: 10, fontFamily: 'Inter, sans-serif' }
            },
            grid: {
                line: {
                    style: { stroke: 'rgba(51, 65, 85, 0.5)', lineDash: [4, 2] }
                }
            }
        },
        tooltip: {
            domStyles: {
                'g2-tooltip': {
                    backgroundColor: '#0f172a',
                    color: '#e2e8f0',
                    border: '1px solid #1e293b',
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: 'none',
                },
            },
        },
        legend: false,
        padding: 'auto',
    };

    const lineConfig: LineConfig = {
        ...commonConfig,
        color: '#06b6d4',
        point: {
            size: 3,
            shape: 'circle',
            style: {
                fill: '#06b6d4',
                stroke: '#fff',
                lineWidth: 1.5,
            },
        },
        smooth: !isScatter,
        line: isScatter ? { style: { lineWidth: 0 } } : { style: {}},
        annotations: chartConfig.annotations,
    };

    const columnConfig: ColumnConfig = {
        ...commonConfig,
        color: '#06b6d4',
    };

    return (
        <div className="flex flex-col h-full w-full">
            <h3 className="text-sm font-semibold text-text-primary text-center pb-2">
                {title}
            </h3>
            <div className="flex-grow">
                {chartConfig.chartType === 'line' 
                    ? <Line {...lineConfig} /> 
                    : <Column {...columnConfig} />
                }
            </div>
        </div>
    );
};