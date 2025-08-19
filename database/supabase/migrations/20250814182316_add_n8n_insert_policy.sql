-- Adicionar política para permitir inserções via n8n (service role)
-- Esta política permite inserções quando não há usuário autenticado (via service role)
-- mas mantém a segurança para usuários autenticados

-- Política para inserções via n8n (service role)
CREATE POLICY "Allow n8n insertions via service role" 
ON public.dashboard_data 
FOR INSERT 
WITH CHECK (
  -- Permite inserção quando não há usuário autenticado (via service role)
  auth.uid() IS NULL
  OR 
  -- Ou quando há usuário autenticado (via aplicação web)
  auth.uid() = user_id
);

-- Comentário: Esta política permite que o n8n insira dados usando a service role key
-- sem violar as políticas de segurança existentes para usuários autenticados
-- A política original "Users can insert their own dashboard data" continua funcionando
-- para usuários autenticados, e esta nova política permite inserções via service role
