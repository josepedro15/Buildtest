export interface PredictiveAnalytics {
  // Previsão de volume de atendimentos
  attendancePrediction: {
    nextDay: number;
    nextWeek: number;
    nextMonth: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    factors: string[];
  };
  
  // Previsão de conversão
  conversionPrediction: {
    nextDay: number;
    nextWeek: number;
    confidence: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    factors: string[];
  };
  
  // Previsão de tempo de resposta
  responseTimePrediction: {
    nextDay: number; // em segundos
    nextWeek: number;
    confidence: number;
    trend: 'improving' | 'worsening' | 'stable';
  };
  
  // Alertas preditivos
  predictiveAlerts: PredictiveAlert[];
  
  // Análise de padrões temporais
  temporalPatterns: {
    hourlyTrends: HourlyTrend[];
    dailyTrends: DailyTrend[];
    weeklyTrends: WeeklyTrend[];
    seasonalPatterns: SeasonalPattern[];
  };
  
  // Recomendações baseadas em ML
  mlRecommendations: MLRecommendation[];
  
  // Análise de sentimento e intenção
  sentimentAnalysis: {
    overallSentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number; // 0-1
    intentPrediction: {
      purchase: number;
      support: number;
      complaint: number;
      inquiry: number;
    };
  };
}

export interface PredictiveAlert {
  id: string;
  type: 'low_conversion' | 'high_response_time' | 'customer_churn' | 'peak_demand' | 'quality_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  message: string;
  recommendedAction: string;
  estimatedImpact: string;
  timeframe: 'immediate' | '24h' | 'week' | 'month';
  createdAt: string;
  isActive: boolean;
}

export interface HourlyTrend {
  hour: number; // 0-23
  averageAttendances: number;
  averageConversion: number;
  averageResponseTime: number;
  confidence: number;
}

export interface DailyTrend {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  averageAttendances: number;
  averageConversion: number;
  averageResponseTime: number;
  confidence: number;
}

export interface WeeklyTrend {
  weekNumber: number;
  totalAttendances: number;
  averageConversion: number;
  averageResponseTime: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SeasonalPattern {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  averageAttendances: number;
  averageConversion: number;
  confidence: number;
}

export interface MLRecommendation {
  id: string;
  type: 'automation' | 'staffing' | 'timing' | 'content' | 'process';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  implementationTime: string;
  expectedROI: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  tags: string[];
}

export interface PredictionModel {
  id: string;
  name: string;
  type: 'attendance' | 'conversion' | 'response_time' | 'sentiment';
  accuracy: number;
  lastUpdated: string;
  version: string;
  features: string[];
  performance: {
    mse: number;
    mae: number;
    r2: number;
  };
}

export interface HistoricalData {
  date: string;
  attendances: number;
  conversions: number;
  responseTime: number;
  qualityScore: number;
  sentiment: number;
  intents: {
    purchase: number;
    support: number;
    complaint: number;
    inquiry: number;
  };
}
