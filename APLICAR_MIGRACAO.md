# Como Aplicar a Migração no Supabase

## Passo a Passo

### 1. Acessar o Painel do Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto `pabomyvzfjicpkeioncb`

### 2. Aplicar a Migração

#### Opção A: Via SQL Editor (Recomendado)

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole o seguinte SQL:

```sql
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
```

4. Clique em **Run** para executar

#### Opção B: Via Migrations

1. No painel do Supabase, vá para **Database > Migrations**
2. Clique em **New Migration**
3. Cole o SQL acima
4. Clique em **Apply**

### 3. Verificar se Funcionou

1. Vá para **Database > Tables > dashboard_data**
2. Clique em **Policies**
3. Você deve ver a nova política `Allow n8n insertions via service role`

### 4. Testar a Inserção

1. Vá para **SQL Editor**
2. Execute este teste:

```sql
-- Teste de inserção (deve funcionar agora)
INSERT INTO public.dashboard_data (
  user_id,
  periodo_inicio,
  periodo_fim,
  total_atendimentos,
  taxa_conversao
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '2024-01-01',
  '2024-01-31',
  100,
  25.0
);
```

### 5. Configurar Variáveis de Ambiente no N8N

1. No n8n, vá para **Settings > Variables**
2. Adicione:
   - `SUPABASE_SERVICE_ROLE_KEY`: Sua service role key do Supabase

### 6. Importar o Workflow

1. No n8n, vá para **Workflows**
2. Clique em **Import from File**
3. Selecione o arquivo `exemplo-n8n-workflow.json`
4. Ajuste o `user_id` para um UUID válido do seu sistema

## Troubleshooting

### Erro: "Policy already exists"

Se você receber esse erro, significa que a política já foi criada. Pode ignorar.

### Erro: "Permission denied"

1. Verifique se você está usando a **service role key** (não a anon key)
2. Confirme se a migração foi aplicada corretamente
3. Verifique se o `user_id` existe na tabela `auth.users`

### Erro: "Invalid UUID"

1. Certifique-se de que o `user_id` é um UUID válido
2. Verifique se o usuário existe no sistema

## Próximos Passos

Após aplicar a migração:

1. Configure o n8n conforme o arquivo `N8N_SUPABASE_SETUP.md`
2. Teste o workflow com dados reais
3. Ajuste os campos conforme necessário para seu caso de uso

## Segurança

⚠️ **IMPORTANTE**: 
- A service role key tem acesso total ao banco
- Mantenha-a segura e não a exponha publicamente
- Use variáveis de ambiente no n8n
- Monitore as inserções via logs do Supabase
