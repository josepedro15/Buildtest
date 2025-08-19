import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ConnectFormData } from '@/components/features/whatsapp/WhatsAppConnectForm';

export type InstanceStatus = 'idle' | 'creating' | 'qr_ready' | 'connected' | 'disconnected' | 'error';

interface UseWhatsAppConnectionReturn {
  formData: ConnectFormData;
  setFormData: (data: ConnectFormData) => void;
  errors: Partial<ConnectFormData>;
  setErrors: (errors: Partial<ConnectFormData>) => void;
  isCreatingInstance: boolean;
  instanceCreated: boolean;
  qrCode: string;
  instanceId: string;
  instanceStatus: InstanceStatus;
  timeRemaining: number;
  isQrExpired: boolean;
  createInstance: () => Promise<void>;
  checkInstanceExists: () => Promise<void>;
  refreshQRCode: () => Promise<void>;
  resetState: () => void;
}

export function useWhatsAppConnection(): UseWhatsAppConnectionReturn {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ConnectFormData>({ instanceName: '' });
  const [errors, setErrors] = useState<Partial<ConnectFormData>>({});
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [instanceCreated, setInstanceCreated] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [instanceId, setInstanceId] = useState<string>('');
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isQrExpired, setIsQrExpired] = useState(false);

  const generateUniqueName = useCallback((baseName: string): string => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseName}${timestamp}${randomSuffix}`;
  }, []);

  const startQrTimer = useCallback(() => {
    setTimeRemaining(60);
    setIsQrExpired(false);
  }, []);

  const checkInstanceInDatabase = useCallback(async (instanceName: string) => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('instance_name', instanceName)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao verificar instância no banco:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao verificar instância no banco:', error);
      return null;
    }
  }, []);

  const updateInstanceStatusInDatabase = useCallback(async (instanceName: string, status: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_instances')
        .update({ status })
        .eq('instance_name', instanceName);

      if (error) {
        console.error('Erro ao atualizar status no banco:', error);
      }
    } catch (error) {
      console.error('Erro ao atualizar status no banco:', error);
    }
  }, []);

  const createInstanceInDatabase = useCallback(async (instanceName: string, apiInstanceId: string) => {
    try {
      const { error } = await supabase
        .from('whatsapp_instances')
        .insert({
          instance_name: instanceName,
          instance_id: apiInstanceId,
          status: 'creating',
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) {
        console.error('Erro ao criar instância no banco:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao criar instância no banco:', error);
      throw error;
    }
  }, []);

  const checkInstanceExists = useCallback(async () => {
    if (!formData.instanceName) return;

    try {
      console.log(`🔍 Verificando se instância existe: ${formData.instanceName}`);
      
      const dbInstance = await checkInstanceInDatabase(formData.instanceName);
      
      if (dbInstance) {
        console.log('💾 Instância encontrada no banco:', dbInstance);
        setInstanceId(dbInstance.instance_id);
        setInstanceCreated(true);
        
        const response = await fetch(`https://api.aiensed.com/instance/connectionState/${formData.instanceName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'd3050208ba862ee87302278ac4370cb9'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('🔍 Resposta da API:', data);
          
          if (data.instance) {
            if (data.instance.state === 'open') {
              console.log('🎉 WhatsApp CONECTADO! (state: open)');
              setInstanceStatus('connected');
              updateInstanceStatusInDatabase(formData.instanceName, 'connected');
            } else {
              console.log(`📱 WhatsApp DESCONECTADO! (state: ${data.instance.state})`);
              setInstanceStatus('disconnected');
              updateInstanceStatusInDatabase(formData.instanceName, 'disconnected');
            }
          } else {
            console.log('❌ Instância não existe na API (foi excluída)');
            setInstanceStatus('disconnected');
            updateInstanceStatusInDatabase(formData.instanceName, 'disconnected');
          }
        } else {
          console.log('❌ Erro ao verificar status na API');
          setInstanceStatus('error');
        }
      } else {
        console.log('❌ Instância não encontrada no banco');
        setInstanceStatus('idle');
      }
    } catch (error) {
      console.error('Erro ao verificar instância:', error);
      setInstanceStatus('error');
    }
  }, [formData.instanceName, checkInstanceInDatabase, updateInstanceStatusInDatabase]);

  const createInstance = useCallback(async () => {
    if (!formData.instanceName) return;

    setIsCreatingInstance(true);
    setInstanceStatus('creating');

    try {
      console.log('🚀 Criando instância:', formData.instanceName);
      
      const response = await fetch('https://api.aiensed.com/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'd3050208ba862ee87302278ac4370cb9'
        },
        body: JSON.stringify({
          instanceName: formData.instanceName
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Instância criada na API:', data);
        
        setInstanceId(data.instance.instance);
        setInstanceCreated(true);
        
        await createInstanceInDatabase(formData.instanceName, data.instance.instance);
        
        toast({
          title: "Instância criada!",
          description: "Agora vamos gerar o QR Code para conexão.",
        });
        
        setInstanceStatus('qr_ready');
        startQrTimer();
        
        // Gerar QR Code
        await generateQRCode();
      } else {
        const errorData = await response.json();
        console.error('❌ Erro ao criar instância:', errorData);
        
        toast({
          title: "Erro ao criar instância",
          description: errorData.message || "Tente novamente.",
          variant: "destructive"
        });
        
        setInstanceStatus('error');
      }
    } catch (error) {
      console.error('Erro ao criar instância:', error);
      
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });
      
      setInstanceStatus('error');
    } finally {
      setIsCreatingInstance(false);
    }
  }, [formData.instanceName, createInstanceInDatabase, toast, startQrTimer]);

  const generateQRCode = useCallback(async () => {
    if (!formData.instanceName) return;

    try {
      console.log('📱 Gerando QR Code para:', formData.instanceName);
      
      const response = await fetch(`https://api.aiensed.com/instance/connect/${formData.instanceName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'd3050208ba862ee87302278ac4370cb9'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ QR Code gerado:', data);
        
        if (data.qrcode) {
          setQrCode(data.qrcode);
          setInstanceStatus('qr_ready');
          startQrTimer();
        } else {
          console.error('❌ QR Code não encontrado na resposta');
          setInstanceStatus('error');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Erro ao gerar QR Code:', errorData);
        setInstanceStatus('error');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      setInstanceStatus('error');
    }
  }, [formData.instanceName, startQrTimer]);

  const refreshQRCode = useCallback(async () => {
    await generateQRCode();
  }, [generateQRCode]);

  const resetState = useCallback(() => {
    setFormData({ instanceName: '' });
    setErrors({});
    setIsCreatingInstance(false);
    setInstanceCreated(false);
    setQrCode('');
    setInstanceId('');
    setInstanceStatus('idle');
    setTimeRemaining(60);
    setIsQrExpired(false);
  }, []);

  // Timer effect
  useEffect(() => {
    if (instanceStatus === 'qr_ready' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsQrExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [instanceStatus, timeRemaining]);

  // Auto-refresh QR code when expired
  useEffect(() => {
    if (isQrExpired && instanceStatus === 'qr_ready') {
      const timer = setTimeout(() => {
        refreshQRCode();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isQrExpired, instanceStatus, refreshQRCode]);

  return {
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
  };
}
