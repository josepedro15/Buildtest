import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TrendData {
  date: string;
  value: number;
  target?: number;
  change?: number;
}

interface TrendChartProps {
  title: string;
  data: TrendData[];
  metric: string;
  color?: string;
  showTarget?: boolean;
  showArea?: boolean;
  height?: number;
  className?: string;
}

export function TrendChart({ 
  title, 
  data, 
  metric, 
  color = "#3b82f6", 
  showTarget = false,
  showArea = false,
  height = 300,
  className 
}: TrendChartProps) {
  // Calcular tendência
  const calculateTrend = () => {
    if (data.length < 2) return { trend: 'neutral', percentage: 0 };
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    return {
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.abs(change)
    };
  };

  const trend = calculateTrend();

  // Formatar dados para o gráfico
  const chartData = data.map(item => ({
    ...item,
    date: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
    formattedValue: item.value.toLocaleString('pt-BR'),
    formattedChange: item.change ? `${item.change > 0 ? '+' : ''}${item.change.toFixed(1)}%` : undefined
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-lg font-bold" style={{ color }}>
            {data.formattedValue}
          </p>
          {data.formattedChange && (
            <p className={`text-sm ${data.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.formattedChange}
            </p>
          )}
          {showTarget && data.target && (
            <p className="text-sm text-muted-foreground">
              Meta: {data.target.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = () => {
    switch (trend.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">
              {metric} - Últimos {data.length} dias
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}
              {trend.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {showArea ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
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
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${title})`}
                />
                {showTarget && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
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
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={3}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                />
                {showTarget && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
