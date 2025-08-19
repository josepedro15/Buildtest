-- Test Admin Function
-- Execute this to test if the admin function works correctly

-- First, let's create a simple test function
CREATE OR REPLACE FUNCTION test_is_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Convert text to UUID and check
  RETURN user_id::UUID IN (
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID,
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID
  );
END;
$$ LANGUAGE plpgsql;

-- Test the function
SELECT 'f4c09bd2-db18-44f3-8eb9-66a50e883b67' as user_id, test_is_admin('f4c09bd2-db18-44f3-8eb9-66a50e883b67') as is_admin;
SELECT '09961117-d889-4ed7-bfcf-cac6b5e4e5a6' as user_id, test_is_admin('09961117-d889-4ed7-bfcf-cac6b5e4e5a6') as is_admin;
SELECT '00000000-0000-0000-0000-000000000000' as user_id, test_is_admin('00000000-0000-0000-0000-000000000000') as is_admin;

-- Now create the actual admin function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_id IN (
    'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID,
    '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the actual function
SELECT 'f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID as user_id, is_admin('f4c09bd2-db18-44f3-8eb9-66a50e883b67'::UUID) as is_admin;
SELECT '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID as user_id, is_admin('09961117-d889-4ed7-bfcf-cac6b5e4e5a6'::UUID) as is_admin;
SELECT '00000000-0000-0000-0000-000000000000'::UUID as user_id, is_admin('00000000-0000-0000-0000-000000000000'::UUID) as is_admin;
