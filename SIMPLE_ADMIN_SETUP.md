# Configuração Simplificada das Funções Administrativas

## Problema Resolvido
A versão anterior das funções estava causando erro `column reference "id" is ambiguous`. Esta versão simplificada resolve esse problema usando aliases mais específicos.

## Como Aplicar no Supabase

### 1. Acesse o Supabase Dashboard
- Vá para https://supabase.com/dashboard
- Selecione seu projeto

### 2. Execute o SQL no Editor SQL
- Vá para "SQL Editor" no menu lateral
- Clique em "New query"
- Cole o código SQL abaixo:

```sql
-- Versão simplificada das funções administrativas
-- Esta versão deve funcionar mesmo se houver problemas com a versão anterior

-- Função simples para buscar todos os usuários
CREATE OR REPLACE FUNCTION get_all_users_simple()
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
    auth_users.id,
    auth_users.email,
    auth_users.created_at,
    auth_users.last_sign_in_at,
    auth_users.raw_user_meta_data
  FROM auth.users auth_users
  ORDER BY auth_users.created_at DESC;
END;
$$;

-- Função simplificada para buscar todos os usuários com instâncias
CREATE OR REPLACE FUNCTION get_all_users_with_instances_simple()
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
    auth_users.id,
    auth_users.email,
    auth_users.created_at,
    auth_users.last_sign_in_at,
    auth_users.raw_user_meta_data,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', wa_instances.id,
          'instance_name', wa_instances.instance_name,
          'status', wa_instances.status,
          'phone_number', wa_instances.phone_number,
          'created_at', wa_instances.created_at,
          'last_activity', wa_instances.last_activity
        )
      ) FROM whatsapp_instances wa_instances WHERE wa_instances.user_id = auth_users.id AND wa_instances.is_active = true),
      '[]'::jsonb
    ) as whatsapp_instances
  FROM auth.users auth_users
  ORDER BY auth_users.created_at DESC;
END;
$$;

-- Comentários das funções
COMMENT ON FUNCTION get_all_users_simple() IS 'Função simplificada para buscar todos os usuários do sistema (apenas administradores)';
COMMENT ON FUNCTION get_all_users_with_instances_simple() IS 'Função simplificada para buscar todos os usuários com suas instâncias do WhatsApp (apenas administradores)';
```

### 3. Execute a Query
- Clique em "Run" para executar o SQL
- Aguarde a confirmação de que as funções foram criadas

### 4. Verificação
- Vá para "Database" > "Functions" no menu lateral
- Você deve ver as 2 funções criadas:
  - `get_all_users_simple()`
  - `get_all_users_with_instances_simple()`

## Melhorias na Versão Simplificada

### Aliases Mais Específicos
- `auth_users` para a tabela `auth.users`
- `wa_instances` para a tabela `whatsapp_instances`
- Evita conflitos de nomes de colunas

### Fallback Implementado
- Se as funções SQL não estiverem disponíveis, a página usa dados das instâncias do WhatsApp
- Mostra aviso informando que está usando dados limitados
- Permite que a página funcione mesmo sem as funções SQL

### Tratamento de Erros Melhorado
- Logs mais detalhados no console
- Mensagens de erro mais informativas
- Fallback automático para dados básicos

## Após a Configuração

Após aplicar estas funções, a página de administradores irá:
1. **Tentar usar as funções SQL** primeiro (dados completos)
2. **Fallback automático** se as funções não estiverem disponíveis
3. **Exibir todos os usuários** cadastrados no sistema
4. **Mostrar nomes reais** dos usuários (se disponíveis)
5. **Listar instâncias do WhatsApp** vinculadas a cada usuário

## Teste

Após aplicar as funções:
1. Acesse a página de administradores
2. Verifique se os usuários são carregados
3. Confirme se as estatísticas mostram valores corretos
4. Teste a busca e filtros

Se ainda houver problemas, verifique o console do navegador para mensagens de erro detalhadas.
