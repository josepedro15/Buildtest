import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface WhatsAppInstance {
  id: string;
  user_id: string;
  instance_name: string;
  instance_id: string;
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  qr_code?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
  last_activity?: string;
  message_count?: number;
  is_active: boolean;
}

export interface CreateInstanceData {
  instanceName: string;
  userId: string;
  email: string;
}

export function useWhatsAppInstances() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar instâncias do usuário
  const {
    data: instances,
    isLoading: isLoadingInstances,
    error: instancesError,
    refetch: refetchInstances
  } = useQuery({
    queryKey: ['whatsapp-instances', user?.id],
    queryFn: async (): Promise<WhatsAppInstance[]> => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('whatsapp_instances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 segundos
  });

  // Criar nova instância
  const createInstanceMutation = useMutation({
    mutationFn: async (instanceData: CreateInstanceData): Promise<WhatsAppInstance> => {
      // Chamada para a API Evolution
      const response = await fetch('https://api.aiensed.com/instance/connect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer d3050208ba862ee87302278ac4370cb9`
        },
        body: JSON.stringify(instanceData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro na API: ${response.status}`);
      }

      const apiData = await response.json();

      // Salvar no Supabase
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .insert({
          user_id: user?.id,
          instance_name: instanceData.instanceName,
          instance_id: apiData.instanceId,
          status: 'connecting',
          qr_code: apiData.qrCode,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (newInstance) => {
      // Atualizar cache
      queryClient.setQueryData(
        ['whatsapp-instances', user?.id],
        (oldData: WhatsAppInstance[] | undefined) => {
          return oldData ? [newInstance, ...oldData] : [newInstance];
        }
      );

      toast({
        title: "Instância criada!",
        description: "Agora escaneie o QR Code para conectar o WhatsApp.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar instância",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  });

  // Atualizar status da instância
  const updateInstanceStatusMutation = useMutation({
    mutationFn: async ({ 
      instanceId, 
      status, 
      phoneNumber 
    }: { 
      instanceId: string; 
      status: WhatsAppInstance['status']; 
      phoneNumber?: string;
    }) => {
      const { data, error } = await supabase
        .from('whatsapp_instances')
        .update({
          status,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq('instance_id', instanceId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (updatedInstance) => {
      // Atualizar cache
      queryClient.setQueryData(
        ['whatsapp-instances', user?.id],
        (oldData: WhatsAppInstance[] | undefined) => {
          if (!oldData) return [updatedInstance];
          return oldData.map(instance => 
            instance.instance_id === updatedInstance.instance_id 
              ? updatedInstance 
              : instance
          );
        }
      );
    }
  });

  // Deletar instância
  const deleteInstanceMutation = useMutation({
    mutationFn: async (instanceId: string) => {
      // Chamar API para deletar instância
      const response = await fetch(`https://api.aiensed.com/instance/delete/${instanceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer d3050208ba862ee87302278ac4370cb9`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar instância: ${response.status}`);
      }

      // Deletar do Supabase
      const { error } = await supabase
        .from('whatsapp_instances')
        .delete()
        .eq('instance_id', instanceId);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, deletedInstanceId) => {
      // Remover do cache
      queryClient.setQueryData(
        ['whatsapp-instances', user?.id],
        (oldData: WhatsAppInstance[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(instance => instance.instance_id !== deletedInstanceId);
        }
      );

      toast({
        title: "Instância removida",
        description: "A instância foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover instância",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  });

  // Verificar status das instâncias periodicamente
  const checkInstancesStatus = async () => {
    if (!instances?.length) return;

    try {
      const statusPromises = instances.map(async (instance) => {
              const response = await fetch(`https://api.aiensed.com/instance/status/${instance.instance_id}`, {
        headers: {
          'Authorization': `Bearer d3050208ba862ee87302278ac4370cb9`
        }
      });

        if (response.ok) {
          const statusData = await response.json();
          return {
            instanceId: instance.instance_id,
            status: statusData.status,
            phoneNumber: statusData.phoneNumber
          };
        }
        return null;
      });

      const statusResults = await Promise.all(statusPromises);
      
      // Atualizar apenas as instâncias que mudaram de status
      statusResults.forEach(result => {
        if (result && instances.find(i => i.instance_id === result.instanceId)?.status !== result.status) {
          updateInstanceStatusMutation.mutate({
            instanceId: result.instanceId,
            status: result.status,
            phoneNumber: result.phoneNumber
          });
        }
      });
    } catch (error) {
      console.error('Erro ao verificar status das instâncias:', error);
    }
  };

  // Verificar status a cada 30 segundos
  useEffect(() => {
    if (!instances?.length) return;

    const interval = setInterval(checkInstancesStatus, 30000);
    return () => clearInterval(interval);
  }, [instances]);

  return {
    // Dados
    instances,
    isLoadingInstances,
    instancesError,
    
    // Ações
    createInstance: createInstanceMutation.mutate,
    updateInstanceStatus: updateInstanceStatusMutation.mutate,
    deleteInstance: deleteInstanceMutation.mutate,
    refetchInstances,
    
    // Estados de loading
    isCreatingInstance: createInstanceMutation.isPending,
    isUpdatingStatus: updateInstanceStatusMutation.isPending,
    isDeletingInstance: deleteInstanceMutation.isPending,
  };
}
