-- Create dashboard_data table with all metrics in one place
CREATE TABLE public.dashboard_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  
  -- Métricas Principais (Indices fixos)
  total_atendimentos INTEGER,
  taxa_conversao DECIMAL(5,2), -- percentage
  tempo_medio_resposta INTEGER, -- in seconds
  nota_media_qualidade DECIMAL(3,2), -- 0-5 scale
  
  -- Principais Intenções dos Clientes (percentual de atendimentos) (Indices fixos)
  intencao_compra DECIMAL(5,2),
  intencao_duvida_geral DECIMAL(5,2),
  intencao_reclamacao DECIMAL(5,2),
  intencao_suporte DECIMAL(5,2),
  intencao_orcamento DECIMAL(5,2),
  
  -- Insights de Performance (não são índices fixos)
  insights_funcionou TEXT[], -- Array of what worked
  insights_atrapalhou TEXT[], -- Array of what hindered
  
  -- Destaque do Período (Indices fixos)
  melhor_atendimento_cliente TEXT,
  melhor_atendimento_observacao TEXT,
  melhor_atendimento_nota DECIMAL(3,2),
  atendimento_critico_cliente TEXT,
  atendimento_critico_observacao TEXT,
  atendimento_critico_nota DECIMAL(3,2),
  
  -- Automação Sugerida (não são índices fixos)
  automacao_sugerida TEXT[],
  
  -- Próximas Ações (não são índices fixos)
  proximas_acoes TEXT[],
  
  -- Metas e Progresso (Indices fixos)
  meta_taxa_conversao TEXT,
  meta_tempo_resposta TEXT,
  meta_nota_qualidade TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own dashboard data" 
ON public.dashboard_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dashboard data" 
ON public.dashboard_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard data" 
ON public.dashboard_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dashboard data" 
ON public.dashboard_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dashboard_data_updated_at
BEFORE UPDATE ON public.dashboard_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.dashboard_data (
  user_id,
  periodo_inicio,
  periodo_fim,
  
  -- Métricas Principais
  total_atendimentos,
  taxa_conversao,
  tempo_medio_resposta,
  nota_media_qualidade,
  
  -- Principais Intenções dos Clientes
  intencao_compra,
  intencao_duvida_geral,
  intencao_reclamacao,
  intencao_suporte,
  intencao_orcamento,
  
  -- Insights de Performance
  insights_funcionou,
  insights_atrapalhou,
  
  -- Destaque do Período
  melhor_atendimento_cliente,
  melhor_atendimento_observacao,
  melhor_atendimento_nota,
  atendimento_critico_cliente,
  atendimento_critico_observacao,
  atendimento_critico_nota,
  
  -- Automação Sugerida
  automacao_sugerida,
  
  -- Próximas Ações
  proximas_acoes,
  
  -- Metas e Progresso
  meta_taxa_conversao,
  meta_tempo_resposta,
  meta_nota_qualidade
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder user_id
  '2024-01-01'::date,
  '2024-01-31'::date,
  
  -- Métricas Principais
  1234, -- total_atendimentos
  24.5, -- taxa_conversao (%)
  154, -- tempo_medio_resposta (segundos - 2m 34s)
  4.2, -- nota_media_qualidade
  
  -- Principais Intenções dos Clientes (percentuais)
  45.0, -- intencao_compra
  25.0, -- intencao_duvida_geral
  15.0, -- intencao_reclamacao
  10.0, -- intencao_suporte
  5.0,  -- intencao_orcamento
  
  -- Insights de Performance
  ARRAY[
    'Resposta rápida (< 1min): 87% dos clientes responderam positivamente',
    'Ofertas personalizadas: aumentaram conversão em 34%'
  ],
  ARRAY[
    'Falta de clareza no pagamento: 23% abandonaram nesta etapa',
    'Respostas genéricas: baixa satisfação (2,1/5)'
  ],
  
  -- Destaque do Período
  '+55 11 9xxxx-8765', -- melhor_atendimento_cliente
  'Resposta em 30s, proposta personalizada, fechamento em 3 mensagens', -- melhor_atendimento_observacao
  5.0, -- melhor_atendimento_nota
  '+55 11 9xxxx-1234', -- atendimento_critico_cliente
  'Demora de 12min, informações confusas, cliente abandonou', -- atendimento_critico_observacao
  1.5, -- atendimento_critico_nota
  
  -- Automação Sugerida
  ARRAY[
    'FAQ Automatizado: 67% das dúvidas são sobre horário de funcionamento',
    'Reengajamento: clientes que enviam apenas "Oi" e param',
    'Follow-up: lembrete para leads inativos há 3+ dias'
  ],
  
  -- Próximas Ações
  ARRAY[
    'Revisar script de boas-vindas – Pendente (2024-01-20)',
    'Implementar FAQ automatizado – Em andamento (2024-01-25)',
    'Treinamento equipe - objeções – Feito (2024-01-15)'
  ],
  
  -- Metas e Progresso
  '24,5% / Meta 30% (até março)', -- meta_taxa_conversao
  '2m 34s / Meta < 2m (até fevereiro)', -- meta_tempo_resposta
  '4,2 / Meta 4,5 (até abril)' -- meta_nota_qualidade
);