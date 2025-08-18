import { z } from 'zod';

// Auth Validations
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Dashboard Data Validations
export const dashboardDataSchema = z.object({
  total_atendimentos: z.number().min(0, 'Total de atendimentos deve ser positivo'),
  taxa_conversao: z.number().min(0).max(100, 'Taxa de conversão deve estar entre 0 e 100'),
  tempo_medio_resposta: z.number().min(0, 'Tempo de resposta deve ser positivo'),
  nota_media_qualidade: z.number().min(0).max(5, 'Nota deve estar entre 0 e 5'),
  intencao_compra: z.number().min(0).max(100),
  intencao_duvida_geral: z.number().min(0).max(100),
  intencao_reclamacao: z.number().min(0).max(100),
  intencao_suporte: z.number().min(0).max(100),
  intencao_orcamento: z.number().min(0).max(100),
  insights_funcionou: z.array(z.string()).optional(),
  insights_atrapalhou: z.array(z.string()).optional(),
  melhor_atendimento_cliente: z.string().optional(),
  melhor_atendimento_observacao: z.string().optional(),
  melhor_atendimento_nota: z.number().min(0).max(5).optional(),
  atendimento_critico_cliente: z.string().optional(),
  atendimento_critico_observacao: z.string().optional(),
  atendimento_critico_nota: z.number().min(0).max(5).optional(),
  automacao_sugerida: z.array(z.string()).optional(),
  proximas_acoes: z.array(z.string()).optional(),
  meta_taxa_conversao: z.string().optional(),
  meta_tempo_resposta: z.string().optional(),
  meta_nota_qualidade: z.string().optional(),
});

// Export Options Validation
export const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'excel', 'pdf']),
  includeMetrics: z.boolean().optional(),
  includeIntentions: z.boolean().optional(),
  includeInsights: z.boolean().optional(),
  includeHighlights: z.boolean().optional(),
  includeAutomation: z.boolean().optional(),
  includeActions: z.boolean().optional(),
  includeGoals: z.boolean().optional(),
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }).optional(),
});

// Filter Validation
export const filterSchema = z.object({
  selectedDate: z.date().optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// Contact Form Validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'Empresa deve ter pelo menos 2 caracteres'),
  phone: z.string().optional(),
  message: z.string().optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type DashboardDataForm = z.infer<typeof dashboardDataSchema>;
export type ExportOptionsForm = z.infer<typeof exportOptionsSchema>;
export type FilterForm = z.infer<typeof filterSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
