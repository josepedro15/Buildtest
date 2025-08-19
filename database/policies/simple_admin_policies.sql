-- Simple Admin Policies for WhatsApp Instances
-- This approach doesn't use a function, just direct UUID comparison

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can view their own instances or admins can view all" ON public.whatsapp_instances;

-- List all existing policies to see what we have
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'whatsapp_instances';

-- Create new policy with direct admin check
CREATE POLICY "Users can view their own instances or admins can view all" ON public.whatsapp_instances
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID OR
    auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID
  );

-- Test the policy by checking current user
SELECT 
  auth.uid() as current_user,
  auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID as is_jose_admin,
  auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID as is_carlos_admin;

-- Test if we can see all instances
SELECT COUNT(*) as total_instances FROM public.whatsapp_instances;
