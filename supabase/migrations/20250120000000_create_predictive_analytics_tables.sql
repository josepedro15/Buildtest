-- Create predictive analytics tables
-- This migration adds tables to support machine learning and predictive analytics

-- Table for storing historical data for ML training
CREATE TABLE IF NOT EXISTS public.historical_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Core metrics
  total_attendances INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
  average_response_time INTEGER NOT NULL DEFAULT 0, -- in seconds
  quality_score DECIMAL(3,2) NOT NULL DEFAULT 0,
  
  -- Sentiment analysis
  sentiment_score DECIMAL(3,2) NOT NULL DEFAULT 0.5, -- 0-1 scale
  positive_messages INTEGER NOT NULL DEFAULT 0,
  negative_messages INTEGER NOT NULL DEFAULT 0,
  neutral_messages INTEGER NOT NULL DEFAULT 0,
  
  -- Intent analysis
  purchase_intent DECIMAL(5,4) NOT NULL DEFAULT 0,
  support_intent DECIMAL(5,4) NOT NULL DEFAULT 0,
  complaint_intent DECIMAL(5,4) NOT NULL DEFAULT 0,
  inquiry_intent DECIMAL(5,4) NOT NULL DEFAULT 0,
  
  -- Temporal features
  day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
  hour_of_day INTEGER NOT NULL, -- 0-23
  is_weekend BOOLEAN NOT NULL DEFAULT false,
  is_holiday BOOLEAN NOT NULL DEFAULT false,
  
  -- External factors (for future use)
  weather_condition TEXT,
  special_event TEXT,
  marketing_campaign TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure one record per user per day
  UNIQUE(user_id, date)
);

-- Table for storing predictive alerts
CREATE TABLE IF NOT EXISTS public.predictive_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Alert details
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_conversion', 'high_response_time', 'customer_churn', 'peak_demand', 'quality_drop')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  probability DECIMAL(3,2) NOT NULL CHECK (probability >= 0 AND probability <= 1),
  
  -- Alert content
  message TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  estimated_impact TEXT NOT NULL,
  timeframe TEXT NOT NULL CHECK (timeframe IN ('immediate', '24h', 'week', 'month')),
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_acknowledged BOOLEAN NOT NULL DEFAULT false,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  acknowledged_by UUID REFERENCES auth.users(id),
  
  -- ML model info
  model_version TEXT,
  confidence_score DECIMAL(3,2),
  features_used JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for storing ML recommendations
CREATE TABLE IF NOT EXISTS public.ml_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Recommendation details
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('automation', 'staffing', 'timing', 'content', 'process')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Impact assessment
  impact_level TEXT NOT NULL CHECK (impact_level IN ('low', 'medium', 'high')),
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  expected_roi DECIMAL(5,4) NOT NULL DEFAULT 0,
  
  -- Implementation details
  implementation_time TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  is_applied BOOLEAN NOT NULL DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,
  applied_by UUID REFERENCES auth.users(id),
  application_notes TEXT,
  
  -- ML model info
  model_version TEXT,
  features_used JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for storing prediction models metadata
CREATE TABLE IF NOT EXISTS public.prediction_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Model details
  model_name TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('attendance', 'conversion', 'response_time', 'sentiment')),
  version TEXT NOT NULL,
  
  -- Performance metrics
  accuracy DECIMAL(5,4) NOT NULL DEFAULT 0,
  mse DECIMAL(10,6) NOT NULL DEFAULT 0,
  mae DECIMAL(10,6) NOT NULL DEFAULT 0,
  r2_score DECIMAL(5,4) NOT NULL DEFAULT 0,
  
  -- Model features
  features TEXT[] NOT NULL DEFAULT '{}',
  hyperparameters JSONB,
  training_data_size INTEGER NOT NULL DEFAULT 0,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_production BOOLEAN NOT NULL DEFAULT false,
  
  -- Training info
  trained_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  training_duration INTEGER, -- in seconds
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table for storing predictions
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.prediction_models(id) ON DELETE CASCADE,
  
  -- Prediction details
  prediction_date DATE NOT NULL,
  predicted_value DECIMAL(10,4) NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  -- Input features
  input_features JSONB NOT NULL,
  
  -- Actual value (for validation)
  actual_value DECIMAL(10,4),
  actual_date DATE,
  
  -- Error metrics (calculated when actual value is available)
  absolute_error DECIMAL(10,4),
  percentage_error DECIMAL(5,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_historical_analytics_user_date ON public.historical_analytics(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_historical_analytics_date ON public.historical_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_user_active ON public.predictive_alerts(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_predictive_alerts_severity ON public.predictive_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_ml_recommendations_user_priority ON public.ml_recommendations(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_ml_recommendations_type ON public.ml_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_prediction_models_user_type ON public.prediction_models(user_id, model_type);
CREATE INDEX IF NOT EXISTS idx_prediction_models_active ON public.prediction_models(is_active, is_production);
CREATE INDEX IF NOT EXISTS idx_predictions_user_date ON public.predictions(user_id, prediction_date DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_model ON public.predictions(model_id);

-- Enable RLS (Row Level Security)
ALTER TABLE public.historical_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for historical_analytics
CREATE POLICY "Users can view their own historical analytics" ON public.historical_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own historical analytics" ON public.historical_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own historical analytics" ON public.historical_analytics
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own historical analytics" ON public.historical_analytics
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for predictive_alerts
CREATE POLICY "Users can view their own predictive alerts" ON public.predictive_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictive alerts" ON public.predictive_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictive alerts" ON public.predictive_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictive alerts" ON public.predictive_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ml_recommendations
CREATE POLICY "Users can view their own ML recommendations" ON public.ml_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ML recommendations" ON public.ml_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ML recommendations" ON public.ml_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ML recommendations" ON public.ml_recommendations
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for prediction_models
CREATE POLICY "Users can view their own prediction models" ON public.prediction_models
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prediction models" ON public.prediction_models
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prediction models" ON public.prediction_models
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prediction models" ON public.prediction_models
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for predictions
CREATE POLICY "Users can view their own predictions" ON public.predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" ON public.predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions" ON public.predictions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" ON public.predictions
  FOR DELETE USING (auth.uid() = user_id);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_historical_analytics_updated_at
  BEFORE UPDATE ON public.historical_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictive_alerts_updated_at
  BEFORE UPDATE ON public.predictive_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ml_recommendations_updated_at
  BEFORE UPDATE ON public.ml_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prediction_models_updated_at
  BEFORE UPDATE ON public.prediction_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.historical_analytics IS 'Dados históricos para treinamento de modelos de ML';
COMMENT ON TABLE public.predictive_alerts IS 'Alertas preditivos gerados por modelos de ML';
COMMENT ON TABLE public.ml_recommendations IS 'Recomendações baseadas em ML para otimização';
COMMENT ON TABLE public.prediction_models IS 'Metadados dos modelos de predição';
COMMENT ON TABLE public.predictions IS 'Predições geradas pelos modelos de ML';
