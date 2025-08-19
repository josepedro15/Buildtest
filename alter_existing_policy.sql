-- Alter Existing Policy Instead of Recreating
-- This approach modifies the existing policy instead of dropping and recreating

-- First, let's see the current policy
SELECT '=== CURRENT POLICY ===' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'whatsapp_instances' 
AND policyname = 'Users can view their own instances or admins can view all';

-- Since we can't directly alter a policy, we need to drop and recreate
-- But let's do it in a transaction to be safe
BEGIN;

-- Drop the existing policy
DROP POLICY "Users can view their own instances or admins can view all" ON public.whatsapp_instances;

-- Create the new policy with admin access
CREATE POLICY "Users can view their own instances or admins can view all" ON public.whatsapp_instances
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID OR
    auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID
  );

-- Verify the change
SELECT '=== NEW POLICY ===' as info;
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'whatsapp_instances' 
AND policyname = 'Users can view their own instances or admins can view all';

-- Test the policy
SELECT '=== TESTING ===' as info;
SELECT 
    auth.uid() as current_user,
    auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID as is_jose_admin,
    auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID as is_carlos_admin;

SELECT COUNT(*) as total_instances FROM public.whatsapp_instances;

COMMIT;
