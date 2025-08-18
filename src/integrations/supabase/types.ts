export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      atendentes: {
        Row: {
          created_at: string
          id: string
          nome: string
          telefone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          telefone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          telefone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      atendimentos: {
        Row: {
          atendente_id: string | null
          created_at: string
          data_fim: string | null
          data_inicio: string
          id: string
          intencao: string | null
          nome_cliente: string | null
          nota_qualidade: number | null
          numero_cliente: string
          observacoes: string | null
          status: string | null
          tempo_resposta_medio: number | null
          total_mensagens: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          atendente_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          intencao?: string | null
          nome_cliente?: string | null
          nota_qualidade?: number | null
          numero_cliente: string
          observacoes?: string | null
          status?: string | null
          tempo_resposta_medio?: number | null
          total_mensagens?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          atendente_id?: string | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          id?: string
          intencao?: string | null
          nome_cliente?: string | null
          nota_qualidade?: number | null
          numero_cliente?: string
          observacoes?: string | null
          status?: string | null
          tempo_resposta_medio?: number | null
          total_mensagens?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_data: {
        Row: {
          atendimento_critico_cliente: string | null
          atendimento_critico_nota: number | null
          atendimento_critico_observacao: string | null
          automacao_sugerida: string[] | null
          created_at: string
          id: string
          insights_atrapalhou: string[] | null
          insights_funcionou: string[] | null
          intencao_compra: number | null
          intencao_duvida_geral: number | null
          intencao_orcamento: number | null
          intencao_reclamacao: number | null
          intencao_suporte: number | null
          melhor_atendimento_cliente: string | null
          melhor_atendimento_nota: number | null
          melhor_atendimento_observacao: string | null
          meta_nota_qualidade: string | null
          meta_taxa_conversao: string | null
          meta_tempo_resposta: string | null
          nota_media_qualidade: number | null
          periodo_fim: string
          periodo_inicio: string
          proximas_acoes: string[] | null
          taxa_conversao: number | null
          tempo_medio_resposta: number | null
          total_atendimentos: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          atendimento_critico_cliente?: string | null
          atendimento_critico_nota?: number | null
          atendimento_critico_observacao?: string | null
          automacao_sugerida?: string[] | null
          created_at?: string
          id?: string
          insights_atrapalhou?: string[] | null
          insights_funcionou?: string[] | null
          intencao_compra?: number | null
          intencao_duvida_geral?: number | null
          intencao_orcamento?: number | null
          intencao_reclamacao?: number | null
          intencao_suporte?: number | null
          melhor_atendimento_cliente?: string | null
          melhor_atendimento_nota?: number | null
          melhor_atendimento_observacao?: string | null
          meta_nota_qualidade?: string | null
          meta_taxa_conversao?: string | null
          meta_tempo_resposta?: string | null
          nota_media_qualidade?: number | null
          periodo_fim: string
          periodo_inicio: string
          proximas_acoes?: string[] | null
          taxa_conversao?: number | null
          tempo_medio_resposta?: number | null
          total_atendimentos?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          atendimento_critico_cliente?: string | null
          atendimento_critico_nota?: number | null
          atendimento_critico_observacao?: string | null
          automacao_sugerida?: string[] | null
          created_at?: string
          id?: string
          insights_atrapalhou?: string[] | null
          insights_funcionou?: string[] | null
          intencao_compra?: number | null
          intencao_duvida_geral?: number | null
          intencao_orcamento?: number | null
          intencao_reclamacao?: number | null
          intencao_suporte?: number | null
          melhor_atendimento_cliente?: string | null
          melhor_atendimento_nota?: number | null
          melhor_atendimento_observacao?: string | null
          meta_nota_qualidade?: string | null
          meta_taxa_conversao?: string | null
          meta_tempo_resposta?: string | null
          nota_media_qualidade?: number | null
          periodo_fim?: string
          periodo_inicio?: string
          proximas_acoes?: string[] | null
          taxa_conversao?: number | null
          tempo_medio_resposta?: number | null
          total_atendimentos?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_instances: {
        Row: {
          id: string
          user_id: string
          instance_name: string
          instance_id: string
          status: string
          qr_code: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
          last_activity: string | null
          message_count: number | null
          is_active: boolean | null
        }
        Insert: {
          id?: string
          user_id: string
          instance_name: string
          instance_id: string
          status?: string
          qr_code?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
          last_activity?: string | null
          message_count?: number | null
          is_active?: boolean | null
        }
        Update: {
          id?: string
          user_id?: string
          instance_name?: string
          instance_id?: string
          status?: string
          qr_code?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
          last_activity?: string | null
          message_count?: number | null
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mensagens: {
        Row: {
          atendimento_id: string
          conteudo: string
          created_at: string
          id: string
          remetente: string
          timestamp_envio: string
        }
        Insert: {
          atendimento_id: string
          conteudo: string
          created_at?: string
          id?: string
          remetente: string
          timestamp_envio?: string
        }
        Update: {
          atendimento_id?: string
          conteudo?: string
          created_at?: string
          id?: string
          remetente?: string
          timestamp_envio?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_agregadas: {
        Row: {
          created_at: string
          id: string
          nota_media: number | null
          periodo_fim: string
          periodo_inicio: string
          tempo_resposta_medio: number | null
          total_abandonos: number | null
          total_atendimentos: number | null
          total_conversoes: number | null
          total_inconclusivos: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nota_media?: number | null
          periodo_fim: string
          periodo_inicio: string
          tempo_resposta_medio?: number | null
          total_abandonos?: number | null
          total_atendimentos?: number | null
          total_conversoes?: number | null
          total_inconclusivos?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nota_media?: number | null
          periodo_fim?: string
          periodo_inicio?: string
          tempo_resposta_medio?: number | null
          total_abandonos?: number | null
          total_atendimentos?: number | null
          total_conversoes?: number | null
          total_inconclusivos?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          prazo: string | null
          prioridade: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          prioridade?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          prazo?: string | null
          prioridade?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
