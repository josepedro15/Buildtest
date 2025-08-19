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
