import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Smartphone, Zap, CheckCircle, AlertCircle, Clock, QrCode, Wifi, WifiOff } from 'lucide-react';
import { z } from 'zod';

const connectSchema = z.object({
  instanceName: z.string()
    .min(3, 'Nome da instância deve ter pelo menos 3 caracteres')
    .max(50, 'Nome da instância deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9]+$/, 'Use apenas letras minúsculas e números (sem hífens ou caracteres especiais)')
});

type ConnectFormData = z.infer<typeof connectSchema>;

export default function WhatsAppConnect() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ConnectFormData>({ instanceName: '' });
  const [errors, setErrors] = useState<Partial<ConnectFormData>>({});
  const [isCreatingInstance, setIsCreatingInstance] = useState(false);
  const [instanceCreated, setInstanceCreated] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [instanceId, setInstanceId] = useState<string>('');
  const [instanceStatus, setInstanceStatus] = useState<'idle' | 'creating' | 'qr_ready' | 'connected' | 'disconnected' | 'error'>('idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isQrExpired, setIsQrExpired] = useState(false);
  
  // 🚫 REMOVIDO: Variável de controle que travava o sistema

  const generateUniqueName = (baseName: string): string => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${baseName}${timestamp}${randomSuffix}`;
  };

  const startQrTimer = () => {
    setTimeRemaining(60);
    setIsQrExpired(false);
  };

  // Função para verificar se a instância existe e seu status
  const checkInstanceExists = async () => {
    if (!formData.instanceName) return;

    try {
      console.log(`🔍 Verificando se instância existe: ${formData.instanceName}`);
      console.log(`🔍 Estado atual: instanceCreated=${instanceCreated}, instanceStatus=${instanceStatus}`);
      
      // Primeiro verificar se existe no banco de dados
      const dbInstance = await checkInstanceInDatabase(formData.instanceName);
      
      if (dbInstance) {
        console.log('💾 Instância encontrada no banco:', dbInstance);
        setInstanceId(dbInstance.instance_id);
        setInstanceCreated(true);
        
        // Verificar status na API via GET /instance/connectionState/{instance}
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
          
          // Se retornou instância, ela existe na API
          if (data.instance) {
            // Verificar se está conectada (state: "open")
            if (data.instance.state === 'open') {
              console.log('🎉 WhatsApp CONECTADO! (state: open)');
              setInstanceStatus('connected');
              
              // 🔄 SEMPRE atualizar banco com status real da API
              updateInstanceStatusInDatabase(formData.instanceName, 'connected');
            } else {
              // Se não está conectada (state: "closed" ou outro)
              console.log(`📱 WhatsApp DESCONECTADO! (state: ${data.instance.state})`);
              setInstanceStatus('disconnected');
              
              // 🔄 SEMPRE atualizar banco com status real da API
              updateInstanceStatusInDatabase(formData.instanceName, 'disconnected');
            }
          } else {
            // Instância não existe na API (foi excluída)
            console.log('❌ Instância não existe na API (foi excluída)');
            setInstanceStatus('disconnected');
            
            // 🔄 SEMPRE atualizar banco com status real da API
            updateInstanceStatusInDatabase(formData.instanceName, 'disconnected');
          }
        } else if (response.status === 404) {
          // 🚨 Instância não encontrada na API (404) - REMOVER DO BANCO!
          console.log('🚨 Instância não encontrada na API (404) - REMOVENDO DO BANCO!');
          
          // 🗑️ EXCLUIR instância órfã do banco de dados
          await deleteInstanceFromDatabase(formData.instanceName);
          
          // 🔄 Resetar estado local
          setInstanceStatus('idle');
          setInstanceCreated(false);
          setQrCode('');
          setInstanceId('');
          
          // 📱 Notificar usuário
          toast({
            title: "Instância Removida",
            description: "A instância foi removida da API e excluída do banco.",
            variant: "destructive"
          });
        }
      } else {
        // Instância não existe no banco
        console.log('❌ Instância não existe no banco');
        setInstanceStatus('idle');
        setInstanceCreated(false);
        setQrCode('');
        setInstanceId('');
      }
      
    } catch (error) {
      console.log('❌ Erro ao verificar instância:', error);
      setInstanceStatus('error');
    }
  };

  // Função para verificar status da instância em tempo real via API
  const checkInstanceStatus = async () => {
    if (!instanceId || !formData.instanceName) return;

    try {
      console.log(`🔍 Verificando status da instância: ${formData.instanceName} (ID: ${instanceId})`);
      console.log(`🔍 Status atual: ${instanceStatus}`);
      
      // Verificar status da instância via GET /instance/connectionState/{instance}
      try {
        const statusResponse = await fetch(`https://api.aiensed.com/instance/connectionState/${formData.instanceName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'd3050208ba862ee87302278ac4370cb9'
          }
        });
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('🔍 Resposta da verificação de status:', statusData);
          
          // Verificar se a instância está conectada (state: "open")
          if (statusData.instance && statusData.instance.state === 'open') {
            console.log('🎉 WhatsApp CONECTADO! (state: open)');
            
            // 🔄 SEMPRE atualizar banco com status real da API
            updateInstanceStatusInDatabase(formData.instanceName, 'connected');
            
            if (instanceStatus !== 'connected') {
              setInstanceStatus('connected');
              setIsQrExpired(false);
              
              toast({
                title: "WhatsApp Conectado!",
                description: "Sua instância está ativa e pronto para receber dados.",
              });
            }
            return;
          }
          
          // Se a instância existe mas não está conectada (state: "closed" ou outro)
          if (statusData.instance && statusData.instance.state !== 'open') {
            console.log(`📱 WhatsApp DESCONECTADO! (state: ${statusData.instance.state})`);
            if (instanceStatus !== 'disconnected') {
              setInstanceStatus('disconnected');
              
              // 🔄 Sincronizar status no banco com API
              updateInstanceStatusInDatabase(formData.instanceName, 'disconnected');
              
              // 🔄 Gerar QR code para reconexão quando desconectado
              // ⚠️ NÃO gerar se já existe QR válido na tela
              console.log('🔍 Verificando se deve gerar QR automático:');
              console.log('🔍 instanceStatus atual:', instanceStatus);
              console.log('🔍 qrCode existe:', !!qrCode);
              // 🚫 REMOVIDO: Referência à variável removida
              console.log('🔍 instanceStatus !== qr_ready:', instanceStatus !== 'qr_ready');
              console.log('🔍 !qrCode:', !qrCode);
              
              // 🚫 REMOVIDO: Proteção que impedia mudança de tela
              // 🚫 REMOVIDO: Verificação qrManuallyGenerated que travava sistema
              // ✅ AGORA: Sempre gerar QR quando desconectado
              
              console.log('🔄 Instância desconectada - gerando QR code para reconexão...');
              console.log('🔄 Chamando generateQrCodeForExistingInstance...');
              
              // ⏰ Aguardar um pouco antes de gerar novo QR
              setTimeout(() => {
                console.log('🔄 Executando geração de QR code após delay...');
                generateQrCodeForExistingInstance(formData.instanceName);
              }, 1000);
            }
            return;
          }
          
        } else if (statusResponse.status === 404) {
          // 🚨 Instância não encontrada na API (404) - REMOVER DO BANCO!
          console.log('🚨 Instância não encontrada na API (404) - REMOVENDO DO BANCO!');
          
          // 🗑️ EXCLUIR instância órfã do banco de dados
          await deleteInstanceFromDatabase(formData.instanceName);
          
          // 🔄 Resetar estado local
          setInstanceStatus('idle');
          setInstanceCreated(false);
          setQrCode('');
          setInstanceId('');
          
          // 📱 Notificar usuário
          toast({
            title: "Instância Removida",
            description: "A instância foi removida da API e excluída do banco.",
            variant: "destructive"
          });
          
          return;
        } else if (statusResponse.status === 403) {
          console.log('🚫 Acesso negado (403) - verificar permissões');
          return;
        }
        
      } catch (statusError) {
        console.log('❌ Erro ao verificar status:', statusError);
      }
      
      // Se chegou até aqui, a instância não está conectada
      console.log('📱 Instância não está conectada');
      if (instanceStatus === 'connected') {
        setInstanceStatus('disconnected');
        toast({
          title: "WhatsApp Desconectado",
          description: "A conexão foi perdida.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.log(`❌ Erro na verificação:`, error);
    }
  };

  // Função para gerar QR code para instância existente (reconexão)
  const generateQrCodeForExistingInstance = async (instanceName: string) => {
    if (!instanceName) return;

    console.log(`🔄 Gerando QR code para instância existente: ${instanceName}`);
    setIsQrExpired(false);
    setTimeRemaining(60);
    setInstanceStatus('creating');

    // 🔍 TESTAR MÚLTIPLOS ENDPOINTS PARA ENCONTRAR O CORRETO
    // 🎯 URL BASE SEMPRE: api.aiensed.com
    // 📋 Endpoint oficial da documentação: GET /instance/connect/{instance}
    const endpoints = [
      `https://api.aiensed.com/instance/connect/${instanceName}`,     // ✅ Endpoint oficial da documentação
      `https://api.aiensed.com/instance/${instanceName}/connect`,     // Alternativo 1
      `https://api.aiensed.com/instance/connect?instance=${instanceName}`, // Alternativo 2
      `https://api.aiensed.com/instance/create`                      // Fallback POST (não recomendado)
    ];

          for (let i = 0; i < endpoints.length; i++) {
        const endpoint = endpoints[i];
        const isOfficial = endpoint.includes('/instance/connect/') && !endpoint.includes('?');
        
        if (isOfficial) {
          console.log(`🎯 TESTANDO ENDPOINT OFICIAL DA DOCUMENTAÇÃO: ${endpoint}`);
        } else {
          console.log(`🔍 Testando endpoint ${i + 1}/${endpoints.length}: ${endpoint}`);
        }
        
        try {
          let response;
          
          if (endpoint.includes('/instance/create')) {
            // Endpoint POST com body (não recomendado para regenerar QR)
            console.log('⚠️ Usando endpoint POST /instance/create (não recomendado para regenerar QR)');
            response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'd3050208ba862ee87302278ac4370cb9'
              },
              body: JSON.stringify({
                instanceName: instanceName,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
              })
            });
          } else {
            // Endpoints GET (recomendados para regenerar QR)
            if (isOfficial) {
              console.log('✅ Usando endpoint oficial GET /instance/connect/{instance}');
            }
            response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'd3050208ba862ee87302278ac4370cb9'
              }
            });
          }

        console.log(`🔍 Endpoint ${endpoint}: Status ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`🔍 Resposta do endpoint ${endpoint}:`, data);
          
          // 📱 Tentar extrair QR code de diferentes formatos
          let qrCode = null;
          let pairingCode = null;
          
          // 🎯 Priorizar base64 (formato mais comum para QR)
          if (data.base64) {
            qrCode = data.base64;
            pairingCode = data.pairingCode || 'N/A';
            console.log('✅ QR code encontrado no campo base64');
          } else if (data.code) {
            qrCode = data.code;
            pairingCode = data.pairingCode || 'N/A';
            console.log('✅ QR code encontrado no campo code');
          } else if (data.qrcode) {
            qrCode = data.qrcode.base64 || data.qrcode;
            pairingCode = 'N/A';
            console.log('✅ QR code encontrado no campo qrcode');
          } else if (data.qrCode) {
            qrCode = data.qrCode;
            pairingCode = 'N/A';
            console.log('✅ QR code encontrado no campo qrCode');
          }
          
          if (qrCode) {
            console.log('✅ QR code encontrado!', { endpoint, qrCode: qrCode.substring(0, 50) + '...', pairingCode });
            
            setQrCode(qrCode);
            setInstanceStatus('qr_ready');
            startQrTimer();
            
            // ✅ QR code gerado com sucesso
            console.log('✅ QR code gerado com sucesso');
            
            toast({
              title: "QR Code Gerado!",
              description: `Endpoint: ${endpoint.split('/').pop()}. Código: ${pairingCode}`,
            });
            
            return; // Sucesso - sair do loop
          }
        } else {
          console.log(`❌ Endpoint ${endpoint} falhou: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error(`❌ Erro no endpoint ${endpoint}:`, error);
      }
    }
    
    // 🚫 Se chegou até aqui, nenhum endpoint funcionou
    console.error('❌ Nenhum endpoint funcionou para gerar QR code');
    setInstanceStatus('error');
    toast({
      title: "Erro ao Gerar QR Code",
      description: "Todos os endpoints testados falharam. Verifique o console.",
      variant: "destructive"
    });
  };

  const regenerateQrCode = async () => {
    if (!formData.instanceName) return;

    setIsQrExpired(false);
    setTimeRemaining(60);
    setInstanceStatus('creating');

    try {
      // Usar o endpoint que sabemos que funciona para criar instância
      const response = await fetch('https://api.aiensed.com/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'd3050208ba862ee87302278ac4370cb9'
        },
        body: JSON.stringify({
          instanceName: formData.instanceName,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.qrcode && data.instance) {
          setQrCode(data.qrcode.base64 || data.qrcode);
          setInstanceId(data.instance.instanceId || data.instance.id);
          setInstanceStatus('qr_ready');
          startQrTimer();
          
          toast({
            title: "QR Code Regenerado!",
            description: "Escaneie o novo QR Code com seu WhatsApp.",
          });
        }
      } else {
        setInstanceStatus('error');
        toast({
          title: "Erro ao Regenerar",
          description: "Não foi possível gerar um novo QR Code.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setInstanceStatus('error');
      toast({
        title: "Erro ao Regenerar",
        description: "Erro de conexão ao gerar novo QR Code.",
        variant: "destructive"
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      connectSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<ConnectFormData> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ConnectFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof ConnectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConnect = async () => {
    if (!validateForm() || !user) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingInstance(true);
    setInstanceStatus('creating');
    
    try {
      // Usar o endpoint que sabemos que funciona para criar instância
      const response = await fetch('https://api.aiensed.com/instance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'd3050208ba862ee87302278ac4370cb9'
        },
        body: JSON.stringify({
          instanceName: formData.instanceName,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS"
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Resposta completa da API:', data);
        
        let qrCode = null;
        let instanceId = null;
        let instanceName = null;
        
        if (data.qrcode) {
          if (typeof data.qrcode === 'string') {
            qrCode = data.qrcode;
          } else if (data.qrcode.base64) {
            qrCode = data.qrcode.base64;
          } else if (data.qrcode.code) {
            qrCode = data.qrcode.code;
          }
        }
        
        if (data.instance) {
          if (typeof data.instance === 'string') {
            instanceId = data.instance;
          } else if (data.instance.instanceId) {
            instanceId = data.instance.instanceId;
          } else if (data.instance.id) {
            instanceId = data.instance.id;
          }
          
          if (data.instance.instanceName) {
            instanceName = data.instance.instanceName;
          }
        }
        
        if (!instanceId && data.instanceId) instanceId = data.instanceId;
        if (!instanceId && data.instance_id) instanceId = data.instance_id;
        if (!instanceId && data.id) instanceId = data.id;
        
        if (!qrCode && data.qrCode) qrCode = data.qrCode;
        if (!qrCode && data.qr) qrCode = data.qr;
        if (!qrCode && data.qrcode_url) qrCode = data.qrcode_url;
        
        if (qrCode && instanceId) {
          console.log('🎯 Dados válidos recebidos:', { qrCode: !!qrCode, instanceId, instanceName });
          
          setQrCode(qrCode);
          setInstanceId(instanceId);
          setInstanceCreated(true);
          setInstanceStatus('qr_ready');
          
          console.log('💾 Estado atualizado, salvando no banco...');
          
          // Salvar instância no banco de dados
          const savedInstance = await saveInstanceToDatabase(formData.instanceName, instanceId, qrCode);
          
          if (savedInstance) {
            console.log('✅ Instância salva com sucesso no banco:', savedInstance);
          }
          
          // ⏰ AGUARDAR 10 SEGUNDOS antes de verificar status
          console.log('⏰ Aguardando 10 segundos para estabilizar instância...');
          setTimeout(() => {
            console.log('🔍 Iniciando verificação de status após estabilização...');
            checkInstanceStatus();
          }, 10000);
          
          toast({
            title: "QR Code Gerado!",
            description: `Instância "${instanceName || instanceId}" criada com sucesso. Agora escaneie o QR Code!`,
          });
        } else {
          throw new Error(`API não retornou dados esperados. Verifique o console para detalhes.`);
        }
        
      } else if (response.status === 403) {
        // Se for 403, tentar com nome único
        try {
          const errorData = await response.text();
          console.log(`🚨 Erro 403:`, errorData);
          
          if (errorData.toLowerCase().includes('already in use')) {
            const uniqueName = generateUniqueName(formData.instanceName);
            console.log(`🔄 Tentando com nome único: ${uniqueName}`);
            
            const retryResponse = await fetch('https://api.aiensed.com/instance/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': 'd3050208ba862ee87302278ac4370cb9'
              },
              body: JSON.stringify({
                instanceName: uniqueName,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
              })
            });
            
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              
              let qrCode = null;
              let instanceId = null;
              
              if (retryData.qrcode) {
                qrCode = retryData.qrcode.base64 || retryData.qrcode;
              }
              
              if (retryData.instance) {
                instanceId = retryData.instance.instanceId || retryData.instance.id;
              }
              
              if (qrCode && instanceId) {
                setFormData(prev => ({ ...prev, instanceName: uniqueName }));
                setQrCode(qrCode);
                setInstanceId(instanceId);
                setInstanceCreated(true);
                setInstanceStatus('qr_ready');
                
                // Salvar instância no banco de dados (nome único)
                await saveInstanceToDatabase(uniqueName, instanceId, qrCode);
                
                toast({
                  title: "QR Code Gerado!",
                  description: `Instância "${uniqueName}" criada com nome único. Agora escaneie o QR Code!`,
                });
              }
            } else {
              throw new Error(`Retry com nome único falhou: ${retryResponse.status}`);
            }
          } else {
            throw new Error(`Erro 403: ${errorData}`);
          }
        } catch (parseError) {
          throw new Error(`Erro ao processar resposta 403: ${parseError}`);
        }
      } else {
        throw new Error(`API retornou erro: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Erro ao conectar:', error);
      setInstanceStatus('error');
      toast({
        title: "Erro na conexão",
        description: `Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setIsCreatingInstance(false);
    }
  };

  // Função para salvar instância no banco Supabase
  const saveInstanceToDatabase = async (instanceName: string, instanceId: string, qrCode: string) => {
    if (!user?.id) {
      console.error('❌ Usuário não autenticado');
      return;
    }

    try {
      console.log('💾 Salvando instância no banco:', { instanceName, instanceId });
      
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert({
          user_id: user.id,
          instance_name: instanceName,
          instance_id: instanceId,
          status: 'connecting',
          qr_code: qrCode,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar no banco:', error);
        throw error;
      }

      console.log('✅ Instância salva no banco:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Erro ao salvar instância:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a instância no banco de dados.",
        variant: "destructive"
      });
    }
  };

  // Função para verificar se instância existe no banco
  const checkInstanceInDatabase = async (instanceName: string) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id)
        .eq('instance_name', instanceName)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Erro ao buscar no banco:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Erro ao verificar banco:', error);
      return null;
    }
  };

  // Função para carregar instâncias existentes do usuário
  const loadExistingInstances = async () => {
    if (!user?.id) return;

    try {
      console.log('🔍 Carregando instâncias existentes do usuário...');
      
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao carregar instâncias:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('💾 Instâncias encontradas no banco:', data);
        
        // Carregar a instância mais recente
        const latestInstance = data[0];
        console.log('🎯 Instância mais recente:', latestInstance);
        
        // Restaurar estado da instância
        setFormData({ instanceName: latestInstance.instance_name });
        setInstanceId(latestInstance.instance_id);
        setInstanceCreated(true);
        
        if (latestInstance.qr_code) {
          setQrCode(latestInstance.qr_code);
        }
        
        // Verificar status atual na API
        setTimeout(() => checkInstanceExists(), 1000);
        
      } else {
        console.log('📭 Nenhuma instância encontrada no banco');
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar instâncias:', error);
    }
  };

  // Função para atualizar status da instância no banco
  const updateInstanceStatusInDatabase = async (instanceName: string, status: string) => {
    if (!user?.id) return;

    try {
      console.log(`💾 Atualizando status no banco: ${instanceName} → ${status}`);
      
      const { error } = await supabase
        .from('whatsapp_instances')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('instance_name', instanceName);

      if (error) {
        console.error('❌ Erro ao atualizar status:', error);
      } else {
        console.log(`✅ Status atualizado no banco: ${instanceName} → ${status}`);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
    }
  };

  // 🗑️ Função para EXCLUIR instância órfã do banco de dados
  const deleteInstanceFromDatabase = async (instanceName: string) => {
    if (!user?.id) return;

    try {
      console.log(`🗑️ Excluindo instância órfã do banco: ${instanceName}`);
      
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('user_id', user.id)
        .eq('instance_name', instanceName);

      if (error) {
        console.error('❌ Erro ao excluir instância do banco:', error);
      } else {
        console.log(`✅ Instância excluída do banco: ${instanceName}`);
      }
    } catch (error) {
      console.error('❌ Erro ao excluir instância do banco:', error);
    }
  };



  // Carregar instâncias existentes ao montar o componente
  useEffect(() => {
    if (user?.id) {
      console.log('🚀 Componente montado, carregando instâncias existentes...');
      loadExistingInstances();
    }
  }, [user?.id]);
  
  // 🔍 Verificação inicial de status quando instância existe
  useEffect(() => {
    if (instanceCreated && formData.instanceName) {
      console.log('🔍 Verificação inicial de status...');
      // Aguardar um pouco antes de verificar
      setTimeout(() => {
        checkInstanceStatus();
      }, 2000);
    }
  }, [instanceCreated, formData.instanceName]);

  // ✅ Timer para QR code + verificação inteligente de status
  useEffect(() => {
    let timerInterval: number;
    let statusInterval: number;
    
    if (instanceStatus === 'qr_ready' && instanceId) {
      startQrTimer();
      
      // ⏰ Timer de contagem regressiva
      timerInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsQrExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // 🔍 Verificar status a cada 60 segundos (muito mais lento para QR)
      statusInterval = setInterval(() => {
        console.log('🔍 Verificação inteligente de status (QR ready)...');
        checkInstanceStatus();
      }, 60000); // 60 segundos (muito mais lento para QR)
    }
    
    if (instanceStatus === 'connected' && instanceId) {
      // 🔍 Verificar status a cada 15 segundos quando conectado
      statusInterval = setInterval(() => {
        console.log('🔍 Verificação inteligente de status (connected)...');
        checkInstanceStatus();
      }, 15000); // 15 segundos (muito mais lento)
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [instanceStatus, instanceId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header padronizado com Dashboard */}
      <div className="relative overflow-hidden border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="relative container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-foreground hover:bg-muted transition-all duration-300 rounded-xl px-4 py-2"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium text-sm">Voltar ao Dashboard</span>
            </Button>
            
            <div className="text-center flex-1 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg mb-3">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                Conectar WhatsApp
              </h1>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Configure sua instância para análise de dados e integração com o sistema
              </p>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Debug Info com design melhorado */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-700 font-medium">
              <strong>Debug:</strong> Usuário: {user?.email || 'Não autenticado'}
            </p>
          </div>
        </div>

        {/* Layout principal com grid responsivo */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Coluna Principal - Formulário */}
          <div className="xl:col-span-2 space-y-8">
            {/* Card de Configuração padronizado com Dashboard */}
            <Card className="shadow-sm border border-border/50 bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                    <Smartphone className="h-5 w-5 text-white m-auto mt-1.5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Configuração da Instância
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Crie uma nova instância do WhatsApp para análise de dados
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* Formulário com design moderno */}
                <div className="space-y-6">
                  {/* Campo Nome da Instância */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Label htmlFor="instanceName" className="text-xl font-semibold text-gray-800">
                          🏷️ Nome da Instância
                        </Label>
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Obrigatório
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Input
                          id="instanceName"
                          type="text"
                          placeholder="Ex: lojamoveis, empresaabc, vendas2024"
                          value={formData.instanceName}
                          onChange={(e) => handleInputChange('instanceName', e.target.value)}
                          className={`text-lg p-5 border-2 transition-all duration-300 ${
                            errors.instanceName 
                              ? "border-red-400 focus:border-red-500 focus:ring-red-200" 
                              : "border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                          } rounded-2xl focus:ring-4 focus:ring-blue-100`}
                          disabled={isCreatingInstance}
                        />
                        {errors.instanceName && (
                          <p className="mt-3 text-sm text-red-600 font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            {errors.instanceName}
                          </p>
                        )}
                      </div>
                      
                      <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-blue-700">Dica de Nomenclatura</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Use apenas <strong>letras minúsculas</strong> e <strong>números</strong> (sem hífens ou caracteres especiais). 
                          Exemplos: <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">lojamoveis</code>, 
                          <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">empresaabc</code>, 
                          <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">vendas2024</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Campo removido: URL da Instância */}

                  {/* Botão principal com design moderno */}
                  <div className="text-center pt-4">
                    <Button
                      onClick={handleConnect}
                      disabled={isCreatingInstance || !formData.instanceName}
                      className={`w-full max-w-lg h-20 text-xl font-bold rounded-3xl shadow-2xl transition-all duration-500 ${
                        isCreatingInstance || !formData.instanceName
                          ? 'bg-gray-400 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:scale-105 hover:shadow-3xl'
                      }`}
                      size="lg"
                    >
                      {isCreatingInstance ? (
                        <div className="flex items-center gap-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>Conectando WhatsApp...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Zap className="h-7 w-7" />
                          <span>Conectar WhatsApp</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status da Instância com design melhorado - aparece quando há instância ou status ativo */}
            {(instanceStatus !== 'idle' || instanceCreated) && (
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 p-6">
                  <div className="flex items-center gap-3">
                    {instanceStatus === 'creating' && (
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                    {instanceStatus === 'qr_ready' && (
                      <div className="p-2 bg-green-100 rounded-xl">
                        <QrCode className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                    {instanceStatus === 'connected' && (
                      <div className="p-2 bg-green-100 rounded-xl">
                        <Wifi className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                    {instanceStatus === 'error' && (
                      <div className="p-2 bg-red-100 rounded-xl">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                    )}
                    {instanceStatus === 'disconnected' && (
                      <div className="p-2 bg-orange-100 rounded-xl">
                        <WifiOff className="h-6 w-6 text-orange-600" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {instanceStatus === 'creating' && 'Criando Instância...'}
                        {instanceStatus === 'qr_ready' && 'QR Code Gerado!'}
                        {instanceStatus === 'connected' && 'WhatsApp Conectado!'}
                        {instanceStatus === 'error' && 'Erro na Conexão'}
                        {instanceStatus === 'disconnected' && 'WhatsApp Desconectado'}
                      </h3>
                      <p className="text-gray-600">
                        {instanceStatus === 'creating' && 'Aguarde enquanto criamos sua instância...'}
                        {instanceStatus === 'qr_ready' && 'Escaneie o QR Code com seu WhatsApp'}
                        {instanceStatus === 'connected' && 'Sua instância está ativa e funcionando'}
                        {instanceStatus === 'error' && 'Ocorreu um erro durante a conexão'}
                        {instanceStatus === 'disconnected' && 'A conexão foi perdida'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* QR Code Section com layout otimizado */}
                  {(instanceStatus === 'qr_ready' || (instanceCreated && instanceStatus !== 'connected')) && qrCode && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      {/* Coluna Esquerda - Timer e Instruções */}
                      <div className="space-y-6 order-2 lg:order-1">
                        {/* Timer de expiração */}
                        {!isQrExpired && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl shadow-sm">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <span className="text-lg font-semibold text-yellow-700">
                              QR Code expira em: <strong className="text-2xl">{timeRemaining}s</strong>
                            </span>
                          </div>
                        )}
                        
                        {/* QR Code expirado */}
                        {isQrExpired && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl shadow-sm">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="text-lg font-semibold text-red-700">
                              QR Code expirado! Clique em "Gerar Novo QR Code"
                            </span>
                          </div>
                        )}
                        
                        {/* Instruções */}
                        <div className="space-y-3">
                          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">📱 Como Escanear:</h4>
                            <ol className="text-sm text-blue-700 space-y-1 text-left">
                              <li>1. Abra o <strong>WhatsApp Business</strong></li>
                              <li>2. Vá em <strong>Configurações</strong></li>
                              <li>3. Toque em <strong>Dispositivos Vinculados</strong></li>
                              <li>4. Escaneie o QR Code acima</li>
                            </ol>
                          </div>
                        </div>
                        
                        {/* Botões de ação */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-start">
                          {isQrExpired && (
                            <Button
                              onClick={regenerateQrCode}
                              variant="outline"
                              size="lg"
                              className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 rounded-2xl px-8"
                            >
                              <QrCode className="h-5 w-5 mr-2" />
                              Gerar Novo QR Code
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Coluna Direita - QR Code */}
                      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        <div className="bg-white p-6 rounded-3xl border-2 border-gray-200 shadow-lg">
                          <img 
                            src={qrCode} 
                            alt="QR Code WhatsApp" 
                            className={`w-56 h-56 ${isQrExpired ? 'opacity-50 grayscale' : ''} transition-all duration-300`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Conectado */}
                  {instanceStatus === 'connected' && (
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6 shadow-lg">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-green-600">
                          🎉 WhatsApp Conectado!
                        </h3>
                        <p className="text-xl text-green-700 font-medium">
                          Instância Ativa e Funcionando
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-lg font-semibold text-green-700">
                            Status: Conectado e Ativo
                          </span>
                        </div>
                        <p className="text-green-600 leading-relaxed">
                          Sua instância está pronta para receber e processar dados do WhatsApp.
                          Os dados serão coletados automaticamente e estarão disponíveis no dashboard.
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-md mx-auto">
                        {/* ID da instância removido da exibição */}
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-lg mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <span className="text-lg font-semibold text-green-700">
                            Conexão Estabelecida com Sucesso!
                          </span>
                        </div>
                        <p className="text-green-600">
                          Você pode fechar esta página. A instância continuará funcionando e coletando dados automaticamente.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Status Desconectado */}
                  {instanceStatus === 'disconnected' && (
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-6 shadow-lg">
                        <WifiOff className="h-12 w-12 text-orange-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-orange-600">
                          ⚠️ WhatsApp Desconectado
                        </h3>
                        <p className="text-xl text-orange-700 font-medium">
                          A conexão foi perdida
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-3xl p-6 shadow-sm">
                        <p className="text-orange-700 leading-relaxed">
                          Sua instância foi desconectada ou removida da API. 
                          Gere um novo QR Code para reconectar e continuar coletando dados.
                        </p>
                      </div>
                      
                      <Button
                        onClick={regenerateQrCode}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        <Wifi className="h-6 w-6 mr-3" />
                        Reconectar WhatsApp
                      </Button>
                    </div>
                  )}

                  {/* Botão para nova instância */}
                  {instanceStatus === 'connected' && (
                    <div className="text-center pt-6">
                      <Button
                        onClick={() => {
                          setInstanceStatus('idle');
                          setInstanceCreated(false);
                          setQrCode('');
                          setInstanceId('');
                          setFormData({ instanceName: '' });
                          console.log('🗑️ Estado limpo - nova instância');
                        }}
                        variant="outline"
                        size="lg"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl px-8 py-3"
                      >
                        <Smartphone className="h-5 w-5 mr-2" />
                        Criar Nova Instância
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar com apenas o card de ajuda */}
          <div className="space-y-6">
            {/* Card de Ajuda padronizado com Dashboard */}
            <Card className="shadow-sm border border-border/50 bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-white m-auto mt-1.5" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    Como Funciona
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>Digite o nome da instância (apenas letras e números)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Clique em "Conectar WhatsApp" para gerar o QR Code</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p>Escaneie o QR Code com seu WhatsApp Business</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <p>A instância será criada e conectada automaticamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
