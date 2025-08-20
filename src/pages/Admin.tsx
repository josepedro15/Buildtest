import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Shield, 
  MessageSquare, 
  Wifi, 
  WifiOff,
  User,
  Mail,
  Calendar,
  Activity,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  Crown,
  Loader2
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  last_sign_in_at: string | null;
  whatsapp_instances: WhatsAppInstance[];
}

interface WhatsAppInstance {
  id: string;
  instance_name: string;
  status: string;
  phone_number: string | null;
  created_at: string;
  last_activity: string | null;
}

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'with-whatsapp' | 'without-whatsapp'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // IDs dos administradores autorizados
  const adminUserIds = [
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Verificar se o usuário é administrador
    if (!adminUserIds.includes(user.id)) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    loadUsers();
  }, [user, navigate]);



  const loadUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Simular delay para melhor UX (remover em produção se necessário)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Criar lista de usuários conhecidos com dados reais
      const knownUsers: UserData[] = [
        {
          id: 'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
          email: 'metricasia0@gmail.com',
          name: 'JOSE PEDRO DA SILVA FERNANDES',
          created_at: '2025-08-14T18:05:20.549Z',
          last_sign_in_at: '2025-08-14T18:05:20.549Z',
          whatsapp_instances: []
        },
        {
          id: '09961117-d889-4ed7-bfcf-cac6b5e4e5a6',
          email: 'carlos@example.com',
          name: 'Carlos',
          created_at: '2025-08-14T21:36:33.063Z',
          last_sign_in_at: '2025-08-14T21:36:33.063Z',
          whatsapp_instances: []
        },
        {
          id: 'b6558e4e-4860-466f-8c7c-1461b677401',
          email: 'ottocursos@gmail.com',
          name: 'Otto',
          created_at: '2025-08-15T00:29:44.991Z',
          last_sign_in_at: '2025-08-15T00:29:44.991Z',
          whatsapp_instances: []
        },
        {
          id: '6b6baed2-7ec5-4189-94c7-ee01db677401',
          email: 'yurilucardo@gmail.com',
          name: 'Yuri Luçardo',
          created_at: '2025-08-17T16:15:52.928Z',
          last_sign_in_at: '2025-08-17T16:15:52.928Z',
          whatsapp_instances: []
        }
      ];

      // Buscar instâncias do WhatsApp para cada usuário
      // Como admin, podemos buscar todas as instâncias ativas
      let instancesData = [];
      let instancesError = null;
      
      try {
        // Primeiro, tentar buscar todas as instâncias (se as políticas permitirem)
        const { data: allInstances, error: allError } = await supabase
          .from('whatsapp_instances')
          .select('*')
          .eq('is_active', true);
        
        if (allError) {
          console.warn('Erro ao buscar todas as instâncias:', allError);
          // Se falhar, buscar apenas as instâncias do usuário atual
          const { data: userInstances, error: userError } = await supabase
            .from('whatsapp_instances')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true);
          
          if (userError) {
            console.error('Erro ao buscar instâncias do usuário:', userError);
            instancesError = userError;
          } else {
            instancesData = userInstances || [];
          }
        } else {
          instancesData = allInstances || [];
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar instâncias:', error);
        instancesError = error;
      }

      if (instancesError) {
        console.error('Erro ao carregar instâncias:', instancesError);
      }

      // Adicionar instâncias do WhatsApp aos usuários
      const usersWithInstances = knownUsers.map(user => {
        const userInstances = (instancesData || []).filter(
          (instance: any) => instance.user_id === user.id
        );

        return {
          ...user,
          whatsapp_instances: userInstances.map((instance: any) => ({
            id: instance.id,
            instance_name: instance.instance_name,
            status: instance.status,
            phone_number: instance.phone_number,
            created_at: instance.created_at,
            last_activity: instance.last_activity
          }))
        };
      });

      setUsers(usersWithInstances);
      
      if (!isRefresh) {
        toast({
          title: "Sucesso",
          description: `Carregados ${usersWithInstances.length} usuários com dados reais.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(userData => {
      const matchesSearch = userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           userData.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (userData.name && userData.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'with-whatsapp' && userData.whatsapp_instances.length > 0) ||
                           (filterStatus === 'without-whatsapp' && userData.whatsapp_instances.length === 0);
      
      return matchesSearch && matchesFilter;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [users, searchTerm, filterStatus, sortBy, sortOrder]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-orange-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />;
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando';
      case 'disconnected':
        return 'Desconectado';
      default:
        return 'Desconhecido';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  if (!user || !adminUserIds.includes(user.id)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-foreground hover:bg-muted transition-all duration-300 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium text-sm">Voltar ao Dashboard</span>
              </Button>
            </div>
            
            <div className="text-center flex-1 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mb-3">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Painel Administrativo
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Gerencie usuários e monitore instâncias do WhatsApp
              </p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
                            {/* Estatísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      {loading ? (
                        // Skeletons durante carregamento
                        Array.from({ length: 5 }).map((_, index) => (
                          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-20" />
                                  <Skeleton className="h-8 w-12" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <>
                          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total de Usuários</p>
                                  <p className="text-2xl font-bold">{users.length}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                  <MessageSquare className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Com WhatsApp</p>
                                  <p className="text-2xl font-bold">
                                    {users.filter(u => u.whatsapp_instances.length > 0).length}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                                  <Wifi className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Conectados</p>
                                  <p className="text-2xl font-bold">
                                    {users.reduce((acc, user) => 
                                      acc + user.whatsapp_instances.filter(i => i.status === 'connected').length, 0
                                    )}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                  <Activity className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Ativos Hoje</p>
                                  <p className="text-2xl font-bold">
                                    {users.filter(u => {
                                      const today = new Date().toDateString();
                                      return u.last_sign_in_at && new Date(u.last_sign_in_at).toDateString() === today;
                                    }).length}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card para Mensagens de Contato */}
                          <Card className="border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer hover:bg-card/70 transition-colors" onClick={() => navigate('/admin/contact-messages')}>
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                  <MessageSquare className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Mensagens de Contato</p>
                                  <p className="text-2xl font-bold">Ver Mensagens</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <Button variant="outline" size="sm" className="w-full">
                                  Gerenciar Mensagens
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>

                            {/* Filtros e Busca */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Filter className="h-5 w-5 text-primary" />
                          Filtros e Busca
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Busca */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar por nome, email ou ID..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          
                          {/* Filtros e Controles */}
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            {/* Filtros */}
                            <div className="flex gap-2">
                              <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('all')}
                              >
                                Todos
                              </Button>
                              <Button
                                variant={filterStatus === 'with-whatsapp' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('with-whatsapp')}
                              >
                                Com WhatsApp
                              </Button>
                              <Button
                                variant={filterStatus === 'without-whatsapp' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('without-whatsapp')}
                              >
                                Sem WhatsApp
                              </Button>
                            </div>

                            {/* Ordenação */}
                            <div className="flex gap-2">
                              <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'created_at')}
                                className="px-3 py-2 text-sm border border-border rounded-md bg-background"
                              >
                                <option value="created_at">Data de Criação</option>
                                <option value="name">Nome</option>
                                <option value="email">Email</option>
                              </select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                              >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                              </Button>
                            </div>

                            {/* Atualizar */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadUsers(true)}
                              disabled={refreshing}
                            >
                              {refreshing ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4 mr-2" />
                              )}
                              Atualizar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

        {/* Lista de Usuários */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Lista de Usuários
            </CardTitle>
                                    <CardDescription>
                          {filteredAndSortedUsers.length} usuário(s) encontrado(s)
                        </CardDescription>
          </CardHeader>
          <CardContent>
                                    {loading ? (
                          <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div key={index} className="p-4 border border-border/50 rounded-lg bg-muted/20">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Skeleton className="h-8 w-8 rounded-lg" />
                                      <div className="space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 mb-3">
                                      <Skeleton className="h-3 w-24" />
                                      <Skeleton className="h-3 w-28" />
                                    </div>
                                    <Skeleton className="h-3 w-40" />
                                  </div>
                                  <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8 rounded" />
                                    <Skeleton className="h-8 w-8 rounded" />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                                    ) : filteredAndSortedUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            ) : (
                                        <div className="space-y-4">
                            {filteredAndSortedUsers.map((userData) => (
                  <div
                    key={userData.id}
                    className="p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                                                     <div>
                             <div className="flex items-center gap-2">
                               <span className="font-medium">{userData.email}</span>
                               {adminUserIds.includes(userData.id) && (
                                 <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                                   <Crown className="h-3 w-3 mr-1" />
                                   Admin
                                 </Badge>
                               )}
                             </div>
                             {userData.name && (
                               <div className="text-sm text-foreground font-medium">
                                 {userData.name}
                               </div>
                             )}
                             <div className="text-xs text-muted-foreground font-mono">
                               ID: {userData.id}
                             </div>
                           </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Criado: {formatDate(userData.created_at)}</span>
                          </div>
                          {userData.last_sign_in_at && (
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              <span>Último acesso: {formatDate(userData.last_sign_in_at)}</span>
                            </div>
                          )}
                        </div>

                        {/* Instâncias do WhatsApp */}
                        {userData.whatsapp_instances.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <MessageSquare className="h-4 w-4" />
                              Instâncias do WhatsApp ({userData.whatsapp_instances.length})
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {userData.whatsapp_instances.map((instance) => (
                                <div
                                  key={instance.id}
                                  className="p-3 bg-background/50 rounded-lg border border-border/50"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{instance.instance_name}</span>
                                    <div className="flex items-center gap-1">
                                      {getStatusIcon(instance.status)}
                                      <span className="text-xs text-muted-foreground">
                                        {getStatusText(instance.status)}
                                      </span>
                                    </div>
                                  </div>
                                  {instance.phone_number && (
                                    <div className="text-xs text-muted-foreground">
                                      📱 {instance.phone_number}
                                    </div>
                                  )}
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Criado: {formatDate(instance.created_at)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>Nenhuma instância do WhatsApp conectada</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
