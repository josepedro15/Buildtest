import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface WhatsAppQRCodeProps {
  qrCode: string;
  timeRemaining: number;
  isQrExpired: boolean;
  instanceStatus: 'idle' | 'creating' | 'qr_ready' | 'connected' | 'disconnected' | 'error';
  onRefreshQR: () => void;
  onBack: () => void;
}

export function WhatsAppQRCode({
  qrCode,
  timeRemaining,
  isQrExpired,
  instanceStatus,
  onRefreshQR,
  onBack
}: WhatsAppQRCodeProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (instanceStatus) {
      case 'connected':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'qr_ready':
        return <QrCode className="h-6 w-6 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusText = () => {
    switch (instanceStatus) {
      case 'connected':
        return 'WhatsApp Conectado!';
      case 'qr_ready':
        return 'Escaneie o QR Code';
      case 'error':
        return 'Erro na Conexão';
      default:
        return 'Aguardando Conexão...';
    }
  };

  const getStatusDescription = () => {
    switch (instanceStatus) {
      case 'connected':
        return 'Sua instância do WhatsApp está conectada e pronta para uso.';
      case 'qr_ready':
        return 'Abra o WhatsApp no seu celular e escaneie o QR Code abaixo.';
      case 'error':
        return 'Ocorreu um erro ao conectar. Tente novamente.';
      default:
        return 'Aguarde enquanto preparamos a conexão...';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {getStatusIcon()}
        </div>
        <CardTitle className="text-2xl font-bold">{getStatusText()}</CardTitle>
        <CardDescription>{getStatusDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {instanceStatus === 'qr_ready' && qrCode && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="w-48 h-48"
                />
              </div>
            </div>
            
            {!isQrExpired && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Tempo restante para escaneamento:
                </p>
                <div className="text-2xl font-mono font-bold text-primary">
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
            
            {isQrExpired && (
              <div className="text-center space-y-4">
                <p className="text-sm text-red-500">
                  QR Code expirado. Clique em "Atualizar QR Code" para gerar um novo.
                </p>
                <Button onClick={onRefreshQR} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar QR Code
                </Button>
              </div>
            )}
          </div>
        )}
        
        {instanceStatus === 'connected' && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-green-700 font-medium">
                Conexão estabelecida com sucesso!
              </p>
            </div>
          </div>
        )}
        
        {instanceStatus === 'error' && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-medium">
                Erro na conexão. Tente novamente.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Voltar
          </Button>
          {instanceStatus === 'qr_ready' && !isQrExpired && (
            <Button onClick={onRefreshQR} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
