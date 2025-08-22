import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTheme } from '@/hooks/useTheme';
import { ExportModal } from '@/components/ExportModal';
import { FilterModal } from '@/components/FilterModal';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';

import { 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Star, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  Filter,
  Download,
  Calendar,
  Target,
  Lightbulb,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Award,
  Activity,
  Eye,
  RefreshCw,
  Crown,
  Sun,
  Moon
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // WhatsApp instances data
  const { instances, isLoadingInstances } = useWhatsAppInstances();
  
  // IDs dos administradores autorizados
  const adminUserIds = [
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
  ];
  
  const isAdmin = adminUserIds.includes(user?.id || '');
  
  // Buscar dados do dashboard
  const { 
    data: dashboardData, 
    isLoading: isLoadingData, 
    error: dataError,
    refetch 
  } = useDashboardData(selectedDate || undefined);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  // Função para formatar mudança de tempo
  const formatTimeChange = (seconds: number): string => {
    const absSeconds = Math.abs(seconds);
    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = absSeconds % 60;
    
    if (minutes > 0) {
      return `${seconds > 0 ? '+' : '-'}${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds > 0 ? '+' : '-'}${remainingSeconds}s`;
  };

  // Função para determinar tendência baseada na mudança
  const getTrend = (change: number, metric: string): 'up' | 'down' | 'neutral' => {
    if (change === 0) return 'neutral';
    
    // Para tempo de resposta, menor é melhor
    if (metric === 'tempo') {
      return change < 0 ? 'up' : 'down';
    }
    
    // Para outros, maior é melhor
    return change > 0 ? 'up' : 'down';
  };

  // Dados reais do dashboard com comparação do dia anterior
  const metricsData: MetricCard[] = [
    {
      title: "Total de Atendimentos",
      value: dashboardData?.total_atendimentos?.toLocaleString() || "0",
      change: dashboardData?.comparison 
        ? `${dashboardData.comparison.total_atendimentos_change > 0 ? '+' : ''}${dashboardData.comparison.total_atendimentos_change.toFixed(1)}%`
        : "0%",
      trend: getTrend(dashboardData?.comparison?.total_atendimentos_change || 0, 'atendimentos'),
      icon: <MessageSquare className="h-5 w-5" />,
      color: "from-blue-500 to-blue-600",
      description: "Conversas realizadas no período"
    },
    {
      title: "Taxa de Conversão",
      value: `${dashboardData?.taxa_conversao?.toFixed(1) || 0}%`,
      change: dashboardData?.comparison 
        ? `${dashboardData.comparison.taxa_conversao_change > 0 ? '+' : ''}${dashboardData.comparison.taxa_conversao_change.toFixed(1)}%`
        : "0%",
      trend: getTrend(dashboardData?.comparison?.taxa_conversao_change || 0, 'taxa'),
      icon: <TrendingUp className="h-5 w-5" />,
      color: "from-green-500 to-green-600",
      description: "Percentual de vendas realizadas"
    },
    {
      title: "Tempo Médio de Resposta",
      value: dashboardData?.tempo_medio_resposta 
        ? `${Math.floor(dashboardData.tempo_medio_resposta / 60)}m ${dashboardData.tempo_medio_resposta % 60}s`
        : "0s",
      change: dashboardData?.comparison 
        ? formatTimeChange(dashboardData.comparison.tempo_medio_resposta_change)
        : "0s",
      trend: getTrend(dashboardData?.comparison?.tempo_medio_resposta_change || 0, 'tempo'),
      icon: <Clock className="h-5 w-5" />,
      color: "from-purple-500 to-purple-600",
      description: "Velocidade média de resposta"
    },
    {
      title: "Nota Média de Qualidade",
      value: `${dashboardData?.nota_media_qualidade?.toFixed(1) || 0}/5`,
      change: dashboardData?.comparison 
        ? `${dashboardData.comparison.nota_media_qualidade_change > 0 ? '+' : ''}${dashboardData.comparison.nota_media_qualidade_change.toFixed(1)}`
        : "0",
      trend: getTrend(dashboardData?.comparison?.nota_media_qualidade_change || 0, 'nota'),
      icon: <Star className="h-5 w-5" />,
      color: "from-yellow-500 to-yellow-600",
      description: "Satisfação média dos clientes"
    }
  ];

  const intentionsData = [
    { name: "Compra", percentage: dashboardData?.intencao_compra || 0, color: "#10b981", icon: "🛒" },
    { name: "Dúvida Geral", percentage: dashboardData?.intencao_duvida_geral || 0, color: "#3b82f6", icon: "❓" },
    { name: "Reclamação", percentage: dashboardData?.intencao_reclamacao || 0, color: "#ef4444", icon: "⚠️" },
    { name: "Suporte", percentage: dashboardData?.intencao_suporte || 0, color: "#f59e0b", icon: "🛠️" },
    { name: "Orçamento", percentage: dashboardData?.intencao_orcamento || 0, color: "#8b5cf6", icon: "💰" }
  ];

  // Processar próximas ações do dashboard
  const tasksData = dashboardData?.proximas_acoes?.map((acao, index) => {
    const match = acao.match(/^(.*?)\s*–\s*(.*?)\s*\((\d{4}-\d{2}-\d{2})\)$/);
    if (match) {
      const [, title, status, deadline] = match;
      return {
        id: index + 1,
        title,
        status: status === 'Feito' ? 'concluida' : status === 'Em andamento' ? 'em_andamento' : 'pendente',
        priority: 'media',
        deadline
      };
    }
    return {
      id: index + 1,
      title: acao,
      status: 'pendente' as const,
      priority: 'media' as const,
      deadline: new Date().toISOString().split('T')[0]
    };
  }) || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header skeleton */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg animate-pulse"></div>
                <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Title skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-3">
              <div className="h-10 w-80 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-5 w-96 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-24 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-10 w-28 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-20 bg-muted rounded-lg animate-pulse mb-3"></div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
            <p className="text-lg font-medium text-muted-foreground mb-2">Carregando dados do dashboard...</p>
            <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
          </div>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Erro ao carregar dados</h3>
          <p className="text-muted-foreground mb-6">Não foi possível carregar os dados do dashboard. Tente novamente.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => refetch()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header melhorado */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="p-0 h-auto hover:bg-transparent group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary/60 transition-all duration-200">
                      MetricsIA
                    </span>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                      Analytics Dashboard
                    </div>
                  </div>
                </div>
              </Button>
            </div>
                          <div className="flex items-center gap-4">
                {/* WhatsApp Status - Mobile Indicator */}
                <div className="lg:hidden">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/whatsapp-connect')}
                        className="relative"
                      >
                        <MessageSquare className="h-4 w-4" />
                        {instances && instances.length > 0 && instances.filter(i => i.status === 'connected').length === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        )}
                        {instances && instances.length > 0 && instances.filter(i => i.status === 'connected').length > 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="text-xs">
                        {instances && instances.length > 0 ? (
                          <div>
                            <div className="font-medium mb-1">WhatsApp Status</div>
                            <div>{instances.filter(i => i.status === 'connected').length} de {instances.length} conectadas</div>
                          </div>
                        ) : (
                          <div>Conectar WhatsApp</div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                                {/* WhatsApp Status - Compact */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hidden lg:flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/70 transition-colors">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">WhatsApp</span>
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      {isLoadingInstances ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                          <span className="text-xs text-muted-foreground">Carregando...</span>
                        </div>
                      ) : instances && instances.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {instances.filter(i => i.status === 'connected').length > 0 ? (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            ) : (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                            <span className="text-xs font-medium">
                              {instances.filter(i => i.status === 'connected').length} de {instances.length} conectadas
                            </span>
                          </div>
                          {instances.filter(i => i.status === 'connected').length === 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate('/whatsapp-connect')}
                              className="h-6 px-2 text-xs hover:bg-primary/10"
                            >
                              Conectar
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">Nenhuma instância</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/whatsapp-connect')}
                            className="h-6 px-2 text-xs hover:bg-primary/10"
                          >
                            Conectar
                          </Button>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-2">
                      <div className="font-medium">Status do WhatsApp</div>
                      {instances && instances.length > 0 ? (
                        <div className="space-y-1">
                          {instances.map((instance) => (
                            <div key={instance.id} className="flex items-center justify-between text-xs">
                              <span>{instance.instance_name}</span>
                              <div className="flex items-center gap-1">
                                {instance.status === 'connected' ? (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                ) : instance.status === 'connecting' ? (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                ) : (
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                )}
                                <span className="text-muted-foreground">
                                  {instance.status === 'connected' ? 'Conectado' : 
                                   instance.status === 'connecting' ? 'Conectando' : 'Desconectado'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          Nenhuma instância configurada. Clique para conectar.
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium">{user.email}</div>
                <div className="text-xs text-muted-foreground">Usuário ativo</div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="rounded-full"
                >
                  <Crown className="h-4 w-4" />
                </Button>
              )}
              {/* Botão de alternância de tema */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="rounded-full hover:bg-accent"
                  >
                    {isDark ? (
                      <Sun className="h-4 w-4 transition-all duration-200 hover:rotate-12" />
                    ) : (
                      <Moon className="h-4 w-4 transition-all duration-200 hover:rotate-12" />
                    )}
                    <span className="sr-only">Alternar tema</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}</p>
                </TooltipContent>
              </Tooltip>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                disabled={loading}
                className="rounded-full"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header da página */}
        <section className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Dashboard Analítico
                </h1>
                {selectedDate && (
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedDate.toLocaleDateString('pt-BR')}
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Análise completa e insights detalhados dos seus atendimentos do WhatsApp
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/whatsapp-connect')}
                size="lg" 
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <MessageSquare className="h-4 w-4" />
                Conectar WhatsApp
              </Button>
              <FilterModal 
                onFilterChange={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    toast({
                      title: "Data selecionada",
                      description: `Exibindo relatório de ${date.toLocaleDateString('pt-BR')}`,
                    });
                  } else {
                    toast({
                      title: "Filtro removido",
                      description: "Exibindo relatório mais recente",
                    });
                  }
                }}
                currentDate={selectedDate}
                trigger={
                  <Button variant="outline" size="lg" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedDate ? 'Filtrado' : 'Filtrar'}
                  </Button>
                }
              />
              <ExportModal 
                data={dashboardData} 
                trigger={
                  <Button variant="outline" size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                }
              />
            </div>
          </div>
        </section>

        {/* Métricas Principais - Cards melhorados */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Métricas Principais</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metricsData.map((metric, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {metric.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} text-white`}>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.description}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    metric.trend === 'up' ? 'text-emerald-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {metric.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                    <span className="font-medium">{metric.change}</span>
                    <span className="text-muted-foreground">vs dia anterior</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seção de Insights - Layout melhorado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Intenções dos Clientes */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Intenções dos Clientes
              </CardTitle>
              <CardDescription>
                Distribuição das intenções identificadas nos atendimentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {intentionsData.map((intention, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{intention.icon}</span>
                      <span className="text-sm font-medium">{intention.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{intention.percentage}%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={intention.percentage} 
                      className="h-3 bg-muted/50" 
                    />
                    <div 
                      className={`absolute inset-0 h-3 rounded-full ${intention.color} opacity-20`}
                      style={{ width: `${intention.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Insights de Performance */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Insights de Performance
              </CardTitle>
              <CardDescription>
                Pontos fortes e áreas de melhoria identificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="funcionou" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger value="funcionou" className="flex items-center gap-2 data-[state=active]:bg-background">
                    <ThumbsUp className="h-4 w-4" />
                    O que funcionou
                  </TabsTrigger>
                  <TabsTrigger value="atrapalhou" className="flex items-center gap-2 data-[state=active]:bg-background">
                    <ThumbsDown className="h-4 w-4" />
                    O que atrapalhou
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="funcionou" className="space-y-3 mt-4">
                  {dashboardData?.insights_funcionou?.map((insight, index) => {
                    const [title, description] = insight.split(': ');
                    return (
                      <div key={index} className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                            <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">{title}</div>
                            <div className="text-sm text-emerald-600 dark:text-emerald-300">{description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                      <div className="text-sm text-muted-foreground text-center">Nenhum insight positivo registrado ainda.</div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="atrapalhou" className="space-y-3 mt-4">
                  {dashboardData?.insights_atrapalhou?.map((insight, index) => {
                    const [title, description] = insight.split(': ');
                    return (
                      <div key={index} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800/50">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                            <ThumbsDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-red-800 dark:text-red-200 mb-1">{title}</div>
                            <div className="text-sm text-red-600 dark:text-red-300">{description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }) || (
                    <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                      <div className="text-sm text-muted-foreground text-center">Nenhum problema identificado ainda.</div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Destaques e Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Destaque do Período */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Destaque do Período
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData?.melhor_atendimento_cliente && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 text-sm">
                      <Star className="h-3 w-3" />
                      Melhor Atendimento
                    </span>
                    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-xs">
                      {dashboardData.melhor_atendimento_nota?.toFixed(1) || '5.0'}★
                    </Badge>
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-1 font-medium">
                    {dashboardData.melhor_atendimento_cliente}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 line-clamp-2">
                    {dashboardData.melhor_atendimento_observacao}
                  </div>
                </div>
              )}

              {dashboardData?.atendimento_critico_cliente && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      Atendimento Crítico
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {dashboardData.atendimento_critico_nota?.toFixed(1) || '1.5'}★
                    </Badge>
                  </div>
                  <div className="text-xs text-red-700 dark:text-red-300 mb-1 font-medium">
                    {dashboardData.atendimento_critico_cliente}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400 line-clamp-2">
                    {dashboardData.atendimento_critico_observacao}
                  </div>
                </div>
              )}

              {!dashboardData?.melhor_atendimento_cliente && !dashboardData?.atendimento_critico_cliente && (
                <div className="p-3 bg-muted/50 rounded-lg border border-border/50 text-center">
                  <div className="text-xs text-muted-foreground">Nenhum destaque registrado ainda.</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Automação Sugerida */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Automação Sugerida
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashboardData?.automacao_sugerida?.map((automacao, index) => {
                const [title, description] = automacao.split(': ');
                return (
                  <div key={index} className="p-2 border border-border/50 rounded-lg bg-muted/20">
                    <div className="flex items-start gap-2">
                      <Zap className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-xs">{title}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</div>
                      </div>
                    </div>
                  </div>
                );
              }) || (
                <div className="p-3 border border-border/50 rounded-lg bg-muted/20 text-center">
                  <Bot className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <div className="font-medium text-xs">Nenhuma automação sugerida</div>
                  <div className="text-xs text-muted-foreground mt-1">As sugestões aparecerão conforme os dados forem analisados</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próximas Ações */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Próximas Ações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tasksData.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border border-border/50 rounded-lg bg-muted/20">
                  <div className="flex-1">
                    <div className="font-medium text-xs line-clamp-1">{task.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={
                          task.status === 'concluida' ? 'default' : 
                          task.status === 'em_andamento' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {task.status === 'concluida' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {task.status === 'em_andamento' && <Clock className="h-3 w-3 mr-1" />}
                        {task.status === 'pendente' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {task.status === 'concluida' ? 'Feito' : 
                         task.status === 'em_andamento' ? 'Em andamento' : 'Pendente'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{task.deadline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>



        {/* Footer melhorado */}
        <div className="text-center py-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Última análise: {dashboardData?.updated_at ? new Date(dashboardData.updated_at).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Período: {dashboardData?.periodo_inicio ? new Date(dashboardData.periodo_inicio).toLocaleDateString('pt-BR') : '-'} a {dashboardData?.periodo_fim ? new Date(dashboardData.periodo_fim).toLocaleDateString('pt-BR') : '-'}</span>
            </div>
            <div className="hidden md:block">•</div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>MetricsIA Analytics Engine v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}