import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  Crown
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'with-whatsapp' | 'without-whatsapp'>('all');

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

  const loadBasicUsers = async () => {
    // Último recurso: buscar dados básicos de usuários através das instâncias do WhatsApp
    console.log('Usando último recurso: buscar usuários através das instâncias...');
    
    const { data: instancesData, error: instancesError } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .eq('is_active', true);

    if (instancesError) {
      console.error('Erro ao carregar instâncias:', instancesError);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários. Verifique se as funções SQL foram aplicadas.",
        variant: "destructive"
      });
      return;
    }

    // Criar lista de usuários a partir das instâncias
    const userIds = [...new Set((instancesData || []).map((instance: any) => instance.user_id))];
    
    // Adicionar IDs dos administradores se não estiverem na lista
    adminUserIds.forEach(adminId => {
      if (!userIds.includes(adminId)) {
        userIds.push(adminId);
      }
    });

    // Para cada usuário, buscar informações básicas
    const usersWithInstances: UserData[] = [];
    
    for (const userId of userIds) {
      // Buscar instâncias do usuário
      const userInstances = (instancesData || []).filter(
        (instance: any) => instance.user_id === userId
      );

      // Buscar informações do usuário (simulado por enquanto)
      const userData: UserData = {
        id: userId,
        email: `user-${userId.substring(0, 8)}@example.com`, // Placeholder
        name: null, // Placeholder
        created_at: new Date().toISOString(), // Placeholder
        last_sign_in_at: new Date().toISOString(), // Placeholder
        whatsapp_instances: userInstances.map((instance: any) => ({
          id: instance.id,
          instance_name: instance.instance_name,
          status: instance.status,
          phone_number: instance.phone_number,
          created_at: instance.created_at,
          last_activity: instance.last_activity
        }))
      };

      usersWithInstances.push(userData);
    }

    setUsers(usersWithInstances);
    toast({
      title: "Aviso",
      description: "Usando dados limitados. Aplique as funções SQL para dados completos.",
      variant: "default"
    });
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Primeiro, tentar usar a função RPC final
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_all_users_final');

      if (usersError) {
        console.error('Erro ao carregar usuários via RPC:', usersError);
        
        // Fallback: buscar todos os usuários através da tabela profiles
        console.log('Tentando fallback: buscar usuários através da tabela profiles...');
        
        try {
          // Primeiro, tentar buscar da tabela profiles
          console.log('Buscando dados da tabela profiles...');
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*');

          if (profilesError) {
            console.error('Erro ao carregar profiles:', profilesError);
            // Se não conseguir carregar profiles, usar dados básicos
            await loadBasicUsers();
            return;
          }

          console.log('Profiles encontrados:', profilesData?.length || 0);

          // Buscar instâncias do WhatsApp para cada usuário
          const { data: instancesData, error: instancesError } = await supabase
            .from('whatsapp_instances')
            .select('*')
            .eq('is_active', true);

          if (instancesError) {
            console.error('Erro ao carregar instâncias:', instancesError);
          }

          console.log('Instâncias encontradas:', instancesData?.length || 0);

          // Processar dados dos profiles
          const usersWithInstances: UserData[] = (profilesData || []).map((profile: any) => {
            // Buscar instâncias do usuário
            const userInstances = (instancesData || []).filter(
              (instance: any) => instance.user_id === profile.user_id
            );

            return {
              id: profile.user_id,
              email: profile.email || `user-${profile.user_id.substring(0, 8)}@example.com`,
              name: profile.full_name,
              created_at: profile.created_at,
              last_sign_in_at: profile.updated_at, // Usar updated_at como aproximação
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

          console.log('Usuários processados:', usersWithInstances.length);
          setUsers(usersWithInstances);
          toast({
            title: "Aviso",
            description: `Usando dados da tabela profiles (${usersWithInstances.length} usuários). Aplique as funções SQL para dados completos.`,
            variant: "default"
          });
          return;
        } catch (error) {
          console.error('Erro no fallback com profiles:', error);
          // Se tudo falhar, usar dados básicos
          await loadBasicUsers();
          return;
        }
      }

      // Processar os dados retornados pela função RPC básica
      // Buscar instâncias do WhatsApp para cada usuário
      const { data: instancesData, error: instancesError } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('is_active', true);

      if (instancesError) {
        console.error('Erro ao carregar instâncias:', instancesError);
      }

      const usersWithInstances: UserData[] = (usersData || []).map((userData: any) => {
        // Buscar instâncias do usuário
        const userInstances = (instancesData || []).filter(
          (instance: any) => instance.user_id === userData.user_id
        );

        return {
          id: userData.user_id,
          email: userData.user_email,
          name: userData.user_meta_data?.full_name || userData.user_meta_data?.name || null,
          created_at: userData.user_created_at,
          last_sign_in_at: userData.user_last_sign_in_at,
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
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(userData => {
    const matchesSearch = userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userData.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (userData.name && userData.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'with-whatsapp' && userData.whatsapp_instances.length > 0) ||
                         (filterStatus === 'without-whatsapp' && userData.whatsapp_instances.length === 0);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
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
  };

  const getStatusText = (status: string) => {
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome, email ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
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

              <Button
                variant="outline"
                size="sm"
                onClick={loadUsers}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
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
              {filteredUsers.length} usuário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Carregando usuários...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((userData) => (
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
