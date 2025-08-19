import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  Lightbulb, 
  Clock, 
  Target, 
  BarChart3,
  Brain,
  Zap,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  RefreshCw,
  BrainCircuit,
  ChartLine,
  AlertCircle,
  Star,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';
import { PredictiveAlert } from '@/types/predictive';
import { cn } from '@/lib/utils';

interface PredictiveAnalyticsProps {
  className?: string;
}

export function PredictiveAnalytics({ className }: PredictiveAnalyticsProps) {
  const {
    predictiveData,
    isLoading,
    error,
    refetch,
    getActiveAlerts,
    getCriticalAlerts,
    getRecommendationsByPriority,
    getOverallConfidence,
    getOverallTrend,
    getSummaryInsights,
    updateAlert,
    applyRecommendation
  } = usePredictiveAnalytics();

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar análise preditiva</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar os dados de análise preditiva.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictiveData) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="pt-6">
          <div className="text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Análise Preditiva</h3>
            <p className="text-muted-foreground">
              Os dados de análise preditiva aparecerão aqui conforme mais informações forem coletadas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = getActiveAlerts();
  const criticalAlerts = getCriticalAlerts();
  const highPriorityRecommendations = getRecommendationsByPriority('high');
  const criticalRecommendations = getRecommendationsByPriority('critical');
  const overallConfidence = getOverallConfidence();
  const overallTrend = getOverallTrend();
  const summaryInsights = getSummaryInsights();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
      case 'worsening':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header com confiabilidade geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5" />
                Análise Preditiva
              </CardTitle>
              <CardDescription>
                Insights baseados em Machine Learning e análise de padrões
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confiabilidade do Modelo</p>
                <p className="text-lg font-semibold">{(overallConfidence * 100).toFixed(1)}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tendência Geral</p>
                <div className="flex items-center gap-1">
                  {getTrendIcon(overallTrend)}
                  <span className="text-sm font-medium capitalize">{overallTrend}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallConfidence * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Métricas Preditivas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Previsão de Atendimentos */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Atendimentos (Amanhã)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictiveData.attendancePrediction.nextDay}</div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(predictiveData.attendancePrediction.trend)}
              <span className="text-sm text-muted-foreground">
                {(predictiveData.attendancePrediction.confidence * 100).toFixed(0)}% confiança
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Previsão de Conversão */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversão (Amanhã)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{predictiveData.conversionPrediction.nextDay.toFixed(1)}%</div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(predictiveData.conversionPrediction.trend)}
              <span className="text-sm text-muted-foreground">
                {(predictiveData.conversionPrediction.confidence * 100).toFixed(0)}% confiança
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Previsão de Tempo de Resposta */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo de Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(predictiveData.responseTimePrediction.nextDay / 60)}min
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(predictiveData.responseTimePrediction.trend)}
              <span className="text-sm text-muted-foreground">
                {(predictiveData.responseTimePrediction.confidence * 100).toFixed(0)}% confiança
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Análise de Sentimento */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Sentimento Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{predictiveData.sentimentAnalysis.overallSentiment}</div>
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {(predictiveData.sentimentAnalysis.sentimentScore * 100).toFixed(0)}% positivo
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com detalhes */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Recomendações
            {(highPriorityRecommendations.length + criticalRecommendations.length) > 0 && (
              <Badge variant="default" className="ml-1">
                {highPriorityRecommendations.length + criticalRecommendations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Padrões
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Tab: Alertas Preditivos */}
        <TabsContent value="alerts" className="space-y-4">
          {activeAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum Alerta Ativo</h3>
                  <p className="text-muted-foreground">
                    Todos os indicadores estão dentro dos parâmetros normais.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {(alert.probability * 100).toFixed(0)}% probabilidade
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateAlert(alert.id, false)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">{alert.message}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {alert.recommendedAction}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Impacto estimado: {alert.estimatedImpact}
                      </span>
                      <span className="text-muted-foreground">
                        Prazo: {alert.timeframe}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Recomendações ML */}
        <TabsContent value="recommendations" className="space-y-4">
          {predictiveData.mlRecommendations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma Recomendação</h3>
                  <p className="text-muted-foreground">
                    As recomendações aparecerão conforme o sistema analisar os padrões.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {predictiveData.mlRecommendations.map((recommendation) => (
                <Card key={recommendation.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getImpactColor(recommendation.impact)}>
                          {recommendation.impact.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {(recommendation.confidence * 100).toFixed(0)}% confiança
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyRecommendation(recommendation.id)}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Aplicar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {recommendation.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Implementação:</span>
                        <p className="font-medium">{recommendation.implementationTime}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROI Esperado:</span>
                        <p className="font-medium">{(recommendation.expectedROI * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab: Padrões Temporais */}
        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Padrões Horários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Padrões Horários</CardTitle>
                <CardDescription>
                  Atendimentos por hora do dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictiveData.temporalPatterns.hourlyTrends
                    .filter(trend => trend.averageAttendances > 5)
                    .sort((a, b) => b.averageAttendances - a.averageAttendances)
                    .slice(0, 5)
                    .map((trend) => (
                      <div key={trend.hour} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{trend.hour}h</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {trend.averageAttendances.toFixed(0)} atendimentos
                          </span>
                          <Progress 
                            value={(trend.averageAttendances / 20) * 100} 
                            className="w-20 h-2" 
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Padrões Diários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Padrões Diários</CardTitle>
                <CardDescription>
                  Atendimentos por dia da semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {predictiveData.temporalPatterns.dailyTrends
                    .sort((a, b) => b.averageAttendances - a.averageAttendances)
                    .map((trend) => {
                      const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                      return (
                        <div key={trend.dayOfWeek} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dayNames[trend.dayOfWeek]}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {trend.averageAttendances.toFixed(0)} atendimentos
                            </span>
                            <Progress 
                              value={(trend.averageAttendances / 100) * 100} 
                              className="w-20 h-2" 
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Insights Resumidos */}
        <TabsContent value="insights" className="space-y-4">
          {summaryInsights.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum Insight Disponível</h3>
                  <p className="text-muted-foreground">
                    Os insights aparecerão conforme mais dados forem analisados.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {summaryInsights.map((insight, index) => (
                <Card key={index} className={cn(
                  "border-l-4",
                  insight.type === 'positive' ? "border-l-green-500" : "border-l-red-500"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {insight.type === 'positive' ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Confiança: {(insight.confidence * 100).toFixed(0)}%
                          </span>
                          <Progress value={insight.confidence * 100} className="w-20 h-1" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
