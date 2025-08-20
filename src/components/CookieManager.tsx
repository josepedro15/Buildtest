import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, BarChart3, Settings, Info, CheckCircle, RefreshCw } from 'lucide-react';
import { useCookies } from '@/hooks/useCookies';
import { useToast } from '@/hooks/use-toast';

export function CookieManager() {
  const { preferences, updatePreferences, resetPreferences } = useCookies();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = (key: keyof typeof preferences, value: boolean) => {
    if (key === 'essential') {
      toast({
        title: "Cookies Essenciais",
        description: "Cookies essenciais não podem ser desativados pois são necessários para o funcionamento do site.",
        variant: "destructive"
      });
      return;
    }

    updatePreferences({ [key]: value });
    toast({
      title: "Preferências Atualizadas",
      description: `Cookies de ${key === 'analytics' ? 'analytics' : 'preferências'} ${value ? 'ativados' : 'desativados'}.`,
    });
  };

  const handleReset = async () => {
    setIsUpdating(true);
    try {
      resetPreferences();
      toast({
        title: "Preferências Resetadas",
        description: "Suas preferências de cookies foram resetadas para os valores padrão.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao resetar preferências de cookies.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const cookieTypes = [
    {
      key: 'essential' as const,
      title: 'Cookies Essenciais',
      description: 'Necessários para o funcionamento básico do site',
      icon: Shield,
      required: true,
      badge: 'Obrigatório',
      details: [
        'Autenticação e segurança',
        'Preferências de sessão',
        'Funcionalidades básicas'
      ]
    },
    {
      key: 'analytics' as const,
      title: 'Cookies de Analytics',
      description: 'Nos ajudam a entender como você usa nossa plataforma',
      icon: BarChart3,
      required: false,
      badge: 'Opcional',
      details: [
        'Análise de uso do site',
        'Métricas de performance',
        'Melhorias de experiência'
      ]
    },
    {
      key: 'preferences' as const,
      title: 'Cookies de Preferências',
      description: 'Lembram suas configurações e personalizações',
      icon: Settings,
      required: false,
      badge: 'Opcional',
      details: [
        'Configurações de interface',
        'Preferências de idioma',
        'Personalização de conteúdo'
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Gerenciamento de Cookies
        </CardTitle>
        <CardDescription>
          Controle suas preferências de cookies e privacidade
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cookie Types */}
        <div className="space-y-4">
          {cookieTypes.map((type) => (
            <div key={type.key} className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <type.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{type.title}</h4>
                      <Badge 
                        variant={type.required ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {type.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {type.description}
                    </p>
                    <ul className="space-y-1">
                      {type.details.map((detail, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {type.required ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3" />
                      Sempre ativo
                    </div>
                  ) : (
                    <Switch
                      checked={preferences[type.key]}
                      onCheckedChange={(checked) => handleToggle(type.key, checked)}
                    />
                  )}
                </div>
              </div>
              {type.key !== 'preferences' && <Separator />}
            </div>
          ))}
        </div>

        {/* Information */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Cookies Essenciais</strong> são sempre necessários para o funcionamento do site. 
                Você pode desativar cookies opcionais a qualquer momento.
              </p>
              <p>
                Para mais informações, consulte nossa{' '}
                <a href="/privacy-policy" className="underline hover:text-primary">
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            Resetar Preferências
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
