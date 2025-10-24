# 🚨 URGENT: Database Setup Required

## Why "Failed to create user profile"?

The backend tries to insert into the `users` table, but **the table doesn't exist** in your Supabase database!

## ✅ Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor
https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/sql/new

### Step 2: Copy & Paste This SQL

```sql
-- Create users table (minimum required for auth to work)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  age INTEGER,
  gender TEXT,
  location TEXT,
  musical_genre TEXT,
  favorite_artists TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_active BOOLEAN DEFAULT true,
  email_confirmed BOOLEAN DEFAULT false,
  last_active_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for your Edge Function)
CREATE POLICY "Service role has full access" ON public.users
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own data  
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);
```

### Step 3: Click "RUN" button

### Step 4: Test Your App

1. Open http://localhost:3000/
2. Click "Get Started"  
3. Enter: `S24CSEU1704@bennett.edu.in`
4. Click "Send OTP"
5. Check email for OTP
6. Enter OTP
7. **Expected**: ✅ "OTP verified! Complete your profile."
8. Navigate to Profile Creation
9. Success! 🎉

---

## What This Does

The SQL creates the `users` table that the backend needs to store user information after OTP verification.

**Without this table**: Backend crashes with "Failed to create user profile"  
**With this table**: Backend creates user record → You proceed to profile creation → App works!

---

## Full Database Setup (Optional - Do Later)

If you want all features (swipes, matches, messages, leaderboard):

1. Open: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/sql/new
2. Copy all SQL from: `supabase/migrations/002_create_proper_schema.sql`
3. Paste and RUN
4. Repeat for: `003_create_rls_policies.sql` and `004_create_storage_buckets.sql`

But for NOW, just run the quick fix above to get auth working!

---

**GO RUN THE SQL NOW! Then test your app - it will work!** 🚀
