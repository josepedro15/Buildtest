-- Remove sample data from dashboard_data table
-- This ensures new users see empty data instead of sample data

-- Delete all sample data with the placeholder user_id
DELETE FROM public.dashboard_data 
WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- Verify the deletion
SELECT 'Sample data removed. Remaining records:' as info;
SELECT COUNT(*) as total_records FROM public.dashboard_data;

-- Show remaining records (if any)
SELECT user_id, total_atendimentos, taxa_conversao, created_at 
FROM public.dashboard_data 
ORDER BY created_at DESC;
