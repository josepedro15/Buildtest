import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface DashboardData {
  id: string;
  user_id: string;
  periodo_inicio: string;
  periodo_fim: string;
  
  // Métricas Principais
  total_atendimentos: number | null;
  taxa_conversao: number | null;
  tempo_medio_resposta: number | null;
  nota_media_qualidade: number | null;
  
  // Principais Intenções dos Clientes
  intencao_compra: number | null;
  intencao_duvida_geral: number | null;
  intencao_reclamacao: number | null;
  intencao_suporte: number | null;
  intencao_orcamento: number | null;
  
  // Insights de Performance
  insights_funcionou: string[] | null;
  insights_atrapalhou: string[] | null;
  
  // Destaque do Período
  melhor_atendimento_cliente: string | null;
  melhor_atendimento_observacao: string | null;
  melhor_atendimento_nota: number | null;
  atendimento_critico_cliente: string | null;
  atendimento_critico_observacao: string | null;
  atendimento_critico_nota: number | null;
  
  // Automação Sugerida
  automacao_sugerida: string[] | null;
  
  // Próximas Ações
  proximas_acoes: string[] | null;
  
  // Metas e Progresso
  meta_taxa_conversao: string | null;
  meta_tempo_resposta: string | null;
  meta_nota_qualidade: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface DashboardDataWithComparison extends DashboardData {
  comparison?: {
    total_atendimentos_change: number;
    taxa_conversao_change: number;
    tempo_medio_resposta_change: number;
    nota_media_qualidade_change: number;
  };
}

export function useDashboardData(selectedDate?: Date) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-data', user?.id, selectedDate?.toISOString().split('T')[0]],
    queryFn: async (): Promise<DashboardDataWithComparison | null> => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar dados do dia selecionado
      let currentDayQuery = supabase
        .from('dashboard_data')
        .select('*')
        .eq('user_id', user.id);

      if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        currentDayQuery = currentDayQuery.gte('created_at', startOfDay.toISOString())
                                        .lte('created_at', endOfDay.toISOString());
      }

      const { data: currentData, error: currentError } = await currentDayQuery
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (currentError && currentError.code !== 'PGRST116') {
        throw currentError;
      }

      // Se não há dados do usuário, retorna dados zerados
      if (!currentData) {
        const emptyData: DashboardData = {
          id: '',
          user_id: user.id,
          periodo_inicio: new Date().toISOString().split('T')[0],
          periodo_fim: new Date().toISOString().split('T')[0],
          
          // Métricas Principais - Zeradas
          total_atendimentos: 0,
          taxa_conversao: 0,
          tempo_medio_resposta: 0,
          nota_media_qualidade: 0,
          
          // Principais Intenções dos Clientes - Zeradas
          intencao_compra: 0,
          intencao_duvida_geral: 0,
          intencao_reclamacao: 0,
          intencao_suporte: 0,
          intencao_orcamento: 0,
          
          // Insights de Performance - Vazios
          insights_funcionou: [],
          insights_atrapalhou: [],
          
          // Destaque do Período - Vazios
          melhor_atendimento_cliente: null,
          melhor_atendimento_observacao: null,
          melhor_atendimento_nota: null,
          atendimento_critico_cliente: null,
          atendimento_critico_observacao: null,
          atendimento_critico_nota: null,
          
          // Automação Sugerida - Vazia
          automacao_sugerida: [],
          
          // Próximas Ações - Vazias
          proximas_acoes: [],
          
          // Metas e Progresso - Vazias
          meta_taxa_conversao: null,
          meta_tempo_resposta: null,
          meta_nota_qualidade: null,
          
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return await addComparisonData(emptyData, user.id, selectedDate);
      }

      // Buscar dados do dia anterior para comparação
      const previousDate = selectedDate ? new Date(selectedDate) : new Date();
      previousDate.setDate(previousDate.getDate() - 1);
      
      const startOfPreviousDay = new Date(previousDate);
      startOfPreviousDay.setHours(0, 0, 0, 0);
      
      const endOfPreviousDay = new Date(previousDate);
      endOfPreviousDay.setHours(23, 59, 59, 999);

      const { data: previousData } = await supabase
        .from('dashboard_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfPreviousDay.toISOString())
        .lte('created_at', endOfPreviousDay.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Adicionar dados de comparação
      const dataWithComparison = await addComparisonData(currentData, user.id, selectedDate, previousData);
      return dataWithComparison;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Função auxiliar para calcular comparações
async function addComparisonData(
  currentData: DashboardData, 
  userId: string, 
  selectedDate?: Date, 
  previousData?: DashboardData | null
): Promise<DashboardDataWithComparison> {
  
  // Se não há dados anteriores, usar zeros
  if (!previousData) {
    previousData = {
      total_atendimentos: 0,
      taxa_conversao: 0,
      tempo_medio_resposta: 0,
      nota_media_qualidade: 0,
    } as DashboardData;
  }

  // Calcular mudanças percentuais
  const calculateChange = (current: number | null, previous: number | null): number => {
    if (!current || !previous) return 0;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateTimeChange = (current: number | null, previous: number | null): number => {
    if (!current || !previous) return 0;
    return current - previous; // Diferença em segundos
  };

  const comparison = {
    total_atendimentos_change: calculateChange(
      currentData.total_atendimentos, 
      previousData.total_atendimentos
    ),
    taxa_conversao_change: calculateChange(
      currentData.taxa_conversao, 
      previousData.taxa_conversao
    ),
    tempo_medio_resposta_change: calculateTimeChange(
      currentData.tempo_medio_resposta, 
      previousData.tempo_medio_resposta
    ),
    nota_media_qualidade_change: calculateChange(
      currentData.nota_media_qualidade, 
      previousData.nota_media_qualidade
    ),
  };

  return {
    ...currentData,
    comparison,
  };
}

// Função para criar dados iniciais do dashboard para um usuário
export async function createInitialDashboardData(userId: string): Promise<DashboardData | null> {
  const { data, error } = await supabase
    .from('dashboard_data')
    .insert({
      user_id: userId,
      periodo_inicio: new Date().toISOString().split('T')[0], // Hoje
      periodo_fim: new Date().toISOString().split('T')[0], // Hoje
      
      // Métricas Principais
      total_atendimentos: 0,
      taxa_conversao: 0,
      tempo_medio_resposta: 0,
      nota_media_qualidade: 0,
      
      // Principais Intenções dos Clientes
      intencao_compra: 0,
      intencao_duvida_geral: 0,
      intencao_reclamacao: 0,
      intencao_suporte: 0,
      intencao_orcamento: 0,
      
      // Insights de Performance
      insights_funcionou: [],
      insights_atrapalhou: [],
      
      // Destaque do Período
      melhor_atendimento_cliente: null,
      melhor_atendimento_observacao: null,
      melhor_atendimento_nota: null,
      atendimento_critico_cliente: null,
      atendimento_critico_observacao: null,
      atendimento_critico_nota: null,
      
      // Automação Sugerida
      automacao_sugerida: [],
      
      // Próximas Ações
      proximas_acoes: [],
      
      // Metas e Progresso
      meta_taxa_conversao: '0% / Meta 30% (até março)',
      meta_tempo_resposta: '0s / Meta < 2min (até fevereiro)',
      meta_nota_qualidade: '0 / Meta 4,5 (até abril)',
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar dados iniciais do dashboard:', error);
    return null;
  }

  return data;
}
