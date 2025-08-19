-- Admin Policies for WhatsApp Instances
-- Execute this SQL in your Supabase SQL Editor

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Debug: Log the user_id being checked
  RAISE NOTICE 'Checking if user % is admin', user_id;
  
  -- Check if user_id matches any admin ID
  IF user_id = 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID THEN
    RETURN TRUE;
  ELSIF user_id = '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own instances" ON public.whatsapp_instances;

-- Create new policies that allow admins to view all instances
CREATE POLICY "Users can view their own instances or admins can view all" ON public.whatsapp_instances
  FOR SELECT USING (
    auth.uid() = user_id OR 
    is_admin(auth.uid())
  );

-- Add comment
COMMENT ON FUNCTION is_admin(UUID) IS 'Function to check if a user is an admin';

-- Verify the function works
SELECT is_admin('f4c09bd2-db18-44f3-8eb9-66a50e883b67'); -- Should return true
SELECT is_admin('09961117-d889-4ed7-bfcf-cac6b5e4e5a6'); -- Should return true
SELECT is_admin('00000000-0000-0000-0000-000000000000'); -- Should return false
