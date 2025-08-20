-- Script de teste para verificar inserção de mensagens de contato
-- Execute este script no Supabase Dashboard SQL Editor

-- 1. Verificar se a tabela existe
SELECT 
    table_name,
    table_schema,
    table_type
FROM information_schema.tables 
WHERE table_name = 'contact_messages';

-- 2. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'contact_messages'
ORDER BY ordinal_position;

-- 3. Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'contact_messages';

-- 4. Testar inserção direta (deve funcionar)
INSERT INTO public.contact_messages (
    name,
    email,
    company,
    phone,
    message,
    source
) VALUES (
    'Teste Sistema',
    'teste@example.com',
    'Empresa Teste',
    '31999999999',
    'Mensagem de teste do sistema',
    'test_script'
) RETURNING id, name, email, created_at;

-- 5. Verificar se a inserção funcionou
SELECT 
    id,
    name,
    email,
    company,
    phone,
    message,
    status,
    priority,
    source,
    created_at
FROM public.contact_messages 
WHERE source = 'test_script'
ORDER BY created_at DESC;

-- 6. Limpar dados de teste
DELETE FROM public.contact_messages WHERE source = 'test_script';
