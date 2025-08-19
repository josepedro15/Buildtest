-- Emergency Fix for Duplicate Policy Error
-- This script will specifically handle the duplicate policy issue

-- First, let's see exactly what policies exist
SELECT '=== CURRENT POLICIES ===' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'whatsapp_instances'
ORDER BY policyname;

-- Try to drop the specific problematic policy
SELECT '=== DROPPING PROBLEMATIC POLICY ===' as info;
DROP POLICY IF EXISTS "Users can view their own instances or admins can view all" ON public.whatsapp_instances;

-- Check if it was dropped
SELECT '=== AFTER DROP ATTEMPT ===' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'whatsapp_instances'
ORDER BY policyname;

-- If the policy still exists, try to drop it with CASCADE
SELECT '=== TRYING CASCADE DROP ===' as info;
-- Note: This is a more aggressive approach
DO $$
BEGIN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view their own instances or admins can view all" ON public.whatsapp_instances CASCADE';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop policy: %', SQLERRM;
END $$;

-- Now try to create the policy again
SELECT '=== CREATING NEW POLICY ===' as info;
CREATE POLICY "Users can view their own instances or admins can view all" ON public.whatsapp_instances
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID OR
    auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID
  );

-- Verify the new policy
SELECT '=== FINAL POLICIES ===' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'whatsapp_instances'
ORDER BY policyname;

-- Test admin access
SELECT '=== TESTING ADMIN ACCESS ===' as info;
SELECT 
    auth.uid() as current_user,
    auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID as is_jose_admin,
    auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID as is_carlos_admin;

-- Test if we can see instances
SELECT '=== TESTING INSTANCE ACCESS ===' as info;
SELECT COUNT(*) as total_instances FROM public.whatsapp_instances;
