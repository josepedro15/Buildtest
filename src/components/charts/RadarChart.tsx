import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';

interface RadarData {
  metric: string;
  value: number;
  target?: number;
  maxValue?: number;
}

interface RadarChartProps {
  title: string;
  data: RadarData[];
  description?: string;
  height?: number;
  className?: string;
  showTarget?: boolean;
  color?: string;
}

export function RadarChart({ 
  title, 
  data, 
  description,
  height = 300,
  className,
  showTarget = false,
  color = "#3b82f6"
}: RadarChartProps) {
  // Normalizar dados para o radar chart (0-100)
  const maxValue = Math.max(...data.map(item => item.maxValue || item.value));
  
  const chartData = data.map(item => ({
    ...item,
    normalizedValue: ((item.value / (item.maxValue || maxValue)) * 100),
    normalizedTarget: item.target ? ((item.target / (item.maxValue || maxValue)) * 100) : undefined,
    formattedValue: item.value.toLocaleString('pt-BR'),
    formattedTarget: item.target?.toLocaleString('pt-BR')
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-lg font-bold" style={{ color }}>
              {data.formattedValue}
            </p>
            <p className="text-sm text-muted-foreground">
              {data.normalizedValue.toFixed(1)}% do máximo
            </p>
            {showTarget && data.target && (
              <p className="text-sm text-muted-foreground">
                Meta: {data.formattedTarget} ({data.normalizedTarget?.toFixed(1)}%)
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Radar
                name="Performance Atual"
                dataKey="normalizedValue"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              {showTarget && (
                <Radar
                  name="Meta"
                  dataKey="normalizedTarget"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
