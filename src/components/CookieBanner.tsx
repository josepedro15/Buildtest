import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, X, Settings, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookies } from '@/hooks/useCookies';
import { CookieSettingsModal } from './CookieSettingsModal';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { hasAccepted, acceptAll, acceptEssential } = useCookies();

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, [hasAccepted]);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    acceptEssential();
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  if (!isVisible || hasAccepted) {
    return (
      <>
        <CookieSettingsModal open={showSettings} onOpenChange={setShowSettings} />
      </>
    );
  }

    return (
    <>
      <CookieSettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 bg-background/95 backdrop-blur-sm border-t">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-4 sm:p-6">
            {/* Mobile Layout */}
            <div className="block md:hidden space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Política de Cookies
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Essenciais
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Analytics
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Preferências
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAcceptAll}
                  className="w-full"
                >
                  Aceitar Todos
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAcceptEssential}
                  className="w-full"
                >
                  Apenas Essenciais
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCustomize}
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Personalizar
                </Button>
              </div>

              {/* Links */}
              <div className="pt-3 border-t text-xs text-muted-foreground text-center">
                <div className="flex flex-wrap justify-center gap-2 mb-1">
                  <Link 
                    to="/privacy-policy" 
                    className="hover:text-primary transition-colors underline"
                  >
                    Política de Privacidade
                  </Link>
                  <span>•</span>
                  <Link 
                    to="/cookie-policy" 
                    className="hover:text-primary transition-colors underline"
                  >
                    Política de Cookies
                  </Link>
                </div>
                <span className="block">
                  Para mais informações sobre como usamos cookies, consulte nossa política completa.
                </span>
              </div>
            </div>

            {/* Tablet Layout */}
            <div className="hidden md:block lg:hidden">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Política de Cookies
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsVisible(false)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Essenciais
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Analytics
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Preferências
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex flex-row gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleAcceptAll}
                    className="flex-1"
                  >
                    Aceitar Todos
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleAcceptEssential}
                    className="flex-1"
                  >
                    Apenas Essenciais
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleCustomize}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Personalizar
                  </Button>
                </div>

                {/* Links */}
                <div className="pt-3 border-t text-xs text-muted-foreground text-center">
                  <div className="flex flex-wrap justify-center gap-2 mb-1">
                    <Link 
                      to="/privacy-policy" 
                      className="hover:text-primary transition-colors underline"
                    >
                      Política de Privacidade
                    </Link>
                    <span>•</span>
                    <Link 
                      to="/cookie-policy" 
                      className="hover:text-primary transition-colors underline"
                    >
                      Política de Cookies
                    </Link>
                  </div>
                  <span className="block">
                    Para mais informações sobre como usamos cookies, consulte nossa política completa.
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-start gap-4">
              {/* Icon and Title */}
              <div className="flex items-start gap-3 flex-shrink-0">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Política de Cookies
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
                    Ao continuar navegando, você concorda com nosso uso de cookies.
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Essenciais
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Analytics
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Preferências
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-row gap-2 flex-shrink-0">
                <Button 
                  size="sm" 
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap"
                >
                  Aceitar Todos
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAcceptEssential}
                  className="whitespace-nowrap"
                >
                  Apenas Essenciais
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCustomize}
                  className="whitespace-nowrap"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Personalizar
                </Button>
              </div>

              {/* Close Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:block mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <Link 
                to="/privacy-policy" 
                className="hover:text-primary transition-colors underline"
              >
                Política de Privacidade
              </Link>
              <span>•</span>
              <Link 
                to="/cookie-policy" 
                className="hover:text-primary transition-colors underline"
              >
                Política de Cookies
              </Link>
              <span>•</span>
              <span>
                Para mais informações sobre como usamos cookies, consulte nossa política completa.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
