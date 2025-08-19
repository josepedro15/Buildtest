-- Função simples que deve funcionar
-- Usando uma abordagem diferente

CREATE OR REPLACE FUNCTION get_users_simple()
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
COMMENT ON FUNCTION get_users_simple() IS 'Função simples para buscar usuários (apenas administradores)';
