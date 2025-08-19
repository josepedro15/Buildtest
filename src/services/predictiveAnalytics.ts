import { 
  PredictiveAnalytics, 
  PredictiveAlert, 
  HourlyTrend, 
  DailyTrend, 
  WeeklyTrend, 
  SeasonalPattern, 
  MLRecommendation, 
  HistoricalData 
} from '@/types/predictive';

export class PredictiveAnalyticsService {
  private static instance: PredictiveAnalyticsService;
  
  private constructor() {}
  
  static getInstance(): PredictiveAnalyticsService {
    if (!PredictiveAnalyticsService.instance) {
      PredictiveAnalyticsService.instance = new PredictiveAnalyticsService();
    }
    return PredictiveAnalyticsService.instance;
  }

  // Algoritmo de regressão linear simples para previsões
  private linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
    const n = x.length;
    if (n !== y.length || n < 2) {
      return { slope: 0, intercept: 0, r2: 0 };
    }

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calcular R²
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - (slope * x[i] + intercept), 2), 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const r2 = ssTot === 0 ? 0 : 1 - (ssRes / ssTot);

    return { slope, intercept, r2 };
  }

  // Algoritmo de média móvel ponderada
  private weightedMovingAverage(data: number[], weights: number[]): number {
    if (data.length !== weights.length) return 0;
    
    const sum = data.reduce((acc, val, i) => acc + val * weights[i], 0);
    const weightSum = weights.reduce((acc, weight) => acc + weight, 0);
    
    return weightSum > 0 ? sum / weightSum : 0;
  }

  // Detecção de sazonalidade
  private detectSeasonality(data: number[]): number {
    if (data.length < 7) return 0;
    
    // Calcular autocorrelação para detectar padrões semanais
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    
    if (variance === 0) return 0;
    
    let maxCorrelation = 0;
    let seasonality = 0;
    
    for (let lag = 1; lag <= Math.min(7, data.length / 2); lag++) {
      let correlation = 0;
      let count = 0;
      
      for (let i = lag; i < data.length; i++) {
        correlation += (data[i] - mean) * (data[i - lag] - mean);
        count++;
      }
      
      if (count > 0) {
        correlation = correlation / (count * variance);
        if (Math.abs(correlation) > Math.abs(maxCorrelation)) {
          maxCorrelation = correlation;
          seasonality = lag;
        }
      }
    }
    
    return seasonality;
  }

  // Análise de sentimento baseada em palavras-chave
  private analyzeSentiment(text: string): { sentiment: 'positive' | 'neutral' | 'negative'; score: number } {
    const positiveWords = [
      'bom', 'ótimo', 'excelente', 'satisfeito', 'gostei', 'recomendo', 'funciona', 
      'rápido', 'eficiente', 'atendeu', 'resolvido', 'sucesso', 'positivo'
    ];
    
    const negativeWords = [
      'ruim', 'péssimo', 'insatisfeito', 'não gostei', 'problema', 'lento', 
      'ineficiente', 'não atendeu', 'não resolvido', 'fracasso', 'negativo', 'reclamação'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: 'neutral', score: 0.5 };
    
    const score = positiveCount / total;
    
    if (score > 0.6) return { sentiment: 'positive', score };
    if (score < 0.4) return { sentiment: 'negative', score };
    return { sentiment: 'neutral', score };
  }

  // Gerar dados históricos simulados para demonstração
  private generateHistoricalData(days: number = 30): HistoricalData[] {
    const data: HistoricalData[] = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      // Simular padrões sazonais (mais atendimentos em dias úteis)
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendFactor = isWeekend ? 0.6 : 1.0;
      
      // Simular tendência crescente com variação aleatória
      const trendFactor = 1 + (i * 0.02) + (Math.random() - 0.5) * 0.3;
      
      const attendances = Math.round((50 + Math.random() * 100) * weekendFactor * trendFactor);
      const conversionRate = 0.15 + Math.random() * 0.2; // 15-35%
      const conversions = Math.round(attendances * conversionRate);
      const responseTime = 60 + Math.random() * 300; // 1-6 minutos
      const qualityScore = 3.5 + Math.random() * 1.5; // 3.5-5.0
      
      data.push({
        date: date.toISOString().split('T')[0],
        attendances,
        conversions,
        responseTime,
        qualityScore,
        sentiment: 0.4 + Math.random() * 0.6, // 0.4-1.0
        intents: {
          purchase: 0.3 + Math.random() * 0.4,
          support: 0.2 + Math.random() * 0.3,
          complaint: 0.05 + Math.random() * 0.15,
          inquiry: 0.1 + Math.random() * 0.2
        }
      });
    }
    
    return data;
  }

  // Prever atendimentos futuros
  private predictAttendances(historicalData: HistoricalData[]): {
    nextDay: number;
    nextWeek: number;
    nextMonth: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    factors: string[];
  } {
    const attendances = historicalData.map(d => d.attendances);
    const days = attendances.map((_, i) => i);
    
    const { slope, intercept, r2 } = this.linearRegression(days, attendances);
    
    const nextDay = Math.max(0, Math.round(slope * (days.length) + intercept));
    const nextWeek = Math.max(0, Math.round(slope * (days.length + 7) + intercept));
    const nextMonth = Math.max(0, Math.round(slope * (days.length + 30) + intercept));
    
    const trend = slope > 5 ? 'increasing' : slope < -5 ? 'decreasing' : 'stable';
    const confidence = Math.min(0.95, Math.max(0.5, r2));
    
    const factors: string[] = [];
    if (slope > 0) factors.push('Tendência crescente nos últimos dias');
    if (this.detectSeasonality(attendances) > 0) factors.push('Padrão sazonal detectado');
    if (r2 > 0.7) factors.push('Alta confiabilidade do modelo');
    
    return {
      nextDay,
      nextWeek,
      nextMonth,
      confidence,
      trend,
      factors
    };
  }

  // Prever taxa de conversão
  private predictConversion(historicalData: HistoricalData[]): {
    nextDay: number;
    nextWeek: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    factors: string[];
  } {
    const conversions = historicalData.map(d => d.conversions);
    const attendances = historicalData.map(d => d.attendances);
    const conversionRates = conversions.map((conv, i) => attendances[i] > 0 ? conv / attendances[i] : 0);
    
    const { slope, intercept, r2 } = this.linearRegression(
      conversionRates.map((_, i) => i),
      conversionRates
    );
    
    const nextDay = Math.max(0, Math.min(1, slope * conversionRates.length + intercept));
    const nextWeek = Math.max(0, Math.min(1, slope * (conversionRates.length + 7) + intercept));
    
    const trend = slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable';
    const confidence = Math.min(0.95, Math.max(0.5, r2));
    
    const factors: string[] = [];
    if (slope > 0) factors.push('Melhoria na taxa de conversão');
    if (r2 > 0.6) factors.push('Padrão consistente de conversão');
    
    return {
      nextDay: nextDay * 100,
      nextWeek: nextWeek * 100,
      confidence,
      trend,
      factors
    };
  }

  // Gerar alertas preditivos
  private generatePredictiveAlerts(historicalData: HistoricalData[]): PredictiveAlert[] {
    const alerts: PredictiveAlert[] = [];
    const recentData = historicalData.slice(-7); // Últimos 7 dias
    
    // Calcular médias recentes
    const avgConversion = recentData.reduce((sum, d) => sum + (d.conversions / d.attendances), 0) / recentData.length;
    const avgResponseTime = recentData.reduce((sum, d) => sum + d.responseTime, 0) / recentData.length;
    const avgQuality = recentData.reduce((sum, d) => sum + d.qualityScore, 0) / recentData.length;
    
    // Alerta de conversão baixa
    if (avgConversion < 0.15) {
      alerts.push({
        id: `alert_${Date.now()}_1`,
        type: 'low_conversion',
        severity: avgConversion < 0.1 ? 'critical' : 'high',
        probability: 0.85,
        message: `Taxa de conversão baixa detectada (${(avgConversion * 100).toFixed(1)}%)`,
        recommendedAction: 'Revisar funil de vendas e treinar equipe',
        estimatedImpact: 'Redução de 20-30% na receita',
        timeframe: 'immediate',
        createdAt: new Date().toISOString(),
        isActive: true
      });
    }
    
    // Alerta de tempo de resposta alto
    if (avgResponseTime > 300) { // Mais de 5 minutos
      alerts.push({
        id: `alert_${Date.now()}_2`,
        type: 'high_response_time',
        severity: avgResponseTime > 600 ? 'critical' : 'high',
        probability: 0.9,
        message: `Tempo de resposta alto (${Math.round(avgResponseTime / 60)}min)`,
        recommendedAction: 'Implementar automações e aumentar equipe',
        estimatedImpact: 'Perda de 15-25% dos clientes',
        timeframe: '24h',
        createdAt: new Date().toISOString(),
        isActive: true
      });
    }
    
    // Alerta de qualidade baixa
    if (avgQuality < 3.5) {
      alerts.push({
        id: `alert_${Date.now()}_3`,
        type: 'quality_drop',
        severity: avgQuality < 3.0 ? 'critical' : 'medium',
        probability: 0.75,
        message: `Qualidade do atendimento em declínio (${avgQuality.toFixed(1)}/5)`,
        recommendedAction: 'Treinamento da equipe e revisão de processos',
        estimatedImpact: 'Redução na satisfação do cliente',
        timeframe: 'week',
        createdAt: new Date().toISOString(),
        isActive: true
      });
    }
    
    return alerts;
  }

  // Gerar recomendações baseadas em ML
  private generateMLRecommendations(historicalData: HistoricalData[]): MLRecommendation[] {
    const recommendations: MLRecommendation[] = [];
    
    // Analisar padrões
    const avgResponseTime = historicalData.reduce((sum, d) => sum + d.responseTime, 0) / historicalData.length;
    const avgConversion = historicalData.reduce((sum, d) => sum + (d.conversions / d.attendances), 0) / historicalData.length;
    
    // Recomendação de automação se tempo de resposta alto
    if (avgResponseTime > 180) {
      recommendations.push({
        id: `rec_${Date.now()}_1`,
        type: 'automation',
        title: 'Implementar Chatbot Inteligente',
        description: 'Automatizar respostas comuns para reduzir tempo de resposta',
        impact: 'high',
        confidence: 0.85,
        implementationTime: '2-3 semanas',
        expectedROI: 0.25,
        priority: 'high',
        category: 'Eficiência',
        tags: ['automação', 'tempo-resposta', 'chatbot']
      });
    }
    
    // Recomendação de otimização de horários
    const hourlyData = this.analyzeHourlyPatterns(historicalData);
    const peakHours = hourlyData.filter(h => h.averageAttendances > 10);
    if (peakHours.length > 0) {
      recommendations.push({
        id: `rec_${Date.now()}_2`,
        type: 'timing',
        title: 'Otimizar Horários de Atendimento',
        description: `Aumentar equipe nos horários de pico (${peakHours.map(h => `${h.hour}h`).join(', ')})`,
        impact: 'medium',
        confidence: 0.8,
        implementationTime: '1 semana',
        expectedROI: 0.15,
        priority: 'medium',
        category: 'Operacional',
        tags: ['horários', 'equipe', 'pico']
      });
    }
    
    // Recomendação de treinamento se conversão baixa
    if (avgConversion < 0.2) {
      recommendations.push({
        id: `rec_${Date.now()}_3`,
        type: 'process',
        title: 'Treinamento em Técnicas de Venda',
        description: 'Capacitar equipe em técnicas avançadas de conversão',
        impact: 'high',
        confidence: 0.9,
        implementationTime: '1 mês',
        expectedROI: 0.3,
        priority: 'high',
        category: 'Vendas',
        tags: ['treinamento', 'vendas', 'conversão']
      });
    }
    
    return recommendations;
  }

  // Analisar padrões horários
  private analyzeHourlyPatterns(historicalData: HistoricalData[]): HourlyTrend[] {
    const hourlyData: { [hour: number]: number[] } = {};
    
    // Simular dados horários (em um sistema real, viriam do banco)
    for (let hour = 0; hour < 24; hour++) {
      hourlyData[hour] = [];
      for (let i = 0; i < 10; i++) {
        const baseAttendances = hour >= 8 && hour <= 18 ? 15 : 5; // Horário comercial
        hourlyData[hour].push(baseAttendances + Math.random() * 10);
      }
    }
    
    return Object.entries(hourlyData).map(([hour, attendances]) => ({
      hour: parseInt(hour),
      averageAttendances: attendances.reduce((a, b) => a + b, 0) / attendances.length,
      averageConversion: 0.2 + Math.random() * 0.2,
      averageResponseTime: 120 + Math.random() * 180,
      confidence: 0.7 + Math.random() * 0.2
    }));
  }

  // Analisar padrões diários
  private analyzeDailyPatterns(historicalData: HistoricalData[]): DailyTrend[] {
    const dailyData: { [day: number]: number[] } = {};
    
    // Simular dados diários
    for (let day = 0; day < 7; day++) {
      dailyData[day] = [];
      for (let i = 0; i < 5; i++) {
        const isWeekend = day === 0 || day === 6;
        const baseAttendances = isWeekend ? 30 : 80;
        dailyData[day].push(baseAttendances + Math.random() * 40);
      }
    }
    
    return Object.entries(dailyData).map(([day, attendances]) => ({
      dayOfWeek: parseInt(day),
      averageAttendances: attendances.reduce((a, b) => a + b, 0) / attendances.length,
      averageConversion: 0.15 + Math.random() * 0.25,
      averageResponseTime: 150 + Math.random() * 200,
      confidence: 0.8 + Math.random() * 0.15
    }));
  }

  // Método principal para gerar análise preditiva completa
  async generatePredictiveAnalytics(userId: string): Promise<PredictiveAnalytics> {
    // Em um sistema real, buscaríamos dados do banco
    const historicalData = this.generateHistoricalData(30);
    
    const attendancePrediction = this.predictAttendances(historicalData);
    const conversionPrediction = this.predictConversion(historicalData);
    const predictiveAlerts = this.generatePredictiveAlerts(historicalData);
    const mlRecommendations = this.generateMLRecommendations(historicalData);
    
    // Análise de sentimento simulada
    const sentimentAnalysis = {
      overallSentiment: 'positive' as const,
      sentimentScore: 0.75,
      intentPrediction: {
        purchase: 0.35,
        support: 0.25,
        complaint: 0.15,
        inquiry: 0.25
      }
    };
    
    return {
      attendancePrediction,
      conversionPrediction,
      responseTimePrediction: {
        nextDay: 180,
        nextWeek: 175,
        confidence: 0.8,
        trend: 'improving'
      },
      predictiveAlerts,
      temporalPatterns: {
        hourlyTrends: this.analyzeHourlyPatterns(historicalData),
        dailyTrends: this.analyzeDailyPatterns(historicalData),
        weeklyTrends: [],
        seasonalPatterns: []
      },
      mlRecommendations,
      sentimentAnalysis
    };
  }
}

export const predictiveAnalyticsService = PredictiveAnalyticsService.getInstance();
