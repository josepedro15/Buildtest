-- Add admin policies for whatsapp_instances table
-- This allows admin users to view all instances

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_id IN (
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
  );
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
