import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface BarData {
  name: string;
  value: number;
  target?: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  data: BarData[];
  description?: string;
  height?: number;
  className?: string;
  showTarget?: boolean;
  horizontal?: boolean;
  color?: string;
}

export function BarChart({ 
  title, 
  data, 
  description,
  height = 300,
  className,
  showTarget = false,
  horizontal = false,
  color = "#3b82f6"
}: BarChartProps) {
  // Formatar dados para o gráfico
  const chartData = data.map(item => ({
    ...item,
    formattedValue: item.value.toLocaleString('pt-BR'),
    formattedTarget: item.target?.toLocaleString('pt-BR'),
    color: item.color || color
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-lg font-bold" style={{ color: data.color }}>
              {data.formattedValue}
            </p>
            {showTarget && data.target && (
              <p className="text-sm text-muted-foreground">
                Meta: {data.formattedTarget}
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
            <RechartsBarChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout={horizontal ? 'horizontal' : 'vertical'}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              {horizontal ? (
                <>
                  <XAxis 
                    type="number"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString('pt-BR')}
                  />
                  <YAxis 
                    dataKey="name"
                    type="category"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                </>
              ) : (
                <>
                  <XAxis 
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString('pt-BR')}
                  />
                </>
              )}
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill={color}
                radius={[4, 4, 0, 0]}
              />
              {showTarget && (
                <Bar 
                  dataKey="target" 
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  opacity={0.7}
                />
              )}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
