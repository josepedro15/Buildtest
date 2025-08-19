-- Função básica para buscar todos os usuários
-- Esta é a versão mais simples possível

CREATE OR REPLACE FUNCTION get_all_users_basic()
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

-- Comentário da função
COMMENT ON FUNCTION get_all_users_basic() IS 'Função básica para buscar todos os usuários do sistema (apenas administradores)';
