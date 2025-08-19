-- Remove Sample Data from Dashboard
-- Execute this in Supabase SQL Editor to remove all sample data

-- First, let's see what sample data exists
SELECT '=== CURRENT SAMPLE DATA ===' as info;
SELECT 
    user_id,
    total_atendimentos,
    taxa_conversao,
    intencao_compra,
    intencao_duvida_geral,
    created_at
FROM public.dashboard_data 
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Delete all sample data
SELECT '=== DELETING SAMPLE DATA ===' as info;
DELETE FROM public.dashboard_data 
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Verify deletion
SELECT '=== AFTER DELETION ===' as info;
SELECT COUNT(*) as total_records FROM public.dashboard_data;

-- Show remaining records
SELECT '=== REMAINING RECORDS ===' as info;
SELECT 
    user_id,
    total_atendimentos,
    taxa_conversao,
    created_at
FROM public.dashboard_data 
ORDER BY created_at DESC;
