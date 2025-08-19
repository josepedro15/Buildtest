import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft } from 'lucide-react';
import { WhatsAppConnectForm } from '@/components/features/whatsapp/WhatsAppConnectForm';
import { WhatsAppQRCode } from '@/components/features/whatsapp/WhatsAppQRCode';
import { useWhatsAppConnection } from '@/hooks/features/useWhatsAppConnection';

export default function WhatsAppConnect() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    isCreatingInstance,
    instanceCreated,
    qrCode,
    instanceId,
    instanceStatus,
    timeRemaining,
    isQrExpired,
    createInstance,
    checkInstanceExists,
    refreshQRCode,
    resetState
  } = useWhatsAppConnection();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleBack = () => {
    if (instanceCreated) {
      resetState();
    } else {
      navigate('/dashboard');
    }
  };

  const handleCreateInstance = async () => {
    await createInstance();
  };

  const handleRefreshQR = async () => {
    await refreshQRCode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-0 h-auto hover:bg-transparent group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-primary/60 transition-all duration-200">
                      Conectar WhatsApp
                    </span>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-200">
                      Configure sua instância
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          {!instanceCreated ? (
            <WhatsAppConnectForm
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              isCreatingInstance={isCreatingInstance}
              onCreateInstance={handleCreateInstance}
            />
          ) : (
            <WhatsAppQRCode
              qrCode={qrCode}
              timeRemaining={timeRemaining}
              isQrExpired={isQrExpired}
              instanceStatus={instanceStatus}
              onRefreshQR={handleRefreshQR}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </div>
  );
}
