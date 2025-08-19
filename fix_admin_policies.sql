-- Fix Admin Policies for WhatsApp Instances
-- This script will clean up and recreate all policies properly

-- First, let's see what policies exist
SELECT 'Current policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'whatsapp_instances';

-- Drop ALL existing policies for whatsapp_instances
DROP POLICY IF EXISTS "Users can view their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can view their own instances or admins can view all" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can insert their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can update their own instances" ON public.whatsapp_instances;
DROP POLICY IF EXISTS "Users can delete their own instances" ON public.whatsapp_instances;

-- Verify all policies are dropped
SELECT 'After dropping policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'whatsapp_instances';

-- Now recreate all policies with admin access
CREATE POLICY "Users can view their own instances or admins can view all" ON public.whatsapp_instances
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID OR
    auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID
  );

CREATE POLICY "Users can insert their own instances" ON public.whatsapp_instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own instances" ON public.whatsapp_instances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own instances" ON public.whatsapp_instances
  FOR DELETE USING (auth.uid() = user_id);

-- Verify new policies are created
SELECT 'New policies created:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'whatsapp_instances';

-- Test the policy by checking current user
SELECT 'Testing current user:' as info;
SELECT 
  auth.uid() as current_user,
  auth.uid() = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID as is_jose_admin,
  auth.uid() = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID as is_carlos_admin;

-- Test if we can see all instances
SELECT 'Testing instance access:' as info;
SELECT COUNT(*) as total_instances FROM public.whatsapp_instances;
