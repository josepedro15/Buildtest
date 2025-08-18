import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DashboardData } from './useDashboardData';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ExportOptions {
  format: ExportFormat;
  includeMetrics?: boolean;
  includeIntentions?: boolean;
  includeInsights?: boolean;
  includeHighlights?: boolean;
  includeAutomation?: boolean;
  includeActions?: boolean;
  includeGoals?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  // Função auxiliar para criar separadores visuais
  const createSeparator = (char: string, length: number) => char.repeat(length);
  
  // Função auxiliar para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Função auxiliar para formatar tempo
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Função auxiliar para determinar status com cores
  const getStatusWithColor = (value: number, thresholds: { excellent: number; good: number }, isLowerBetter = false) => {
    if (isLowerBetter) {
      if (value <= thresholds.excellent) return '🟢 Excelente';
      if (value <= thresholds.good) return '🟡 Bom';
      return '🔴 Precisa Melhorar';
    } else {
      if (value >= thresholds.excellent) return '🟢 Excelente';
      if (value >= thresholds.good) return '🟡 Bom';
      return '🔴 Precisa Melhorar';
    }
  };

  const exportToCSV = async (data: DashboardData, options: ExportOptions) => {
    const csvData: string[][] = [];
    
    // ===== CABEÇALHO PROFISSIONAL =====
    csvData.push([createSeparator('=', 100)]);
    csvData.push(['📊 RELATÓRIO WHATSAPP ANALYTICS - METRICAWHATS']);
    csvData.push([createSeparator('=', 100)]);
    csvData.push([]);
    
    // ===== INFORMAÇÕES DO RELATÓRIO =====
    csvData.push(['📋 INFORMAÇÕES DO RELATÓRIO']);
    csvData.push([createSeparator('-', 50)]);
    csvData.push(['Período Analisado:', `${options.dateRange?.start || data.periodo_inicio} a ${options.dateRange?.end || data.periodo_fim}`]);
    csvData.push(['Data de Geração:', formatDate(new Date())]);
    csvData.push(['Versão do Sistema:', 'MetricaWhats Analytics v1.0']);
    csvData.push(['Gerado por:', 'Sistema Automático']);
    csvData.push([]);

    // ===== MÉTRICAS PRINCIPAIS =====
    if (options.includeMetrics) {
      csvData.push(['📈 MÉTRICAS PRINCIPAIS']);
      csvData.push([createSeparator('-', 50)]);
      csvData.push(['Métrica', 'Valor', 'Unidade', 'Status', 'Tendência']);
      
      const metrics = [
        {
          name: 'Total de Atendimentos',
          value: data.total_atendimentos?.toLocaleString('pt-BR') || '0',
          unit: 'atendimentos',
          status: getStatusWithColor(data.total_atendimentos || 0, { excellent: 1000, good: 500 }),
          trend: (data.total_atendimentos || 0) > 1000 ? '↗️ Crescente' : (data.total_atendimentos || 0) > 500 ? '→ Estável' : '↘️ Decrescente'
        },
        {
          name: 'Taxa de Conversão',
          value: `${data.taxa_conversao?.toFixed(1) || 0}%`,
          unit: 'percentual',
          status: getStatusWithColor(data.taxa_conversao || 0, { excellent: 25, good: 15 }),
          trend: (data.taxa_conversao || 0) > 25 ? '↗️ Excelente' : (data.taxa_conversao || 0) > 15 ? '→ Boa' : '↘️ Baixa'
        },
        {
          name: 'Tempo Médio de Resposta',
          value: formatTime(data.tempo_medio_resposta || 0),
          unit: 'tempo',
          status: getStatusWithColor(data.tempo_medio_resposta || 0, { excellent: 120, good: 300 }, true),
          trend: (data.tempo_medio_resposta || 0) < 120 ? '↗️ Muito Rápido' : (data.tempo_medio_resposta || 0) < 300 ? '→ Adequado' : '↘️ Lento'
        },
        {
          name: 'Nota Média de Qualidade',
          value: `${data.nota_media_qualidade?.toFixed(1) || 0}/5`,
          unit: 'pontos',
          status: getStatusWithColor(data.nota_media_qualidade || 0, { excellent: 4, good: 3 }),
          trend: (data.nota_media_qualidade || 0) > 4 ? '↗️ Excepcional' : (data.nota_media_qualidade || 0) > 3 ? '→ Satisfatória' : '↘️ Insatisfatória'
        }
      ];
      
      metrics.forEach(metric => {
        csvData.push([metric.name, metric.value, metric.unit, metric.status, metric.trend]);
      });
      csvData.push([]);
    }

    // ===== INTENÇÕES DOS CLIENTES =====
    if (options.includeIntentions) {
      csvData.push(['🎯 INTENÇÕES DOS CLIENTES']);
      csvData.push([createSeparator('-', 50)]);
      csvData.push(['Intenção', 'Percentual', 'Quantidade Estimada', 'Prioridade', 'Ação Recomendada']);
      
      const totalAtendimentos = data.total_atendimentos || 0;
      const intentions = [
        { 
          name: '🛒 Compra', 
          percentage: data.intencao_compra || 0, 
          priority: 'Alta',
          action: 'Otimizar funil de vendas'
        },
        { 
          name: '❓ Dúvida Geral', 
          percentage: data.intencao_duvida_geral || 0, 
          priority: 'Média',
          action: 'Melhorar FAQ e documentação'
        },
        { 
          name: '⚠️ Reclamação', 
          percentage: data.intencao_reclamacao || 0, 
          priority: 'Alta',
          action: 'Investigar e resolver problemas'
        },
        { 
          name: '🛠️ Suporte', 
          percentage: data.intencao_suporte || 0, 
          priority: 'Média',
          action: 'Capacitar equipe de suporte'
        },
        { 
          name: '💰 Orçamento', 
          percentage: data.intencao_orcamento || 0, 
          priority: 'Alta',
          action: 'Acelerar processo de orçamento'
        }
      ];
      
      intentions.forEach(intention => {
        const estimatedCount = Math.round((intention.percentage / 100) * totalAtendimentos);
        csvData.push([
          intention.name, 
          `${intention.percentage.toFixed(1)}%`, 
          `${estimatedCount.toLocaleString('pt-BR')} atendimentos`,
          intention.priority,
          intention.action
        ]);
      });
      csvData.push([]);
    }

    // ===== INSIGHTS DE PERFORMANCE =====
    if (options.includeInsights && (data.insights_funcionou?.length || data.insights_atrapalhou?.length)) {
      csvData.push(['💡 INSIGHTS DE PERFORMANCE']);
      csvData.push([createSeparator('-', 50)]);
      
      if (data.insights_funcionou?.length) {
        csvData.push(['✅ O QUE FUNCIONOU BEM:']);
        data.insights_funcionou.forEach((insight, index) => {
          const [title, description] = insight.split(': ');
          csvData.push([`${index + 1}. ${title}`, description || '', 'Positivo', 'Manter']);
        });
        csvData.push([]);
      }
      
      if (data.insights_atrapalhou?.length) {
        csvData.push(['❌ O QUE PRECISA MELHORAR:']);
        data.insights_atrapalhou.forEach((insight, index) => {
          const [title, description] = insight.split(': ');
          csvData.push([`${index + 1}. ${title}`, description || '', 'Crítico', 'Corrigir']);
        });
        csvData.push([]);
      }
    }

    // ===== DESTAQUES DO PERÍODO =====
    if (options.includeHighlights) {
      csvData.push(['🏆 DESTAQUES DO PERÍODO']);
      csvData.push([createSeparator('-', 50)]);
      
      if (data.melhor_atendimento_cliente) {
        csvData.push(['🥇 MELHOR ATENDIMENTO:']);
        csvData.push(['Cliente:', data.melhor_atendimento_cliente]);
        csvData.push(['Nota:', `${data.melhor_atendimento_nota?.toFixed(1) || 0}/5`]);
        csvData.push(['Observação:', data.melhor_atendimento_observacao || '']);
        csvData.push([]);
      }
      
      if (data.atendimento_critico_cliente) {
        csvData.push(['⚠️ ATENDIMENTO CRÍTICO:']);
        csvData.push(['Cliente:', data.atendimento_critico_cliente]);
        csvData.push(['Nota:', `${data.atendimento_critico_nota?.toFixed(1) || 0}/5`]);
        csvData.push(['Observação:', data.atendimento_critico_observacao || '']);
        csvData.push([]);
      }
    }

    // ===== SUGESTÕES DE AUTOMAÇÃO =====
    if (options.includeAutomation && data.automacao_sugerida?.length) {
      csvData.push(['🤖 SUGESTÕES DE AUTOMAÇÃO']);
      csvData.push([createSeparator('-', 50)]);
      csvData.push(['Sugestão', 'Descrição', 'Impacto Esperado', 'Prioridade', 'Tempo Estimado']);
      
      data.automacao_sugerida.forEach((automacao, index) => {
        const [title, description] = automacao.split(': ');
        const impact = index === 0 ? 'Alto' : index === 1 ? 'Médio' : 'Baixo';
        const priority = index === 0 ? 'Alta' : index === 1 ? 'Média' : 'Baixa';
        const time = index === 0 ? '1-2 semanas' : index === 1 ? '2-4 semanas' : '4-8 semanas';
        csvData.push([`${index + 1}. ${title}`, description || '', impact, priority, time]);
      });
      csvData.push([]);
    }

    // ===== PRÓXIMAS AÇÕES =====
    if (options.includeActions && data.proximas_acoes?.length) {
      csvData.push(['📋 PRÓXIMAS AÇÕES RECOMENDADAS']);
      csvData.push([createSeparator('-', 50)]);
      csvData.push(['Ação', 'Status', 'Prazo', 'Prioridade', 'Responsável', 'Progresso']);
      
      data.proximas_acoes.forEach((acao, index) => {
        const match = acao.match(/^(.*?)\s*–\s*(.*?)\s*\((\d{4}-\d{2}-\d{2})\)$/);
        if (match) {
          const [, title, status, deadline] = match;
          const priority = status === 'Feito' ? 'Baixa' : status === 'Em andamento' ? 'Média' : 'Alta';
          const progress = status === 'Feito' ? '100%' : status === 'Em andamento' ? '50%' : '0%';
          csvData.push([title, status, deadline, priority, 'Equipe', progress]);
        } else {
          csvData.push([acao, 'Pendente', 'A definir', 'Média', 'Equipe', '0%']);
        }
      });
      csvData.push([]);
    }

    // ===== METAS E PROGRESSO =====
    if (options.includeGoals) {
      csvData.push(['🎯 METAS E PROGRESSO']);
      csvData.push([createSeparator('-', 50)]);
      csvData.push(['Meta', 'Progresso Atual', 'Objetivo', 'Status', 'Próximo Passo', 'Prazo']);
      
      const goals = [
        {
          name: 'Taxa de Conversão',
          current: data.taxa_conversao?.toFixed(1) || '0',
          target: '30%',
          status: (data.taxa_conversao || 0) >= 30 ? 'Atingida' : 'Em andamento',
          nextStep: (data.taxa_conversao || 0) >= 30 ? 'Manter estratégias' : 'Otimizar funil de vendas',
          deadline: 'Próximo mês'
        },
        {
          name: 'Tempo de Resposta',
          current: formatTime(data.tempo_medio_resposta || 0),
          target: '< 2min',
          status: (data.tempo_medio_resposta || 0) <= 120 ? 'Atingida' : 'Em andamento',
          nextStep: (data.tempo_medio_resposta || 0) <= 120 ? 'Manter agilidade' : 'Implementar automações',
          deadline: '2 semanas'
        },
        {
          name: 'Nota de Qualidade',
          current: `${data.nota_media_qualidade?.toFixed(1) || 0}/5`,
          target: '4.5/5',
          status: (data.nota_media_qualidade || 0) >= 4.5 ? 'Atingida' : 'Em andamento',
          nextStep: (data.nota_media_qualidade || 0) >= 4.5 ? 'Manter padrão' : 'Treinar equipe',
          deadline: '1 mês'
        }
      ];
      
      goals.forEach(goal => {
        csvData.push([goal.name, goal.current, goal.target, goal.status, goal.nextStep, goal.deadline]);
      });
      csvData.push([]);
    }

    // ===== RESUMO EXECUTIVO =====
    csvData.push(['📊 RESUMO EXECUTIVO']);
    csvData.push([createSeparator('-', 50)]);
    csvData.push(['Indicador', 'Valor', 'Status Geral']);
    
    const overallStatus = (data.taxa_conversao || 0) > 20 && (data.nota_media_qualidade || 0) > 4 ? '🟢 Excelente' :
                         (data.taxa_conversao || 0) > 15 && (data.nota_media_qualidade || 0) > 3 ? '🟡 Bom' : '🔴 Precisa Melhorar';
    
    const overallTrend = (data.taxa_conversao || 0) > 20 ? 'Crescente' : (data.taxa_conversao || 0) > 15 ? 'Estável' : 'Decrescente';
    const recommendation = (data.taxa_conversao || 0) > 20 ? 'Manter estratégias atuais' : (data.taxa_conversao || 0) > 15 ? 'Otimizar processos' : 'Revisar estratégias';
    
    csvData.push(['Performance Geral', `${((data.taxa_conversao || 0) + (data.nota_media_qualidade || 0) * 20) / 2}%`, overallStatus]);
    csvData.push(['Volume de Atendimentos', `${data.total_atendimentos?.toLocaleString('pt-BR') || 0}`, (data.total_atendimentos || 0) > 500 ? '🟢 Alto' : '🟡 Médio']);
    csvData.push(['Eficiência Operacional', `${((data.tempo_medio_resposta || 0) < 300 ? 100 : 50)}%`, (data.tempo_medio_resposta || 0) < 300 ? '🟢 Eficiente' : '🟡 Melhorável']);
    csvData.push([]);

    // ===== FOOTER PROFISSIONAL =====
    csvData.push([createSeparator('=', 100)]);
    csvData.push(['📄 RELATÓRIO GERADO AUTOMATICAMENTE PELO SISTEMA METRICAWHATS']);
    csvData.push(['🚀 Transformando atendimentos do WhatsApp em resultados mensuráveis']);
    csvData.push(['📧 Suporte: contato@metricawhats.com | 📱 WhatsApp: (11) 99999-9999']);
    csvData.push([createSeparator('=', 100)]);

    // Converter para CSV com formatação melhorada
    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell?.replace(/"/g, '""') || ''}"`).join(',')
    ).join('\n');

    // Download com nome de arquivo profissional
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `MetricaWhats_Relatorio_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Exportado",
      description: "Relatório CSV gerado com formatação profissional.",
    });
  };

  const exportToExcel = async (data: DashboardData, options: ExportOptions) => {
    // Para Excel, vamos criar um CSV mais estruturado que funciona perfeitamente no Excel
    const excelData: string[][] = [];
    
    // ===== CABEÇALHO EXCEL-FRIENDLY =====
    excelData.push(['RELATÓRIO WHATSAPP ANALYTICS - METRICAWHATS']);
    excelData.push([]);
    
    // ===== INFORMAÇÕES DO RELATÓRIO =====
    excelData.push(['INFORMAÇÕES DO RELATÓRIO']);
    excelData.push(['Campo', 'Valor']);
    excelData.push(['Período Analisado', `${options.dateRange?.start || data.periodo_inicio} a ${options.dateRange?.end || data.periodo_fim}`]);
    excelData.push(['Data de Geração', formatDate(new Date())]);
    excelData.push(['Versão do Sistema', 'MetricaWhats Analytics v1.0']);
    excelData.push(['Gerado por', 'Sistema Automático']);
    excelData.push([]);

    // ===== MÉTRICAS PRINCIPAIS =====
    if (options.includeMetrics) {
      excelData.push(['MÉTRICAS PRINCIPAIS']);
      excelData.push(['Métrica', 'Valor', 'Unidade', 'Status', 'Observação', 'Tendência']);
      
      const metrics = [
        {
          name: 'Total de Atendimentos',
          value: data.total_atendimentos?.toLocaleString('pt-BR') || '0',
          unit: 'atendimentos',
          status: getStatusWithColor(data.total_atendimentos || 0, { excellent: 1000, good: 500 }),
          observation: (data.total_atendimentos || 0) > 1000 ? 'Volume alto de atendimentos' : (data.total_atendimentos || 0) > 500 ? 'Volume adequado' : 'Volume baixo - considere aumentar',
          trend: (data.total_atendimentos || 0) > 1000 ? 'Crescente' : (data.total_atendimentos || 0) > 500 ? 'Estável' : 'Decrescente'
        },
        {
          name: 'Taxa de Conversão',
          value: `${data.taxa_conversao?.toFixed(1) || 0}%`,
          unit: 'percentual',
          status: getStatusWithColor(data.taxa_conversao || 0, { excellent: 25, good: 15 }),
          observation: (data.taxa_conversao || 0) > 25 ? 'Conversão acima da média do mercado' : (data.taxa_conversao || 0) > 15 ? 'Conversão dentro do esperado' : 'Conversão baixa - revise estratégias',
          trend: (data.taxa_conversao || 0) > 25 ? 'Excelente' : (data.taxa_conversao || 0) > 15 ? 'Boa' : 'Baixa'
        },
        {
          name: 'Tempo Médio de Resposta',
          value: formatTime(data.tempo_medio_resposta || 0),
          unit: 'tempo',
          status: getStatusWithColor(data.tempo_medio_resposta || 0, { excellent: 120, good: 300 }, true),
          observation: (data.tempo_medio_resposta || 0) < 120 ? 'Resposta muito rápida' : (data.tempo_medio_resposta || 0) < 300 ? 'Resposta adequada' : 'Resposta lenta - otimize processos',
          trend: (data.tempo_medio_resposta || 0) < 120 ? 'Muito Rápido' : (data.tempo_medio_resposta || 0) < 300 ? 'Adequado' : 'Lento'
        },
        {
          name: 'Nota Média de Qualidade',
          value: `${data.nota_media_qualidade?.toFixed(1) || 0}/5`,
          unit: 'pontos',
          status: getStatusWithColor(data.nota_media_qualidade || 0, { excellent: 4, good: 3 }),
          observation: (data.nota_media_qualidade || 0) > 4 ? 'Qualidade excepcional' : (data.nota_media_qualidade || 0) > 3 ? 'Qualidade satisfatória' : 'Qualidade baixa - treine equipe',
          trend: (data.nota_media_qualidade || 0) > 4 ? 'Excepcional' : (data.nota_media_qualidade || 0) > 3 ? 'Satisfatória' : 'Insatisfatória'
        }
      ];
      
      metrics.forEach(metric => {
        excelData.push([metric.name, metric.value, metric.unit, metric.status, metric.observation, metric.trend]);
      });
      excelData.push([]);
    }

    // ===== INTENÇÕES DOS CLIENTES =====
    if (options.includeIntentions) {
      excelData.push(['INTENÇÕES DOS CLIENTES']);
      excelData.push(['Intenção', 'Percentual', 'Quantidade Estimada', 'Prioridade de Ação', 'Estratégia Recomendada']);
      
      const totalAtendimentos = data.total_atendimentos || 0;
      const intentions = [
        { name: 'Compra', percentage: data.intencao_compra || 0, priority: 'Alta', strategy: 'Otimizar funil de vendas e follow-up' },
        { name: 'Dúvida Geral', percentage: data.intencao_duvida_geral || 0, priority: 'Média', strategy: 'Melhorar FAQ e documentação' },
        { name: 'Reclamação', percentage: data.intencao_reclamacao || 0, priority: 'Alta', strategy: 'Investigar e resolver problemas rapidamente' },
        { name: 'Suporte', percentage: data.intencao_suporte || 0, priority: 'Média', strategy: 'Capacitar equipe de suporte' },
        { name: 'Orçamento', percentage: data.intencao_orcamento || 0, priority: 'Alta', strategy: 'Acelerar processo de orçamento' }
      ];
      
      intentions.forEach(intention => {
        const estimatedCount = Math.round((intention.percentage / 100) * totalAtendimentos);
        excelData.push([
          intention.name, 
          `${intention.percentage.toFixed(1)}%`, 
          `${estimatedCount.toLocaleString('pt-BR')} atendimentos`,
          intention.priority,
          intention.strategy
        ]);
      });
      excelData.push([]);
    }

    // ===== INSIGHTS DE PERFORMANCE =====
    if (options.includeInsights && (data.insights_funcionou?.length || data.insights_atrapalhou?.length)) {
      excelData.push(['INSIGHTS DE PERFORMANCE']);
      
      if (data.insights_funcionou?.length) {
        excelData.push(['O QUE FUNCIONOU BEM:']);
        excelData.push(['Item', 'Descrição', 'Impacto', 'Ação']);
        data.insights_funcionou.forEach((insight, index) => {
          const [title, description] = insight.split(': ');
          excelData.push([`${index + 1}. ${title}`, description || '', 'Positivo', 'Manter e replicar']);
        });
        excelData.push([]);
      }
      
      if (data.insights_atrapalhou?.length) {
        excelData.push(['O QUE PRECISA MELHORAR:']);
        excelData.push(['Item', 'Descrição', 'Impacto', 'Ação']);
        data.insights_atrapalhou.forEach((insight, index) => {
          const [title, description] = insight.split(': ');
          excelData.push([`${index + 1}. ${title}`, description || '', 'Crítico', 'Corrigir imediatamente']);
        });
        excelData.push([]);
      }
    }

    // ===== DESTAQUES DO PERÍODO =====
    if (options.includeHighlights) {
      excelData.push(['DESTAQUES DO PERÍODO']);
      
      if (data.melhor_atendimento_cliente) {
        excelData.push(['MELHOR ATENDIMENTO:']);
        excelData.push(['Campo', 'Valor']);
        excelData.push(['Cliente', data.melhor_atendimento_cliente]);
        excelData.push(['Nota', `${data.melhor_atendimento_nota?.toFixed(1) || 0}/5`]);
        excelData.push(['Observação', data.melhor_atendimento_observacao || '']);
        excelData.push([]);
      }
      
      if (data.atendimento_critico_cliente) {
        excelData.push(['ATENDIMENTO CRÍTICO:']);
        excelData.push(['Campo', 'Valor']);
        excelData.push(['Cliente', data.atendimento_critico_cliente]);
        excelData.push(['Nota', `${data.atendimento_critico_nota?.toFixed(1) || 0}/5`]);
        excelData.push(['Observação', data.atendimento_critico_observacao || '']);
        excelData.push([]);
      }
    }

    // ===== SUGESTÕES DE AUTOMAÇÃO =====
    if (options.includeAutomation && data.automacao_sugerida?.length) {
      excelData.push(['SUGESTÕES DE AUTOMAÇÃO']);
      excelData.push(['Sugestão', 'Descrição', 'Impacto Esperado', 'Prioridade', 'Tempo Estimado', 'ROI']);
      
      data.automacao_sugerida.forEach((automacao, index) => {
        const [title, description] = automacao.split(': ');
        const impact = index === 0 ? 'Alto' : index === 1 ? 'Médio' : 'Baixo';
        const priority = index === 0 ? 'Alta' : index === 1 ? 'Média' : 'Baixa';
        const time = index === 0 ? '1-2 semanas' : index === 1 ? '2-4 semanas' : '4-8 semanas';
        const roi = index === 0 ? 'Alto' : index === 1 ? 'Médio' : 'Baixo';
        excelData.push([`${index + 1}. ${title}`, description || '', impact, priority, time, roi]);
      });
      excelData.push([]);
    }

    // ===== PRÓXIMAS AÇÕES =====
    if (options.includeActions && data.proximas_acoes?.length) {
      excelData.push(['PRÓXIMAS AÇÕES RECOMENDADAS']);
      excelData.push(['Ação', 'Status', 'Prazo', 'Prioridade', 'Responsável', 'Progresso', 'Próximo Passo']);
      
      data.proximas_acoes.forEach((acao, index) => {
        const match = acao.match(/^(.*?)\s*–\s*(.*?)\s*\((\d{4}-\d{2}-\d{2})\)$/);
        if (match) {
          const [, title, status, deadline] = match;
          const priority = status === 'Feito' ? 'Baixa' : status === 'Em andamento' ? 'Média' : 'Alta';
          const progress = status === 'Feito' ? '100%' : status === 'Em andamento' ? '50%' : '0%';
          const nextStep = status === 'Feito' ? 'Concluído' : status === 'Em andamento' ? 'Continuar execução' : 'Iniciar imediatamente';
          excelData.push([title, status, deadline, priority, 'Equipe', progress, nextStep]);
        } else {
          excelData.push([acao, 'Pendente', 'A definir', 'Média', 'Equipe', '0%', 'Definir prazo']);
        }
      });
      excelData.push([]);
    }

    // ===== METAS E PROGRESSO =====
    if (options.includeGoals) {
      excelData.push(['METAS E PROGRESSO']);
      excelData.push(['Meta', 'Progresso Atual', 'Objetivo', 'Status', 'Próximo Passo', 'Prazo', 'Responsável']);
      
      const goals = [
        {
          name: 'Taxa de Conversão',
          current: data.taxa_conversao?.toFixed(1) || '0',
          target: '30%',
          status: (data.taxa_conversao || 0) >= 30 ? 'Atingida' : 'Em andamento',
          nextStep: (data.taxa_conversao || 0) >= 30 ? 'Manter estratégias' : 'Otimizar funil de vendas',
          deadline: 'Próximo mês',
          responsible: 'Equipe de Vendas'
        },
        {
          name: 'Tempo de Resposta',
          current: formatTime(data.tempo_medio_resposta || 0),
          target: '< 2min',
          status: (data.tempo_medio_resposta || 0) <= 120 ? 'Atingida' : 'Em andamento',
          nextStep: (data.tempo_medio_resposta || 0) <= 120 ? 'Manter agilidade' : 'Implementar automações',
          deadline: '2 semanas',
          responsible: 'Equipe de Atendimento'
        },
        {
          name: 'Nota de Qualidade',
          current: `${data.nota_media_qualidade?.toFixed(1) || 0}/5`,
          target: '4.5/5',
          status: (data.nota_media_qualidade || 0) >= 4.5 ? 'Atingida' : 'Em andamento',
          nextStep: (data.nota_media_qualidade || 0) >= 4.5 ? 'Manter padrão' : 'Treinar equipe',
          deadline: '1 mês',
          responsible: 'Gestão de Qualidade'
        }
      ];
      
      goals.forEach(goal => {
        excelData.push([goal.name, goal.current, goal.target, goal.status, goal.nextStep, goal.deadline, goal.responsible]);
      });
      excelData.push([]);
    }

    // ===== RESUMO EXECUTIVO =====
    excelData.push(['RESUMO EXECUTIVO']);
    excelData.push(['Indicador', 'Valor', 'Status Geral', 'Tendência', 'Recomendação']);
    
    const overallStatus = (data.taxa_conversao || 0) > 20 && (data.nota_media_qualidade || 0) > 4 ? 'Excelente' :
                         (data.taxa_conversao || 0) > 15 && (data.nota_media_qualidade || 0) > 3 ? 'Bom' : 'Precisa Melhorar';
    
    const overallTrend = (data.taxa_conversao || 0) > 20 ? 'Crescente' : (data.taxa_conversao || 0) > 15 ? 'Estável' : 'Decrescente';
    const recommendation = (data.taxa_conversao || 0) > 20 ? 'Manter estratégias atuais' : (data.taxa_conversao || 0) > 15 ? 'Otimizar processos' : 'Revisar estratégias';
    
    excelData.push(['Performance Geral', `${((data.taxa_conversao || 0) + (data.nota_media_qualidade || 0) * 20) / 2}%`, overallStatus, overallTrend, recommendation]);
    excelData.push(['Volume de Atendimentos', `${data.total_atendimentos?.toLocaleString('pt-BR') || 0}`, (data.total_atendimentos || 0) > 500 ? 'Alto' : 'Médio', (data.total_atendimentos || 0) > 500 ? 'Crescente' : 'Estável', (data.total_atendimentos || 0) > 500 ? 'Manter volume' : 'Aumentar volume']);
    excelData.push(['Eficiência Operacional', `${((data.tempo_medio_resposta || 0) < 300 ? 100 : 50)}%`, (data.tempo_medio_resposta || 0) < 300 ? 'Eficiente' : 'Melhorável', (data.tempo_medio_resposta || 0) < 300 ? 'Estável' : 'Melhorando', (data.tempo_medio_resposta || 0) < 300 ? 'Manter agilidade' : 'Otimizar processos']);
    excelData.push([]);

    // ===== FOOTER PROFISSIONAL =====
    excelData.push(['RELATÓRIO GERADO AUTOMATICAMENTE PELO SISTEMA METRICAWHATS']);
    excelData.push(['Transformando atendimentos do WhatsApp em resultados mensuráveis']);
    excelData.push(['Suporte: contato@metricawhats.com | WhatsApp: (11) 99999-9999']);

    // Converter para CSV (Excel-friendly)
    const csvContent = excelData.map(row => 
      row.map(cell => `"${cell?.replace(/"/g, '""') || ''}"`).join(',')
    ).join('\n');

    // Download com nome de arquivo Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `MetricaWhats_Relatorio_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Excel Exportado",
      description: "Relatório Excel gerado com formatação profissional. Abra no Microsoft Excel ou Google Sheets.",
    });
  };

  const exportToPDF = async (data: DashboardData, options: ExportOptions) => {
    try {
      // Criar conteúdo HTML para PDF com design moderno
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório WhatsApp Analytics</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              line-height: 1.6;
              color: #1f2937;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              min-height: 100vh;
            }
            
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 40px 20px;
              background: white;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
              border-radius: 16px;
              margin-top: 20px;
              margin-bottom: 20px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 3px solid #25D366;
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              margin: -40px -20px 40px -20px;
            }
            
            .header h1 {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .header .subtitle {
              font-size: 1.1rem;
              opacity: 0.9;
              font-weight: 400;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 40px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 12px;
              border: 1px solid #e2e8f0;
            }
            
            .info-item {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .info-item strong {
              color: #25D366;
              font-weight: 600;
            }
            
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            
            .section-title {
              font-size: 1.5rem;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #25D366;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            
            .metric-card {
              background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              transition: transform 0.2s ease;
            }
            
            .metric-card:hover {
              transform: translateY(-2px);
            }
            
            .metric-title {
              font-size: 0.875rem;
              font-weight: 500;
              color: #6b7280;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            
            .metric-value {
              font-size: 2rem;
              font-weight: 700;
              color: #25D366;
              margin-bottom: 5px;
            }
            
            .metric-description {
              font-size: 0.875rem;
              color: #9ca3af;
            }
            
            .table-container {
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.875rem;
            }
            
            th {
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              font-weight: 600;
              padding: 15px 20px;
              text-align: left;
              font-size: 0.875rem;
            }
            
            td {
              padding: 15px 20px;
              border-bottom: 1px solid #e2e8f0;
              font-weight: 500;
            }
            
            tr:nth-child(even) {
              background: #f8fafc;
            }
            
            tr:hover {
              background: #f1f5f9;
            }
            
            .insights-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
            }
            
            .insight-card {
              background: white;
              border-radius: 12px;
              padding: 20px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
              border-left: 4px solid #25D366;
            }
            
            .insight-card.positive {
              border-left-color: #10b981;
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            }
            
            .insight-card.negative {
              border-left-color: #ef4444;
              background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
            }
            
            .insight-title {
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .insight-content {
              color: #6b7280;
              font-size: 0.875rem;
              line-height: 1.5;
            }
            
            .highlights-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
            }
            
            .highlight-card {
              background: white;
              border-radius: 12px;
              padding: 20px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
            }
            
            .highlight-card.best {
              border-left: 4px solid #10b981;
              background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            }
            
            .highlight-card.critical {
              border-left: 4px solid #ef4444;
              background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
            }
            
            .highlight-header {
              display: flex;
              justify-content: between;
              align-items: center;
              margin-bottom: 15px;
            }
            
            .highlight-title {
              font-weight: 600;
              color: #1f2937;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .highlight-badge {
              background: #25D366;
              color: white;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.75rem;
              font-weight: 600;
            }
            
            .highlight-badge.critical {
              background: #ef4444;
            }
            
            .highlight-info {
              margin-bottom: 10px;
            }
            
            .highlight-info strong {
              color: #25D366;
              font-weight: 600;
            }
            
            .highlight-description {
              color: #6b7280;
              font-size: 0.875rem;
              line-height: 1.5;
            }
            
            .progress-bar {
              width: 100%;
              height: 8px;
              background: #e2e8f0;
              border-radius: 4px;
              overflow: hidden;
              margin: 10px 0;
            }
            
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #25D366 0%, #128C7E 100%);
              border-radius: 4px;
              transition: width 0.3s ease;
            }
            
            .footer {
              margin-top: 60px;
              padding-top: 30px;
              border-top: 2px solid #e2e8f0;
              text-align: center;
              color: #6b7280;
              font-size: 0.875rem;
            }
            
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 20px;
            }
            
                         .footer-logo {
               font-weight: 600;
               color: #25D366;
             }
             
             .status-badge {
               padding: 4px 12px;
               border-radius: 20px;
               font-size: 0.75rem;
               font-weight: 600;
               text-transform: uppercase;
               letter-spacing: 0.05em;
             }
             
             .status-badge.positive {
               background: #10b981;
               color: white;
             }
             
             .status-badge.negative {
               background: #ef4444;
               color: white;
             }
             
             .status-badge.neutral {
               background: #6b7280;
               color: white;
             }
            
            @media print {
              body {
                background: white;
              }
              .container {
                box-shadow: none;
                margin: 0;
                padding: 20px;
              }
              .header {
                margin: 0 0 30px 0;
                border-radius: 8px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Relatório WhatsApp Analytics</h1>
              <div class="subtitle">Análise completa dos atendimentos e performance</div>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <strong>📅 Período:</strong> ${options.dateRange?.start || data.periodo_inicio} a ${options.dateRange?.end || data.periodo_fim}
              </div>
              <div class="info-item">
                <strong>🕒 Gerado em:</strong> ${new Date().toLocaleString('pt-BR')}
              </div>
            </div>
      `;

      if (options.includeMetrics) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">📈 Métricas Principais</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-title">Total de Atendimentos</div>
                <div class="metric-value">${data.total_atendimentos?.toLocaleString() || 0}</div>
                <div class="metric-description">Conversas realizadas no período</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">Taxa de Conversão</div>
                <div class="metric-value">${data.taxa_conversao?.toFixed(1) || 0}%</div>
                <div class="metric-description">Percentual de vendas realizadas</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">Tempo Médio de Resposta</div>
                <div class="metric-value">${Math.floor((data.tempo_medio_resposta || 0) / 60)}m ${(data.tempo_medio_resposta || 0) % 60}s</div>
                <div class="metric-description">Velocidade média de resposta</div>
              </div>
              <div class="metric-card">
                <div class="metric-title">Nota Média de Qualidade</div>
                <div class="metric-value">${data.nota_media_qualidade?.toFixed(1) || 0}/5</div>
                <div class="metric-description">Satisfação média dos clientes</div>
              </div>
            </div>
          </div>
        `;
      }

      if (options.includeIntentions) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">🎯 Intenções dos Clientes</h2>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Intenção</th>
                    <th>Percentual</th>
                    <th>Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>🛒 Compra</td>
                    <td>${data.intencao_compra?.toFixed(1) || 0}%</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.intencao_compra || 0}%"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>❓ Dúvida Geral</td>
                    <td>${data.intencao_duvida_geral?.toFixed(1) || 0}%</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.intencao_duvida_geral || 0}%"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>⚠️ Reclamação</td>
                    <td>${data.intencao_reclamacao?.toFixed(1) || 0}%</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.intencao_reclamacao || 0}%"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>🛠️ Suporte</td>
                    <td>${data.intencao_suporte?.toFixed(1) || 0}%</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.intencao_suporte || 0}%"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>💰 Orçamento</td>
                    <td>${data.intencao_orcamento?.toFixed(1) || 0}%</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${data.intencao_orcamento || 0}%"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      if (options.includeInsights && (data.insights_funcionou?.length || data.insights_atrapalhou?.length)) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">💡 Insights de Performance</h2>
            <div class="insights-grid">
        `;
        
        if (data.insights_funcionou?.length) {
          htmlContent += `
            <div class="insight-card positive">
              <div class="insight-title">✅ O que Funcionou</div>
          `;
          data.insights_funcionou.forEach(insight => {
            const [title, description] = insight.split(': ');
            htmlContent += `
              <div class="insight-content">
                <strong>${title}:</strong> ${description}
              </div>
            `;
          });
          htmlContent += `</div>`;
        }
        
        if (data.insights_atrapalhou?.length) {
          htmlContent += `
            <div class="insight-card negative">
              <div class="insight-title">❌ O que Atrapalhou</div>
          `;
          data.insights_atrapalhou.forEach(insight => {
            const [title, description] = insight.split(': ');
            htmlContent += `
              <div class="insight-content">
                <strong>${title}:</strong> ${description}
              </div>
            `;
          });
          htmlContent += `</div>`;
        }
        
        htmlContent += `
            </div>
          </div>
        `;
      }

      if (options.includeHighlights) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">🏆 Destaques do Período</h2>
            <div class="highlights-grid">
        `;
        
        if (data.melhor_atendimento_cliente) {
          htmlContent += `
            <div class="highlight-card best">
              <div class="highlight-header">
                <div class="highlight-title">⭐ Melhor Atendimento</div>
                <div class="highlight-badge">${data.melhor_atendimento_nota?.toFixed(1) || 0}/5</div>
              </div>
              <div class="highlight-info">
                <strong>Cliente:</strong> ${data.melhor_atendimento_cliente}
              </div>
              <div class="highlight-description">
                ${data.melhor_atendimento_observacao || ''}
              </div>
            </div>
          `;
        }
        
        if (data.atendimento_critico_cliente) {
          htmlContent += `
            <div class="highlight-card critical">
              <div class="highlight-header">
                <div class="highlight-title">⚠️ Atendimento Crítico</div>
                <div class="highlight-badge critical">${data.atendimento_critico_nota?.toFixed(1) || 0}/5</div>
              </div>
              <div class="highlight-info">
                <strong>Cliente:</strong> ${data.atendimento_critico_cliente}
              </div>
              <div class="highlight-description">
                ${data.atendimento_critico_observacao || ''}
              </div>
            </div>
          `;
        }
        
        if (!data.melhor_atendimento_cliente && !data.atendimento_critico_cliente) {
          htmlContent += `
            <div class="highlight-card">
              <div class="highlight-title">📊 Nenhum destaque registrado</div>
              <div class="highlight-description">
                Os destaques aparecerão conforme os dados forem analisados e registrados.
              </div>
            </div>
          `;
        }
        
        htmlContent += `
            </div>
          </div>
        `;
      }

      if (options.includeAutomation && data.automacao_sugerida?.length) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">🤖 Automação Sugerida</h2>
            <div class="insights-grid">
        `;
        data.automacao_sugerida.forEach(automacao => {
          const [title, description] = automacao.split(': ');
          htmlContent += `
            <div class="insight-card">
              <div class="insight-title">⚡ ${title}</div>
              <div class="insight-content">${description}</div>
            </div>
          `;
        });
        htmlContent += `
            </div>
          </div>
        `;
      }

      if (options.includeActions && data.proximas_acoes?.length) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">📋 Próximas Ações</h2>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Status</th>
                    <th>Prazo</th>
                  </tr>
                </thead>
                <tbody>
        `;
        data.proximas_acoes.forEach(acao => {
          const match = acao.match(/^(.*?)\s*–\s*(.*?)\s*\((\d{4}-\d{2}-\d{2})\)$/);
          if (match) {
            const [, title, status, deadline] = match;
            const statusClass = status === 'Feito' ? 'positive' : status === 'Em andamento' ? 'neutral' : 'negative';
            htmlContent += `
              <tr>
                <td>${title}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>${deadline}</td>
              </tr>
            `;
          } else {
            htmlContent += `
              <tr>
                <td>${acao}</td>
                <td><span class="status-badge neutral">Pendente</span></td>
                <td>-</td>
              </tr>
            `;
          }
        });
        htmlContent += `
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      if (options.includeGoals) {
        htmlContent += `
          <div class="section">
            <h2 class="section-title">🎯 Metas e Progresso</h2>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Meta</th>
                    <th>Progresso Atual</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>📈 Taxa de Conversão</td>
                    <td>${data.meta_taxa_conversao || 'Não definida'}</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((data.taxa_conversao || 0) / 30) * 100}%"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>⏱️ Tempo de Resposta</td>
                    <td>${data.meta_tempo_resposta || 'Não definida'}</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.max(0, 100 - ((data.tempo_medio_resposta || 0) / 120) * 100)}%"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>⭐ Nota de Qualidade</td>
                    <td>${data.meta_nota_qualidade || 'Não definida'}</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((data.nota_media_qualidade || 0) / 4.5) * 100}%"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      htmlContent += `
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="footer-logo">MetricaWhats Analytics</div>
              <div>
                <p>Relatório gerado automaticamente</p>
                <p>© 2024 MetricaWhats - Todos os direitos reservados</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Criar blob e download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `whatsapp-analytics-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF Exportado",
        description: "O relatório foi exportado como HTML. Você pode abrir no navegador e imprimir como PDF.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const exportData = async (data: DashboardData, options: ExportOptions) => {
    setIsExporting(true);
    
    try {
      switch (options.format) {
        case 'csv':
          await exportToCSV(data, options);
          break;
        case 'excel':
          await exportToExcel(data, options);
          break;
        case 'pdf':
          await exportToPDF(data, options);
          break;
        default:
          throw new Error('Formato não suportado');
      }

      toast({
        title: "Exportação concluída!",
        description: `Relatório exportado em ${options.format.toUpperCase()} com sucesso.`,
      });
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportData,
    isExporting
  };
}
