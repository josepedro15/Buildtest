-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'vendedor' CHECK (role IN ('admin', 'vendedor')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de atendentes
CREATE TABLE public.atendentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de atendimentos do WhatsApp
CREATE TABLE public.atendimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  atendente_id UUID REFERENCES public.atendentes(id),
  numero_cliente TEXT NOT NULL,
  nome_cliente TEXT,
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'convertido', 'abandonado', 'inconclusivo')),
  intencao TEXT CHECK (intencao IN ('compra', 'duvida_geral', 'reclamacao', 'suporte', 'orcamento')),
  nota_qualidade INTEGER CHECK (nota_qualidade >= 1 AND nota_qualidade <= 5),
  tempo_resposta_medio INTEGER, -- em segundos
  total_mensagens INTEGER DEFAULT 0,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fim TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de mensagens
CREATE TABLE public.mensagens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  atendimento_id UUID NOT NULL REFERENCES public.atendimentos(id) ON DELETE CASCADE,
  remetente TEXT NOT NULL CHECK (remetente IN ('cliente', 'atendente')),
  conteudo TEXT NOT NULL,
  timestamp_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de métricas agregadas
CREATE TABLE public.metricas_agregadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  total_atendimentos INTEGER DEFAULT 0,
  total_conversoes INTEGER DEFAULT 0,
  total_abandonos INTEGER DEFAULT 0,
  total_inconclusivos INTEGER DEFAULT 0,
  tempo_resposta_medio INTEGER DEFAULT 0,
  nota_media DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, periodo_inicio, periodo_fim)
);

-- Criar tabela de tarefas/ações
CREATE TABLE public.tarefas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
  prazo DATE,
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_agregadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para atendentes
CREATE POLICY "Users can view their own atendentes" ON public.atendentes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own atendentes" ON public.atendentes
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para atendimentos
CREATE POLICY "Users can view their own atendimentos" ON public.atendimentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own atendimentos" ON public.atendimentos
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para mensagens
CREATE POLICY "Users can view messages from their atendimentos" ON public.mensagens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.atendimentos 
      WHERE atendimentos.id = mensagens.atendimento_id 
      AND atendimentos.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage messages from their atendimentos" ON public.mensagens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.atendimentos 
      WHERE atendimentos.id = mensagens.atendimento_id 
      AND atendimentos.user_id = auth.uid()
    )
  );

-- Políticas RLS para métricas
CREATE POLICY "Users can view their own metrics" ON public.metricas_agregadas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own metrics" ON public.metricas_agregadas
  FOR ALL USING (auth.uid() = user_id);

-- Políticas RLS para tarefas
CREATE POLICY "Users can view their own tasks" ON public.tarefas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tasks" ON public.tarefas
  FOR ALL USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_atendimentos_updated_at
  BEFORE UPDATE ON public.atendimentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_metricas_updated_at
  BEFORE UPDATE ON public.metricas_agregadas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON public.tarefas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();