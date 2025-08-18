import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWhatsAppInstances } from '@/hooks/useWhatsAppInstances';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Plus,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function WhatsAppStatus() {
  const { instances, isLoadingInstances } = useWhatsAppInstances();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'connecting':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
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
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const connectedInstances = instances?.filter(i => i.status === 'connected') || [];
  const totalInstances = instances?.length || 0;

  if (isLoadingInstances) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            Status WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            Status WhatsApp
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/whatsapp-connect')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Conectar
          </Button>
        </div>
        <CardDescription>
          {totalInstances > 0 
            ? `${connectedInstances.length} de ${totalInstances} instâncias conectadas`
            : 'Nenhuma instância configurada'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalInstances === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              Conecte seu WhatsApp para começar a coletar dados
            </p>
            <Button
              onClick={() => navigate('/whatsapp-connect')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Primeira Instância
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {instances?.slice(0, 3).map((instance) => (
              <div
                key={instance.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {instance.status === 'connected' ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">
                      {instance.instance_name}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getStatusColor(instance.status))}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(instance.status)}
                      {getStatusText(instance.status)}
                    </div>
                  </Badge>
                </div>
                {instance.phone_number && (
                  <span className="text-xs text-gray-500">
                    {instance.phone_number}
                  </span>
                )}
              </div>
            ))}
            
            {totalInstances > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/whatsapp-connect')}
                  className="text-xs"
                >
                  Ver todas as {totalInstances} instâncias
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
