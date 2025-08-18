# Configuração das Funções Administrativas

## Como aplicar as funções no Supabase

### 1. Acesse o Supabase Dashboard
- Vá para https://supabase.com/dashboard
- Selecione seu projeto

### 2. Execute o SQL no Editor SQL
- Vá para "SQL Editor" no menu lateral
- Clique em "New query"
- **IMPORTANTE**: Cole APENAS o código SQL abaixo (não copie as instruções markdown)
- Ou use o arquivo `admin_functions.sql` que foi criado no projeto

```sql
-- Função para buscar todos os usuários (apenas para administradores)
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_user_meta_data JSONB
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se o usuário atual é administrador
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND id IN (
      'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
      '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
    )
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem executar esta função';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    u.raw_user_meta_data
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Função para buscar dados completos de um usuário específico
CREATE OR REPLACE FUNCTION get_user_details(user_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_user_meta_data JSONB,
  whatsapp_instances JSONB
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se o usuário atual é administrador
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND id IN (
      'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
      '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
    )
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem executar esta função';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    u.raw_user_meta_data,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', instances.id,
          'instance_name', instances.instance_name,
          'status', instances.status,
          'phone_number', instances.phone_number,
          'created_at', instances.created_at,
          'last_activity', instances.last_activity
        )
      ) FROM whatsapp_instances instances WHERE instances.user_id = u.id AND instances.is_active = true),
      '[]'::jsonb
    ) as whatsapp_instances
  FROM auth.users u
  WHERE u.id = user_id;
END;
$$;

-- Função para buscar todos os usuários com suas instâncias do WhatsApp
CREATE OR REPLACE FUNCTION get_all_users_with_instances()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  raw_user_meta_data JSONB,
  whatsapp_instances JSONB
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verificar se o usuário atual é administrador
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND id IN (
      'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
      '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
    )
  ) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem executar esta função';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.created_at,
    u.last_sign_in_at,
    u.raw_user_meta_data,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', instances.id,
          'instance_name', instances.instance_name,
          'status', instances.status,
          'phone_number', instances.phone_number,
          'created_at', instances.created_at,
          'last_activity', instances.last_activity
        )
      ) FROM whatsapp_instances instances WHERE instances.user_id = u.id AND instances.is_active = true),
      '[]'::jsonb
    ) as whatsapp_instances
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Comentários das funções
COMMENT ON FUNCTION get_all_users() IS 'Função para buscar todos os usuários do sistema (apenas administradores)';
COMMENT ON FUNCTION get_user_details(UUID) IS 'Função para buscar detalhes de um usuário específico com suas instâncias do WhatsApp (apenas administradores)';
COMMENT ON FUNCTION get_all_users_with_instances() IS 'Função para buscar todos os usuários com suas instâncias do WhatsApp (apenas administradores)';
```

### 3. Execute a Query
- Clique em "Run" para executar o SQL
- Aguarde a confirmação de que as funções foram criadas

### 4. Verificação
- Vá para "Database" > "Functions" no menu lateral
- Você deve ver as 3 funções criadas:
  - `get_all_users()`
  - `get_user_details(UUID)`
  - `get_all_users_with_instances()`

## Funcionalidades das Funções

### get_all_users()
- Retorna todos os usuários cadastrados no sistema
- Inclui email, data de criação, último acesso e metadados
- Ordenados por data de criação (mais recentes primeiro)

### get_user_details(user_id)
- Retorna detalhes de um usuário específico
- Inclui todas as instâncias do WhatsApp vinculadas
- Útil para visualização detalhada de um usuário

### get_all_users_with_instances()
- Retorna todos os usuários com suas instâncias do WhatsApp
- Função principal usada pela página de administradores
- Combina dados de usuários e instâncias em uma única consulta

## Segurança
- Todas as funções verificam se o usuário atual é administrador
- Apenas os IDs específicos podem executar estas funções
- Erro de acesso negado para usuários não autorizados

## Após a Configuração
Após aplicar estas funções, a página de administradores irá:
1. Exibir todos os usuários cadastrados no sistema
2. Mostrar o nome do usuário (se disponível nos metadados)
3. Listar todas as instâncias do WhatsApp vinculadas
4. Permitir busca por nome, email ou ID
