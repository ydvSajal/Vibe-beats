-- Clear Test User: S24CSEU1704@bennett.edu.in
-- Run this in Supabase SQL Editor

-- Step 1: Delete from public.users (cascades to related tables if FK constraints exist)
DELETE FROM public.users WHERE email = 'S24CSEU1704@bennett.edu.in';

-- Step 2: Delete from auth.users (Supabase auth table)
-- Note: You need service_role permissions for this
-- Option A: Run via Supabase Dashboard → Authentication → Users → Delete User
-- Option B: Run this SQL with service_role permissions:
DELETE FROM auth.users WHERE email = 'S24CSEU1704@bennett.edu.in';

-- Verification: Check if user is deleted
SELECT * FROM public.users WHERE email = 'S24CSEU1704@bennett.edu.in';
SELECT * FROM auth.users WHERE email = 'S24CSEU1704@bennett.edu.in';

-- Should return 0 rows for both queries if deletion was successful
