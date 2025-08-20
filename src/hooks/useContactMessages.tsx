import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  status: 'pending' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  source: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  replied_at: string | null;
  admin_notes: string | null;
  assigned_to: string | null;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export function useContactMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // IDs dos administradores autorizados
  const adminUserIds = [
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
  ];

  const isAdmin = adminUserIds.includes(user?.id || '');

  // Log da configuração do Supabase
  console.log('Configuração do Supabase:', {
    url: supabase.supabaseUrl,
    hasAnonKey: !!supabase.supabaseKey,
    user: user?.id,
    isAdmin
  });

  // Buscar mensagens de contato (apenas para admins)
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async (): Promise<ContactMessage[]> => {
      if (!isAdmin) {
        throw new Error('Acesso negado: apenas administradores podem visualizar mensagens');
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
    enabled: isAdmin,
    staleTime: 30 * 1000, // 30 segundos
  });

  // Criar nova mensagem de contato (público)
  const createMessageMutation = useMutation({
    mutationFn: async (messageData: CreateContactMessageData): Promise<ContactMessage> => {
      try {
        // Capturar informações do navegador
        const userAgent = navigator.userAgent;
        let ipAddress = null;
        
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            ipAddress = ipData.ip;
          }
        } catch (ipError) {
          console.warn('Erro ao obter IP:', ipError);
        }

        console.log('Tentando inserir mensagem:', {
          ...messageData,
          source: 'contact_form',
          ip_address: ipAddress,
          user_agent: userAgent,
          status: 'pending',
          priority: 'normal'
        });

        const { data, error } = await supabase
          .from('contact_messages')
          .insert({
            ...messageData,
            source: 'contact_form',
            ip_address: ipAddress,
            user_agent: userAgent,
            status: 'pending',
            priority: 'normal'
          })
          .select()
          .single();

        if (error) {
          console.error('Erro do Supabase:', error);
          throw new Error(`Erro do banco de dados: ${error.message} (${error.code})`);
        }

        if (!data) {
          throw new Error('Nenhum dado retornado após inserção');
        }

        console.log('Mensagem inserida com sucesso:', data);
        return data;
      } catch (error) {
        console.error('Erro completo na criação da mensagem:', error);
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error(`Erro inesperado: ${String(error)}`);
        }
      }
    },
    onSuccess: () => {
      // Atualizar cache se for admin
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      }

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Nossa equipe entrará em contato em até 24 horas.",
      });
    },
    onError: (error) => {
      console.error('Erro no onError do mutation:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : `Erro desconhecido: ${String(error)}`,
        variant: "destructive"
      });
    }
  });

  // Atualizar status da mensagem (apenas para admins)
  const updateMessageStatusMutation = useMutation({
    mutationFn: async ({ 
      messageId, 
      status, 
      adminNotes 
    }: { 
      messageId: string; 
      status: ContactMessage['status']; 
      adminNotes?: string;
    }) => {
      if (!isAdmin) {
        throw new Error('Acesso negado: apenas administradores podem atualizar mensagens');
      }

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      // Adicionar timestamps específicos
      if (status === 'read' && !updateData.read_at) {
        updateData.read_at = new Date().toISOString();
      }
      if (status === 'replied' && !updateData.replied_at) {
        updateData.replied_at = new Date().toISOString();
      }
      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .update(updateData)
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: (updatedMessage) => {
      // Atualizar cache
      queryClient.setQueryData(
        ['contact-messages'],
        (oldData: ContactMessage[] | undefined) => {
          if (!oldData) return [updatedMessage];
          return oldData.map(message => 
            message.id === updatedMessage.id ? updatedMessage : message
          );
        }
      );

      toast({
        title: "Status atualizado",
        description: `Mensagem marcada como ${updatedMessage.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  });

  // Deletar mensagem (apenas para admins)
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!isAdmin) {
        throw new Error('Acesso negado: apenas administradores podem deletar mensagens');
      }

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, deletedMessageId) => {
      // Remover do cache
      queryClient.setQueryData(
        ['contact-messages'],
        (oldData: ContactMessage[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(message => message.id !== deletedMessageId);
        }
      );

      toast({
        title: "Mensagem removida",
        description: "A mensagem foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover mensagem",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    }
  });

  // Estatísticas das mensagens
  const getMessageStats = () => {
    if (!messages) return null;

    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'pending').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
      archived: messages.filter(m => m.status === 'archived').length,
      urgent: messages.filter(m => m.priority === 'urgent').length,
      high: messages.filter(m => m.priority === 'high').length,
      today: messages.filter(m => {
        const today = new Date().toDateString();
        return new Date(m.created_at).toDateString() === today;
      }).length,
      thisWeek: messages.filter(m => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(m.created_at) >= weekAgo;
      }).length
    };
  };

  return {
    // Dados
    messages,
    isLoadingMessages,
    messagesError,
    messageStats: getMessageStats(),
    
    // Ações
    createMessage: createMessageMutation.mutate,
    updateMessageStatus: updateMessageStatusMutation.mutate,
    deleteMessage: deleteMessageMutation.mutate,
    refetchMessages,
    
    // Estados de loading
    isCreatingMessage: createMessageMutation.isPending,
    isUpdatingStatus: updateMessageStatusMutation.isPending,
    isDeletingMessage: deleteMessageMutation.isPending,
    
    // Permissões
    isAdmin
  };
}
