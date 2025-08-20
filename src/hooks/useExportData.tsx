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
    csvData.push(['📧 Suporte: contato@metricawhats.com | 📱 WhatsApp: +55 31 99495-9512']);
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
    excelData.push(['Suporte: contato@metricawhats.com | WhatsApp: +55 31 99495-9512']);

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
      // Verificar se jsPDF está disponível
      if (typeof window !== 'undefined') {
        // Importar jsPDF dinamicamente
        const jsPDF = (await import('jspdf')).default;
        const html2canvas = (await import('html2canvas')).default;
        
        // Criar elemento temporário para renderizar o HTML
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '1200px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '20px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.fontSize = '12px';
        tempDiv.style.lineHeight = '1.4';
        
        // Criar conteúdo HTML para PDF
        let htmlContent = `
          <div style="max-width: 1200px; margin: 0 auto; background: white; padding: 20px;">
            <!-- Cabeçalho -->
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; border-radius: 8px;">
              <h1 style="font-size: 24px; margin: 0 0 10px 0; font-weight: bold;">📊 RELATÓRIO WHATSAPP ANALYTICS</h1>
              <p style="margin: 0; opacity: 0.9;">MetricaWhats - Análise de Atendimentos</p>
            </div>
            
            <!-- Informações do Relatório -->
            <div style="margin-bottom: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937;">📋 INFORMAÇÕES DO RELATÓRIO</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                <div><strong>Período:</strong> ${options.dateRange?.start || data.periodo_inicio} a ${options.dateRange?.end || data.periodo_fim}</div>
                <div><strong>Gerado em:</strong> ${formatDate(new Date())}</div>
                <div><strong>Versão:</strong> MetricaWhats Analytics v1.0</div>
                <div><strong>Gerado por:</strong> Sistema Automático</div>
              </div>
            </div>
        `;

        // Adicionar métricas principais
        if (options.includeMetrics) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">📈 MÉTRICAS PRINCIPAIS</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="font-size: 10px; color: #6b7280; margin-bottom: 5px;">TOTAL DE ATENDIMENTOS</div>
                  <div style="font-size: 20px; font-weight: bold; color: #25D366; margin-bottom: 5px;">${data.total_atendimentos?.toLocaleString('pt-BR') || '0'}</div>
                  <div style="font-size: 10px; color: #9ca3af;">atendimentos</div>
                </div>
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="font-size: 10px; color: #6b7280; margin-bottom: 5px;">TAXA DE CONVERSÃO</div>
                  <div style="font-size: 20px; font-weight: bold; color: #25D366; margin-bottom: 5px;">${data.taxa_conversao?.toFixed(1) || '0'}%</div>
                  <div style="font-size: 10px; color: #9ca3af;">percentual</div>
                </div>
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="font-size: 10px; color: #6b7280; margin-bottom: 5px;">TEMPO MÉDIO DE RESPOSTA</div>
                  <div style="font-size: 20px; font-weight: bold; color: #25D366; margin-bottom: 5px;">${formatTime(data.tempo_medio_resposta || 0)}</div>
                  <div style="font-size: 10px; color: #9ca3af;">minutos</div>
                </div>
                <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="font-size: 10px; color: #6b7280; margin-bottom: 5px;">SATISFAÇÃO DO CLIENTE</div>
                  <div style="font-size: 20px; font-weight: bold; color: #25D366; margin-bottom: 5px;">${data.nota_media_qualidade?.toFixed(1) || '0'}/5</div>
                  <div style="font-size: 10px; color: #9ca3af;">pontos</div>
                </div>
              </div>
            </div>
          `;
        }

        // Adicionar intenções dos clientes
        if (options.includeIntentions) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">🎯 INTENÇÕES DOS CLIENTES</h2>
              <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                  <thead>
                    <tr style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white;">
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Intenção</th>
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Percentual</th>
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Progresso</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 15px;">🛒 Compra</td>
                      <td style="padding: 12px 15px;">${data.intencao_compra?.toFixed(1) || '0'}%</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${data.intencao_compra || 0}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                      <td style="padding: 12px 15px;">❓ Dúvida Geral</td>
                      <td style="padding: 12px 15px;">${data.intencao_duvida_geral?.toFixed(1) || '0'}%</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${data.intencao_duvida_geral || 0}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 15px;">⚠️ Reclamação</td>
                      <td style="padding: 12px 15px;">${data.intencao_reclamacao?.toFixed(1) || '0'}%</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${data.intencao_reclamacao || 0}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                      <td style="padding: 12px 15px;">🛠️ Suporte</td>
                      <td style="padding: 12px 15px;">${data.intencao_suporte?.toFixed(1) || '0'}%</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${data.intencao_suporte || 0}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 15px;">💰 Orçamento</td>
                      <td style="padding: 12px 15px;">${data.intencao_orcamento?.toFixed(1) || '0'}%</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${data.intencao_orcamento || 0}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        // Adicionar insights detalhados
        if (options.includeInsights && (data.insights_funcionou?.length || data.insights_atrapalhou?.length)) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">💡 INSIGHTS DE PERFORMANCE</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          `;
          
          if (data.insights_funcionou?.length) {
            htmlContent += `
              <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #10b981;">
                <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #10b981;">✅ O que Funcionou</h3>
            `;
            data.insights_funcionou.forEach(insight => {
              const [title, description] = insight.split(': ');
              htmlContent += `
                <div style="font-size: 12px; color: #374151; margin-bottom: 8px;">
                  <strong>${title}:</strong> ${description}
                </div>
              `;
            });
            htmlContent += `</div>`;
          }
          
          if (data.insights_atrapalhou?.length) {
            htmlContent += `
              <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #ef4444;">
                <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #ef4444;">❌ O que Atrapalhou</h3>
            `;
            data.insights_atrapalhou.forEach(insight => {
              const [title, description] = insight.split(': ');
              htmlContent += `
                <div style="font-size: 12px; color: #374151; margin-bottom: 8px;">
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

        // Adicionar destaques do período
        if (options.includeHighlights) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">🏆 DESTAQUES DO PERÍODO</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          `;
          
          if (data.melhor_atendimento_cliente) {
            htmlContent += `
              <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #10b981;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h3 style="font-size: 14px; margin: 0; color: #10b981;">⭐ Melhor Atendimento</h3>
                  <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">${data.melhor_atendimento_nota?.toFixed(1) || '0'}/5</span>
                </div>
                <div style="font-size: 12px; color: #374151; margin-bottom: 5px;">
                  <strong>Cliente:</strong> ${data.melhor_atendimento_cliente}
                </div>
                <div style="font-size: 11px; color: #6b7280;">
                  ${data.melhor_atendimento_observacao || ''}
                </div>
              </div>
            `;
          }
          
          if (data.atendimento_critico_cliente) {
            htmlContent += `
              <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #ef4444;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h3 style="font-size: 14px; margin: 0; color: #ef4444;">⚠️ Atendimento Crítico</h3>
                  <span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">${data.atendimento_critico_nota?.toFixed(1) || '0'}/5</span>
                </div>
                <div style="font-size: 12px; color: #374151; margin-bottom: 5px;">
                  <strong>Cliente:</strong> ${data.atendimento_critico_cliente}
                </div>
                <div style="font-size: 11px; color: #6b7280;">
                  ${data.atendimento_critico_observacao || ''}
                </div>
              </div>
            `;
          }
          
          if (!data.melhor_atendimento_cliente && !data.atendimento_critico_cliente) {
            htmlContent += `
              <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #1f2937;">📊 Nenhum destaque registrado</h3>
                <div style="font-size: 11px; color: #6b7280;">
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

        // Adicionar automação sugerida
        if (options.includeAutomation && data.automacao_sugerida?.length) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">🤖 AUTOMAÇÃO SUGERIDA</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">
          `;
          data.automacao_sugerida.forEach(automacao => {
            const [title, description] = automacao.split(': ');
            htmlContent += `
              <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #25D366;">
                <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #25D366;">⚡ ${title}</h3>
                <div style="font-size: 12px; color: #374151;">${description}</div>
              </div>
            `;
          });
          htmlContent += `
              </div>
            </div>
          `;
        }

        // Adicionar próximas ações
        if (options.includeActions && data.proximas_acoes?.length) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">📋 PRÓXIMAS AÇÕES</h2>
              <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                  <thead>
                    <tr style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white;">
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Ação</th>
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Status</th>
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Prazo</th>
                    </tr>
                  </thead>
                  <tbody>
          `;
          data.proximas_acoes.forEach((acao, index) => {
            const match = acao.match(/^(.*?)\s*–\s*(.*?)\s*\((\d{4}-\d{2}-\d{2})\)$/);
            if (match) {
              const [, title, status, deadline] = match;
              const statusColor = status === 'Feito' ? '#10b981' : status === 'Em andamento' ? '#f59e0b' : '#ef4444';
              const bgColor = index % 2 === 0 ? 'white' : '#f8fafc';
              htmlContent += `
                <tr style="border-bottom: 1px solid #e2e8f0; background: ${bgColor};">
                  <td style="padding: 12px 15px;">${title}</td>
                  <td style="padding: 12px 15px;">
                    <span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">${status}</span>
                  </td>
                  <td style="padding: 12px 15px;">${deadline}</td>
                </tr>
              `;
            } else {
              const bgColor = index % 2 === 0 ? 'white' : '#f8fafc';
              htmlContent += `
                <tr style="border-bottom: 1px solid #e2e8f0; background: ${bgColor};">
                  <td style="padding: 12px 15px;">${acao}</td>
                  <td style="padding: 12px 15px;">
                    <span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">Pendente</span>
                  </td>
                  <td style="padding: 12px 15px;">-</td>
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

        // Adicionar metas e progresso
        if (options.includeGoals) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">🎯 METAS E PROGRESSO</h2>
              <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                  <thead>
                    <tr style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white;">
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Meta</th>
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Progresso Atual</th>
                      <th style="padding: 12px 15px; text-align: left; font-weight: 600;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 12px 15px;">📈 Taxa de Conversão</td>
                      <td style="padding: 12px 15px;">${data.meta_taxa_conversao || 'Não definida'}</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${Math.min(100, ((data.taxa_conversao || 0) / 30) * 100)}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                      <td style="padding: 12px 15px;">⏱️ Tempo de Resposta</td>
                      <td style="padding: 12px 15px;">${data.meta_tempo_resposta || 'Não definida'}</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${Math.max(0, Math.min(100, 100 - ((data.tempo_medio_resposta || 0) / 120) * 100))}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 15px;">⭐ Nota de Qualidade</td>
                      <td style="padding: 12px 15px;">${data.meta_nota_qualidade || 'Não definida'}</td>
                      <td style="padding: 12px 15px;">
                        <div style="width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
                          <div style="height: 100%; background: linear-gradient(90deg, #25D366 0%, #128C7E 100%); width: ${Math.min(100, ((data.nota_media_qualidade || 0) / 4.5) * 100)}%; border-radius: 4px;"></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }

        // Adicionar insights básicos se não houver insights detalhados
        if (options.includeInsights && (!data.insights_funcionou?.length && !data.insights_atrapalhou?.length)) {
          htmlContent += `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1f2937; border-bottom: 2px solid #25D366; padding-bottom: 5px;">💡 INSIGHTS E RECOMENDAÇÕES</h2>
              <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #10b981;">
                  <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #10b981;">🎯 Oportunidade de Melhoria</h3>
                  <p style="font-size: 12px; margin: 0; color: #374151;">Sua taxa de conversão está ${(data.taxa_conversao || 0) > 20 ? 'excelente' : 'boa, mas pode melhorar'}. Considere implementar automações para aumentar ainda mais os resultados.</p>
                </div>
                <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b;">
                  <h3 style="font-size: 14px; margin: 0 0 10px 0; color: #f59e0b;">⚡ Otimização de Processos</h3>
                  <p style="font-size: 12px; margin: 0; color: #374151;">O tempo médio de resposta de ${formatTime(data.tempo_medio_resposta || 0)} pode ser otimizado com respostas automáticas e templates.</p>
                </div>
              </div>
            </div>
          `;
        }

        // Adicionar rodapé
        htmlContent += `
            <div style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 14px; font-weight: bold; color: #25D366; margin-bottom: 5px;">MetricaWhats Analytics</div>
              <div style="font-size: 10px; color: #6b7280;">
                <p style="margin: 2px 0;">Relatório gerado automaticamente</p>
                <p style="margin: 2px 0;">© 2024 MetricaWhats - Todos os direitos reservados</p>
                <p style="margin: 2px 0;">📧 contato@metricawhats.com | 📱 +55 31 99495-9512</p>
              </div>
            </div>
          </div>
        `;

        // Inserir o HTML no elemento temporário
        tempDiv.innerHTML = htmlContent;
        document.body.appendChild(tempDiv);

        // Aguardar um pouco para o DOM ser renderizado
        await new Promise(resolve => setTimeout(resolve, 100));

        // Capturar o elemento como canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 1200,
          height: tempDiv.scrollHeight
        });

        // Remover o elemento temporário
        document.body.removeChild(tempDiv);

        // Criar PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Adicionar primeira página
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Adicionar páginas adicionais se necessário
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Salvar PDF
        pdf.save(`whatsapp-analytics-${new Date().toISOString().split('T')[0]}.pdf`);

        toast({
          title: "PDF Exportado",
          description: "O relatório foi exportado como PDF com sucesso!",
        });
      } else {
        throw new Error('jsPDF não está disponível');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      
      // Fallback: gerar HTML se jsPDF falhar
      toast({
        title: "Aviso",
        description: "Gerando HTML como alternativa. Você pode imprimir como PDF no navegador.",
      });
      
      // Gerar HTML como fallback
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório WhatsApp Analytics</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .metric { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 RELATÓRIO WHATSAPP ANALYTICS</h1>
            <p>MetricaWhats - ${formatDate(new Date())}</p>
          </div>
          <div class="metric">
            <h3>Total de Atendimentos: ${data.total_atendimentos?.toLocaleString('pt-BR') || '0'}</h3>
            <h3>Taxa de Conversão: ${data.taxa_conversao?.toFixed(1) || '0'}%</h3>
            <h3>Tempo Médio de Resposta: ${formatTime(data.tempo_medio_resposta || 0)}</h3>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `whatsapp-analytics-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
