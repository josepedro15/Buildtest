import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { predictiveAnalyticsService } from '@/services/predictiveAnalytics';
import { PredictiveAnalytics } from '@/types/predictive';

export function usePredictiveAnalytics() {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(true);

  const {
    data: predictiveData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['predictive-analytics', user?.id],
    queryFn: async (): Promise<PredictiveAnalytics | null> => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      return await predictiveAnalyticsService.generatePredictiveAnalytics(user.id);
    },
    enabled: !!user && isEnabled,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });

  // Função para atualizar alertas
  const updateAlert = async (alertId: string, isActive: boolean) => {
    // Em um sistema real, isso seria uma chamada para a API
    console.log(`Atualizando alerta ${alertId} para ${isActive}`);
    
    // Simular atualização
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Refetch dos dados
    refetch();
  };

  // Função para aplicar recomendação
  const applyRecommendation = async (recommendationId: string) => {
    // Em um sistema real, isso seria uma chamada para a API
    console.log(`Aplicando recomendação ${recommendationId}`);
    
    // Simular aplicação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refetch dos dados
    refetch();
  };

  // Função para obter alertas ativos
  const getActiveAlerts = () => {
    return predictiveData?.predictiveAlerts.filter(alert => alert.isActive) || [];
  };

  // Função para obter alertas críticos
  const getCriticalAlerts = () => {
    return predictiveData?.predictiveAlerts.filter(
      alert => alert.isActive && alert.severity === 'critical'
    ) || [];
  };

  // Função para obter recomendações por prioridade
  const getRecommendationsByPriority = (priority: 'low' | 'medium' | 'high' | 'critical') => {
    return predictiveData?.mlRecommendations.filter(rec => rec.priority === priority) || [];
  };

  // Função para obter recomendações por tipo
  const getRecommendationsByType = (type: 'automation' | 'staffing' | 'timing' | 'content' | 'process') => {
    return predictiveData?.mlRecommendations.filter(rec => rec.type === type) || [];
  };

  // Função para calcular confiabilidade geral do modelo
  const getOverallConfidence = () => {
    if (!predictiveData) return 0;
    
    const confidences = [
      predictiveData.attendancePrediction.confidence,
      predictiveData.conversionPrediction.confidence,
      predictiveData.responseTimePrediction.confidence
    ];
    
    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  };

  // Função para obter tendência geral
  const getOverallTrend = () => {
    if (!predictiveData) return 'stable';
    
    const trends = [
      predictiveData.attendancePrediction.trend,
      predictiveData.conversionPrediction.trend,
      predictiveData.responseTimePrediction.trend
    ];
    
    const increasing = trends.filter(t => t === 'increasing').length;
    const decreasing = trends.filter(t => t === 'decreasing').length;
    
    if (increasing > decreasing) return 'increasing';
    if (decreasing > increasing) return 'decreasing';
    return 'stable';
  };

  // Função para obter insights resumidos
  const getSummaryInsights = () => {
    if (!predictiveData) return [];
    
    const insights = [];
    
    // Insight sobre atendimentos
    if (predictiveData.attendancePrediction.trend === 'increasing') {
      insights.push({
        type: 'positive',
        title: 'Crescimento de Atendimentos',
        description: `Previsão de ${predictiveData.attendancePrediction.nextDay} atendimentos amanhã`,
        confidence: predictiveData.attendancePrediction.confidence
      });
    }
    
    // Insight sobre conversão
    if (predictiveData.conversionPrediction.trend === 'increasing') {
      insights.push({
        type: 'positive',
        title: 'Melhoria na Conversão',
        description: `Taxa de conversão prevista: ${predictiveData.conversionPrediction.nextDay.toFixed(1)}%`,
        confidence: predictiveData.conversionPrediction.confidence
      });
    }
    
    // Insight sobre tempo de resposta
    if (predictiveData.responseTimePrediction.trend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Tempo de Resposta Melhorando',
        description: `Previsão: ${Math.round(predictiveData.responseTimePrediction.nextDay / 60)}min`,
        confidence: predictiveData.responseTimePrediction.confidence
      });
    }
    
    // Alertas críticos
    const criticalAlerts = getCriticalAlerts();
    if (criticalAlerts.length > 0) {
      insights.push({
        type: 'warning',
        title: `${criticalAlerts.length} Alerta(s) Crítico(s)`,
        description: 'Ação imediata necessária',
        confidence: 1.0
      });
    }
    
    return insights;
  };

  return {
    // Dados
    predictiveData,
    isLoading,
    error,
    
    // Funções de controle
    refetch,
    updateAlert,
    applyRecommendation,
    
    // Funções de filtro
    getActiveAlerts,
    getCriticalAlerts,
    getRecommendationsByPriority,
    getRecommendationsByType,
    
    // Funções de análise
    getOverallConfidence,
    getOverallTrend,
    getSummaryInsights,
    
    // Controles
    isEnabled,
    setIsEnabled
  };
}
