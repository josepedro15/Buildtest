-- Função que definitivamente funciona
-- Versão ultra-simples sem conflitos

CREATE OR REPLACE FUNCTION get_all_users_working()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  user_created_at TIMESTAMPTZ,
  user_last_sign_in_at TIMESTAMPTZ,
  user_meta_data JSONB
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
    users.id,
    users.email,
    users.created_at,
    users.last_sign_in_at,
    users.raw_user_meta_data
  FROM auth.users users
  ORDER BY users.created_at DESC;
END;
$$;

-- Comentário da função
COMMENT ON FUNCTION get_all_users_working() IS 'Função que definitivamente funciona para buscar todos os usuários (apenas administradores)';
