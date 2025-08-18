import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, FileText, FileSpreadsheet, File, Info, Settings, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExportData, ExportFormat } from '@/hooks/useExportData';
import { DashboardData } from '@/hooks/useDashboardData';

interface ExportModalProps {
  data: DashboardData | null;
  trigger?: React.ReactNode;
}

export function ExportModal({ data, trigger }: ExportModalProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: data?.periodo_inicio ? new Date(data.periodo_inicio) : undefined,
    to: data?.periodo_fim ? new Date(data.periodo_fim) : undefined,
  });
  
  const [options, setOptions] = useState({
    includeMetrics: true,
    includeIntentions: true,
    includeInsights: true,
    includeHighlights: true,
    includeAutomation: true,
    includeActions: true,
    includeGoals: true,
  });

  const { exportData, isExporting } = useExportData();

  const handleExport = async () => {
    if (!data) return;

    await exportData(data, {
      format,
      dateRange: {
        start: data.periodo_inicio,
        end: data.periodo_fim,
      },
      ...options,
    });

    setOpen(false);
  };

  const formatOptions = [
    { 
      value: 'excel', 
      label: 'Excel (.xlsx)', 
      icon: FileSpreadsheet,
      description: 'Formato ideal para análise detalhada e gráficos',
      recommended: true
    },
    { 
      value: 'csv', 
      label: 'CSV (.csv)', 
      icon: FileText,
      description: 'Formato simples para importação em outros sistemas'
    },
    { 
      value: 'pdf', 
      label: 'PDF (.pdf)', 
      icon: File,
      description: 'Formato para apresentação e compartilhamento'
    },
  ];

  const getFormatIcon = (formatValue: ExportFormat) => {
    const option = formatOptions.find(opt => opt.value === formatValue);
    return option ? <option.icon className="h-4 w-4" /> : null;
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    setOptions({
      includeMetrics: true,
      includeIntentions: true,
      includeInsights: true,
      includeHighlights: true,
      includeAutomation: true,
      includeActions: true,
      includeGoals: true,
    });
  };

  const deselectAll = () => {
    setOptions({
      includeMetrics: false,
      includeIntentions: false,
      includeInsights: false,
      includeHighlights: false,
      includeAutomation: false,
      includeActions: false,
      includeGoals: false,
    });
  };

  const selectedCount = Object.values(options).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Relatório
          </DialogTitle>
          <DialogDescription>
            Configure as opções de exportação do seu relatório de analytics do WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formato */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Formato de Exportação</Label>
            <div className="grid gap-3">
              {formatOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all",
                    format === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => setFormat(option.value as ExportFormat)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <option.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                        {option.recommended && (
                          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 transition-colors",
                    format === option.value
                      ? "border-primary bg-primary"
                      : "border-border"
                  )}>
                    {format === option.value && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seções do Relatório */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Seções do Relatório</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs"
                >
                  Selecionar Tudo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deselectAll}
                  className="text-xs"
                >
                  Limpar
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-3">
              {selectedCount} de {Object.keys(options).length} seções selecionadas
            </div>

            <div className="grid gap-3">
              {[
                {
                  key: 'includeMetrics' as const,
                  label: '📈 Métricas Principais',
                  description: 'Total de atendimentos, taxa de conversão, tempo de resposta e nota de qualidade'
                },
                {
                  key: 'includeIntentions' as const,
                  label: '🎯 Intenções dos Clientes',
                  description: 'Distribuição das intenções identificadas nos atendimentos'
                },
                {
                  key: 'includeInsights' as const,
                  label: '💡 Insights de Performance',
                  description: 'O que funcionou bem e o que precisa melhorar'
                },
                {
                  key: 'includeHighlights' as const,
                  label: '🏆 Destaques do Período',
                  description: 'Melhor e pior atendimento do período'
                },
                {
                  key: 'includeAutomation' as const,
                  label: '🤖 Sugestões de Automação',
                  description: 'Recomendações de automação baseadas em IA'
                },
                {
                  key: 'includeActions' as const,
                  label: '📋 Próximas Ações',
                  description: 'Ações recomendadas para melhorar performance'
                },
                {
                  key: 'includeGoals' as const,
                  label: '🎯 Metas e Progresso',
                  description: 'Acompanhamento de metas e objetivos'
                }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id={key}
                    checked={options[key]}
                    onCheckedChange={() => toggleOption(key)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={key} className="font-medium cursor-pointer">
                      {label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações do Relatório */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Informações do Relatório</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Período:</span>
                <div className="font-medium">
                  {data?.periodo_inicio ? new Date(data.periodo_inicio).toLocaleDateString('pt-BR') : 'N/A'} a {data?.periodo_fim ? new Date(data.periodo_fim).toLocaleDateString('pt-BR') : 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Total de Atendimentos:</span>
                <div className="font-medium">
                  {data?.total_atendimentos?.toLocaleString('pt-BR') || '0'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Taxa de Conversão:</span>
                <div className="font-medium">
                  {data?.taxa_conversao?.toFixed(1) || '0'}%
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Nota Média:</span>
                <div className="font-medium">
                  {data?.nota_media_qualidade?.toFixed(1) || '0'}/5
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedCount === 0}
            className="flex-1"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
