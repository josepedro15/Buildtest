import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';

interface PieData {
  name: string;
  value: number;
  color: string;
  icon?: string;
}

interface PieChartProps {
  title: string;
  data: PieData[];
  description?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showPercentage?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
];

export function PieChart({ 
  title, 
  data, 
  description,
  height = 300,
  className,
  showLegend = true,
  showPercentage = true
}: PieChartProps) {
  // Calcular total para porcentagens
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Adicionar porcentagens aos dados
  const chartData = data.map((item, index) => ({
    ...item,
    percentage: total > 0 ? (item.value / total) * 100 : 0,
    color: item.color || COLORS[index % COLORS.length]
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            {data.icon && <span className="text-lg">{data.icon}</span>}
            <p className="font-medium text-sm">{data.name}</p>
          </div>
          <p className="text-lg font-bold" style={{ color: data.color }}>
            {data.value.toLocaleString('pt-BR')}
          </p>
          {showPercentage && (
            <p className="text-sm text-muted-foreground">
              {data.percentage.toFixed(1)}% do total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    if (!showLegend) return null;
    
    return (
      <div className="flex flex-wrap gap-3 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">
              {entry.value}
            </span>
            {showPercentage && (
              <span className="text-xs text-muted-foreground">
                ({chartData[index]?.percentage.toFixed(1)}%)
              </span>
            )}
          </div>
        ))}
      </div>
    );
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
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => 
                  showPercentage ? `${name}: ${percentage?.toFixed(1)}%` : name
                }
                outerRadius={height * 0.35}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend content={<CustomLegend />} />}
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
