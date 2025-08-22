# Configuração das Mensagens de Contato

## 📋 Visão Geral

Este documento descreve a implementação do sistema de mensagens de contato para o MetricsIA, incluindo:

- Tabela no banco de dados para armazenar mensagens
- Hook personalizado para gerenciar mensagens
- Página administrativa para visualizar e gerenciar mensagens
- Integração com o formulário de contato

## 🗄️ Estrutura do Banco de Dados

### Tabela: `contact_messages`

```sql
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  source TEXT DEFAULT 'contact_form',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id)
);
```

### Índices para Performance

```sql
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON public.contact_messages(priority);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned_to ON public.contact_messages(assigned_to);
```

### Políticas de Segurança (RLS)

```sql
-- Habilitar RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Admins podem visualizar todas as mensagens
CREATE POLICY "Admins can view all contact messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

-- Admins podem inserir mensagens
CREATE POLICY "Admins can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

-- Admins podem atualizar mensagens
CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

-- Admins podem deletar mensagens
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

-- Público pode inserir mensagens (para o formulário de contato)
CREATE POLICY "Public can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);
```

### Trigger para Atualização Automática

```sql
-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();
```

## 🚀 Como Aplicar a Migração

### Opção 1: Via Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Execute o arquivo SQL completo: `database/supabase/migrations/20250123000000_create_contact_messages_table.sql`

### Opção 2: Via Supabase CLI

```bash
# Instalar Supabase CLI (se não estiver instalado)
npm install -g supabase

# Aplicar migração
cd database
supabase db push
```

## 📁 Arquivos Criados/Modificados

### Novos Arquivos

1. **`database/supabase/migrations/20250123000000_create_contact_messages_table.sql`**
   - Migração para criar a tabela de mensagens

2. **`src/hooks/useContactMessages.tsx`**
   - Hook personalizado para gerenciar mensagens de contato

3. **`src/pages/ContactMessages.tsx`**
   - Página administrativa para visualizar e gerenciar mensagens

4. **`docs/CONTACT_MESSAGES_SETUP.md`**
   - Esta documentação

### Arquivos Modificados

1. **`src/integrations/supabase/types.ts`**
   - Adicionados tipos para a tabela `contact_messages`

2. **`src/components/ContactForm.tsx`**
   - Integrado com o hook para salvar mensagens no banco

3. **`src/App.tsx`**
   - Adicionada rota `/admin/contact-messages`

4. **`src/pages/Admin.tsx`**
   - Adicionado card para acessar mensagens de contato

## 🔧 Funcionalidades Implementadas

### Para Usuários (Público)

- ✅ Formulário de contato funcional
- ✅ Validação de campos obrigatórios
- ✅ Captura automática de IP e User Agent
- ✅ Feedback visual durante envio
- ✅ Mensagem de sucesso após envio

### Para Administradores

- ✅ Visualização de todas as mensagens
- ✅ Filtros por status e prioridade
- ✅ Busca por nome, email, empresa ou mensagem
- ✅ Estatísticas em tempo real
- ✅ Marcação de mensagens como lidas/respondidas/arquivadas
- ✅ Notas administrativas
- ✅ Exclusão de mensagens
- ✅ Interface responsiva e moderna

## 🔐 Segurança

- ✅ Row Level Security (RLS) habilitado
- ✅ Apenas admins autorizados podem visualizar mensagens
- ✅ Público pode apenas inserir mensagens
- ✅ Validação de dados no frontend e backend
- ✅ Sanitização de inputs

## 📊 Status das Mensagens

- **`pending`** - Mensagem nova, não lida
- **`read`** - Mensagem lida pelo admin
- **`replied`** - Mensagem respondida
- **`archived`** - Mensagem arquivada

## 🎯 Prioridades

- **`low`** - Baixa prioridade
- **`normal`** - Prioridade normal (padrão)
- **`high`** - Alta prioridade
- **`urgent`** - Urgente

## 🎨 Interface do Usuário

### Formulário de Contato
- Design moderno e responsivo
- Validação em tempo real
- Botão principal para WhatsApp
- Formulário alternativo para mensagens

### Painel Administrativo
- Dashboard com estatísticas
- Lista de mensagens com filtros
- Modal detalhado para cada mensagem
- Ações rápidas (marcar como lida, responder, arquivar)
- Interface intuitiva e profissional

## 🚀 Próximos Passos

1. **Aplicar a migração** no banco de dados
2. **Testar o formulário** de contato
3. **Verificar permissões** de administrador
4. **Configurar notificações** (opcional)
5. **Implementar exportação** de mensagens (opcional)

## 📞 Suporte

Para dúvidas ou problemas:

- **WhatsApp:** +55 31 99495-9512
- **Email:** contato@metricsia.com
- **Documentação:** Ver outros arquivos em `/docs/`

---

**Última atualização:** 23 de Janeiro de 2025
**Versão:** 1.0.0
