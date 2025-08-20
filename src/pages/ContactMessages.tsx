import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useContactMessages, ContactMessage } from '@/hooks/useContactMessages';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MessageSquare, 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  Reply,
  Archive,
  Trash2,
  Clock,
  User,
  Mail,
  Building,
  Phone,
  Calendar,
  AlertCircle,
  RefreshCw,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  MessageCircle
} from 'lucide-react';

// Estilos CSS personalizados para o modal
const modalStyles = `
  @media (max-width: 640px) {
    .responsive-modal {
      width: 100vw !important;
      max-width: 100vw !important;
      height: 100vh !important;
      max-height: 100vh !important;
      margin: 0 !important;
      border-radius: 0 !important;
    }
  }
`;

// Função para gerar link do WhatsApp
function getWhatsAppLink(phone: string, message?: string): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Adiciona +55 se não tiver código do país
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
  
  // Remove o primeiro 0 se existir após o código do país
  const formattedPhone = fullPhone.startsWith('550') ? fullPhone.replace('550', '55') : fullPhone;
  
  // Codifica a mensagem
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

export default function ContactMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'read' | 'replied' | 'archived'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isViewingMessage, setIsViewingMessage] = useState(false);

  // IDs dos administradores autorizados
  const adminUserIds = [
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
  ];

  const isAdmin = adminUserIds.includes(user?.id || '');

  const {
    messages,
    isLoadingMessages,
    messageStats,
    updateMessageStatus,
    deleteMessage,
    refetchMessages,
    isUpdatingStatus,
    isDeletingMessage
  } = useContactMessages();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para acessar esta página.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }
  }, [user, navigate, isAdmin, toast]);

  const filteredMessages = messages?.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setAdminNotes(message.admin_notes || '');
    setIsViewingMessage(true);
  };

  const handleUpdateStatus = async (messageId: string, status: ContactMessage['status']) => {
    await updateMessageStatus({ messageId, status, adminNotes });
    setIsViewingMessage(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
      await deleteMessage(messageId);
    }
  };

  const handleWhatsAppClick = (phone: string, name: string) => {
    const message = `Olá ${name}! Vi sua mensagem no formulário de contato do MetricaWhats. Como posso ajudar?`;
    const whatsappLink = getWhatsAppLink(phone, message);
    window.open(whatsappLink, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'read':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'replied':
        return <Reply className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'read':
        return 'Lida';
      case 'replied':
        return 'Respondida';
      case 'archived':
        return 'Arquivada';
      default:
        return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'normal':
        return 'Normal';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <style>{modalStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="text-foreground hover:bg-muted transition-all duration-300 rounded-xl px-4 py-2"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium text-sm">Voltar ao Admin</span>
              </Button>
            </div>
            
            <div className="text-center flex-1 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mb-3">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Mensagens de Contato
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Gerencie e responda às mensagens enviadas pelos usuários
              </p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Estatísticas */}
        {messageStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{messageStats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold">{messageStats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Reply className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Respondidas</p>
                    <p className="text-2xl font-bold">{messageStats.replied}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgentes</p>
                    <p className="text-2xl font-bold">{messageStats.urgent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                  placeholder="Buscar por nome, email, empresa ou mensagem..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                      <SelectItem value="read">Lidas</SelectItem>
                      <SelectItem value="replied">Respondidas</SelectItem>
                      <SelectItem value="archived">Arquivadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Prioridade</label>
                  <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Prioridades</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => refetchMessages()}
                    disabled={isLoadingMessages}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Mensagens */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Mensagens ({filteredMessages.length})
            </CardTitle>
            <CardDescription>
              {filteredMessages.length === 0 ? 'Nenhuma mensagem encontrada' : `${filteredMessages.length} mensagem(s) encontrada(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMessages ? (
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
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
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
                              <span className="font-medium">{message.name}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(message.priority)}`}
                              >
                                {getPriorityText(message.priority)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{message.email}</span>
                              </div>
                              {message.company && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  <span>{message.company}</span>
                                </div>
                              )}
                                                             {message.phone && (
                                 <div className="flex items-center gap-1">
                                   <Phone className="h-3 w-3" />
                                   <span>{message.phone}</span>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       handleWhatsAppClick(message.phone!, message.name);
                                     }}
                                     className="h-6 w-6 p-0 bg-green-50 hover:bg-green-100 text-green-600"
                                   >
                                     <MessageCircle className="h-3 w-3" />
                                   </Button>
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(message.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(message.status)}
                            <span>{getStatusText(message.status)}</span>
                          </div>
                        </div>

                        {message.message && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {message.message}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                                                     <DialogContent className="responsive-modal w-[98vw] max-w-3xl max-h-[95vh] overflow-y-auto p-4 sm:p-6 my-4" style={{ marginTop: '2vh', marginBottom: '2vh' }}>
                            <DialogHeader>
                              <DialogTitle>Detalhes da Mensagem</DialogTitle>
                              <DialogDescription>
                                Visualize e gerencie esta mensagem de contato
                              </DialogDescription>
                            </DialogHeader>
                            
                                                         {selectedMessage && (
                               <div className="space-y-3 sm:space-y-4">
                                {/* Informações do Remetente */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Nome</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                                  </div>
                                  {selectedMessage.company && (
                                    <div>
                                      <label className="text-sm font-medium">Empresa</label>
                                      <p className="text-sm text-muted-foreground">{selectedMessage.company}</p>
                                    </div>
                                  )}
                                                                     {selectedMessage.phone && (
                                     <div>
                                       <label className="text-sm font-medium">Telefone</label>
                                       <div className="flex items-center gap-2 mt-1">
                                         <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                                         <Button
                                           variant="outline"
                                           size="sm"
                                           onClick={() => handleWhatsAppClick(selectedMessage.phone!, selectedMessage.name)}
                                           className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300"
                                         >
                                           <MessageCircle className="h-4 w-4 mr-1" />
                                           WhatsApp
                                         </Button>
                                       </div>
                                     </div>
                                   )}
                                </div>

                                {/* Mensagem */}
                                {selectedMessage.message && (
                                  <div>
                                    <label className="text-sm font-medium">Mensagem</label>
                                    <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                                      <p className="text-sm">{selectedMessage.message}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Informações Técnicas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="flex items-center gap-2 mt-1">
                                      {getStatusIcon(selectedMessage.status)}
                                      <span className="text-sm">{getStatusText(selectedMessage.status)}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Prioridade</label>
                                    <Badge 
                                      variant="outline" 
                                      className={`mt-1 ${getPriorityColor(selectedMessage.priority)}`}
                                    >
                                      {getPriorityText(selectedMessage.priority)}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Enviada em</label>
                                    <p className="text-sm text-muted-foreground">{formatDate(selectedMessage.created_at)}</p>
                                  </div>
                                  {selectedMessage.read_at && (
                                    <div>
                                      <label className="text-sm font-medium">Lida em</label>
                                      <p className="text-sm text-muted-foreground">{formatDate(selectedMessage.read_at)}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Notas Administrativas */}
                                <div>
                                  <label className="text-sm font-medium">Notas Administrativas</label>
                                                                     <Textarea
                                     value={adminNotes}
                                     onChange={(e) => setAdminNotes(e.target.value)}
                                     placeholder="Adicione notas sobre esta mensagem..."
                                     className="mt-2 min-h-[60px]"
                                     rows={2}
                                   />
                                </div>

                                                                 {/* Ações */}
                                 <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t space-y-2 sm:space-y-0">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                                    disabled={isUpdatingStatus}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Marcar como Lida
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                                    disabled={isUpdatingStatus}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Reply className="h-4 w-4 mr-2" />
                                    Marcar como Respondida
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                                    disabled={isUpdatingStatus}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Archive className="h-4 w-4 mr-2" />
                                    Arquivar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                                    disabled={isDeletingMessage}
                                    className="flex-1 sm:flex-none"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
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
    </>
  );
}
