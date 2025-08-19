-- SQL para inserir dados de exemplo na tabela dashboard_data
-- Versão com ID gerado automaticamente pelo PostgreSQL

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
  'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::uuid, -- user_id
  '2024-01-01'::date, -- periodo_inicio
  '2024-01-31'::date, -- periodo_fim
  
  -- Métricas Principais
  1200, -- total_atendimentos
  23.50, -- taxa_conversao (%)
  154, -- tempo_medio_resposta (segundos - 2m 34s)
  4.20, -- nota_media_qualidade
  
  -- Principais Intenções dos Clientes (percentuais)
  45.00, -- intencao_compra
  25.00, -- intencao_duvida_geral
  15.00, -- intencao_reclamacao
  10.00, -- intencao_suporte
  5.00,  -- intencao_orcamento
  
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
  5.00, -- melhor_atendimento_nota
  '+55 11 9xxxx-1234', -- atendimento_critico_cliente
  'Demora de 12min, informações confusas, cliente abandonou', -- atendimento_critico_observacao
  1.50, -- atendimento_critico_nota
  
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

-- Verificar se a inserção foi bem-sucedida e mostrar o ID gerado
SELECT 
  id,
  user_id,
  periodo_inicio,
  periodo_fim,
  total_atendimentos,
  taxa_conversao,
  tempo_medio_resposta,
  nota_media_qualidade,
  created_at
FROM public.dashboard_data 
WHERE user_id = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::uuid
ORDER BY created_at DESC
LIMIT 1;
