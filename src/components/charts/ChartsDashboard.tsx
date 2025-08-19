import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Download,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { TrendChart } from './TrendChart';
import { PieChart as PieChartComponent } from './PieChart';
import { BarChart } from './BarChart';
import { RadarChart } from './RadarChart';

interface ChartsDashboardProps {
  dashboardData: any;
  className?: string;
}

export function ChartsDashboard({ dashboardData, className }: ChartsDashboardProps) {
  const [showTargets, setShowTargets] = useState(true);
  const [chartHeight, setChartHeight] = useState(300);

  // Gerar dados simulados para demonstração
  const generateTrendData = (baseValue: number, days: number = 7) => {
    const data = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      // Simular variação com tendência
      const variation = (Math.random() - 0.5) * 0.3; // ±15%
      const value = Math.max(0, baseValue * (1 + variation));
      const change = i > 0 ? ((value - data[i-1].value) / data[i-1].value) * 100 : 0;
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        change: Math.round(change * 10) / 10,
        target: baseValue * 1.1 // Meta 10% acima do valor base
      });
    }
    
    return data;
  };

  // Dados para gráficos
  const attendanceTrendData = generateTrendData(dashboardData?.total_atendimentos || 100, 7);
  const conversionTrendData = generateTrendData(dashboardData?.taxa_conversao || 25, 7);
  const responseTimeTrendData = generateTrendData(dashboardData?.tempo_medio_resposta || 180, 7);

  const intentionsData = [
    { name: "Compra", value: dashboardData?.intencao_compra || 45, color: "#10b981", icon: "🛒" },
    { name: "Dúvida Geral", value: dashboardData?.intencao_duvida_geral || 25, color: "#3b82f6", icon: "❓" },
    { name: "Reclamação", value: dashboardData?.intencao_reclamacao || 15, color: "#ef4444", icon: "⚠️" },
    { name: "Suporte", value: dashboardData?.intencao_suporte || 10, color: "#f59e0b", icon: "🛠️" },
    { name: "Orçamento", value: dashboardData?.intencao_orcamento || 5, color: "#8b5cf6", icon: "💰" }
  ];

  const performanceData = [
    { metric: "Taxa de Conversão", value: dashboardData?.taxa_conversao || 24.5, target: 30, maxValue: 100 },
    { metric: "Tempo de Resposta", value: Math.max(0, 100 - ((dashboardData?.tempo_medio_resposta || 154) / 300) * 100), target: 80, maxValue: 100 },
    { metric: "Qualidade", value: (dashboardData?.nota_media_qualidade || 4.2) * 20, target: 90, maxValue: 100 },
    { metric: "Satisfação", value: 85, target: 90, maxValue: 100 },
    { metric: "Eficiência", value: 78, target: 85, maxValue: 100 }
  ];

  const hourlyData = [
    { name: "8h", value: 15, target: 20 },
    { name: "9h", value: 25, target: 25 },
    { name: "10h", value: 35, target: 30 },
    { name: "11h", value: 40, target: 35 },
    { name: "12h", value: 30, target: 30 },
    { name: "13h", value: 20, target: 25 },
    { name: "14h", value: 35, target: 30 },
    { name: "15h", value: 45, target: 40 },
    { name: "16h", value: 50, target: 45 },
    { name: "17h", value: 40, target: 40 },
    { name: "18h", value: 25, target: 30 }
  ];

  const exportCharts = () => {
    // Implementar exportação de gráficos
    console.log('Exportando gráficos...');
  };

  return (
    <div className={className}>
      {/* Header com controles */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Gráficos Interativos
              </CardTitle>
              <CardDescription>
                Visualizações avançadas dos seus dados de atendimento
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTargets(!showTargets)}
              >
                {showTargets ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showTargets ? 'Ocultar Metas' : 'Mostrar Metas'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCharts}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs de gráficos */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="hourly" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Horários
          </TabsTrigger>
        </TabsList>

        {/* Tab: Tendências */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TrendChart
              title="Atendimentos"
              data={attendanceTrendData}
              metric="atendimentos"
              color="#3b82f6"
              showTarget={showTargets}
              height={chartHeight}
            />
            <TrendChart
              title="Taxa de Conversão"
              data={conversionTrendData}
              metric="conversão (%)"
              color="#10b981"
              showTarget={showTargets}
              height={chartHeight}
            />
            <TrendChart
              title="Tempo de Resposta"
              data={responseTimeTrendData}
              metric="segundos"
              color="#f59e0b"
              showTarget={showTargets}
              height={chartHeight}
              showArea={true}
            />
          </div>
        </TabsContent>

        {/* Tab: Distribuição */}
        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartComponent
              title="Intenções dos Clientes"
              data={intentionsData}
              description="Distribuição das intenções identificadas nos atendimentos"
              height={400}
            />
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo das Intenções</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {intentionsData.map((intention, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{intention.icon}</span>
                          <div>
                            <p className="font-medium">{intention.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {intention.value.toFixed(1)}% dos atendimentos
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {intention.value.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadarChart
              title="Análise de Performance"
              data={performanceData}
              description="Visão geral do desempenho em diferentes métricas"
              height={400}
              showTarget={showTargets}
            />
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.metric}</span>
                          <span className="text-sm text-muted-foreground">
                            {metric.value.toFixed(1)}% / {metric.target}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Horários */}
        <TabsContent value="hourly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="Atendimentos por Hora"
              data={hourlyData}
              description="Distribuição de atendimentos ao longo do dia"
              height={400}
              showTarget={showTargets}
              color="#3b82f6"
            />
            <BarChart
              title="Atendimentos por Hora (Horizontal)"
              data={hourlyData}
              description="Visualização horizontal dos horários de pico"
              height={400}
              showTarget={showTargets}
              horizontal={true}
              color="#10b981"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
