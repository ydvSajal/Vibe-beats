# 🚀 ONE-BY-ONE SQL COMMANDS FOR SUPABASE

**Copy each section one by one and paste into Supabase SQL Editor**

Link: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/sql/new

---

# ✨ COPY-PASTE READY QUERIES

## Query 1️⃣: Create All Tables

Open `supabase/migrations/002_create_proper_schema.sql` and copy the entire content.

Or copy from below (select all text):

```sql
-- ============================================================================
-- Migration: Create Proper Database Schema for Vibe Beats
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  last_active_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX idx_users_is_active ON public.users(is_active);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_completed BOOLEAN DEFAULT false,
  profile_picture_url TEXT,
  bio TEXT,
  music_taste TEXT,
  favorite_songs TEXT[],
  favorite_artists TEXT[],
  spotify_playlist_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_completed ON public.user_profiles(profile_completed);

CREATE TABLE IF NOT EXISTS public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  swiped_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  song_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('like', 'skip')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT no_self_swipe CHECK (swiper_id != swiped_user_id),
  UNIQUE(swiper_id, swiped_user_id, song_id)
);

CREATE INDEX idx_swipes_swiper ON public.swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON public.swipes(swiped_user_id);
CREATE INDEX idx_swipes_direction ON public.swipes(direction);
CREATE INDEX idx_swipes_created ON public.swipes(created_at DESC);

CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  song_id TEXT NOT NULL,
  match_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_order CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id, song_id)
);

CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);
CREATE INDEX idx_matches_created ON public.matches(created_at DESC);
CREATE INDEX idx_matches_score ON public.matches(match_score DESC);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT no_self_message CHECK (sender_id != recipient_id)
);

CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, recipient_id);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_order CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX idx_conversations_user1 ON public.conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON public.conversations(user2_id);
CREATE INDEX idx_conversations_updated ON public.conversations(updated_at DESC);

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  rank INTEGER,
  points INTEGER DEFAULT 0,
  matches_count INTEGER DEFAULT 0,
  week_points INTEGER DEFAULT 0,
  month_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_leaderboard_rank ON public.leaderboard(rank);
CREATE INDEX idx_leaderboard_points ON public.leaderboard(points DESC);
CREATE INDEX idx_leaderboard_updated ON public.leaderboard(updated_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**After pasting:**
- Click **Run** button
- Wait for ✅ "Query executed successfully"

---

## Query 2️⃣: Create RLS Policies

Open `supabase/migrations/003_create_rls_policies.sql` and copy the entire content.

Or copy from below:

```sql
-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON public.users
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- USER PROFILES TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view other profiles" ON public.user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SWIPES TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own swipes" ON public.swipes
  FOR SELECT
  USING (auth.uid() = swiper_id);

CREATE POLICY "Users can insert own swipes" ON public.swipes
  FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- ============================================================================
-- MATCHES TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Service role can insert matches" ON public.matches
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- MESSAGES TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read" ON public.messages
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- ============================================================================
-- CONVERSATIONS TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Service role manages conversations" ON public.conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role updates conversations" ON public.conversations
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- LEADERBOARD TABLE POLICIES
-- ============================================================================

CREATE POLICY "Public leaderboard view" ON public.leaderboard
  FOR SELECT
  USING (true);

CREATE POLICY "Service role updates leaderboard" ON public.leaderboard
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role updates rankings" ON public.leaderboard
  FOR UPDATE
  WITH CHECK (true);
```

**After pasting:**
- Click **Run** button
- Wait for ✅ "Query executed successfully"

---

## Query 3️⃣: Verify Everything Works

**Paste this to verify:**

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**You should see these 7 tables:**
- conversations
- leaderboard
- matches
- messages
- swipes
- user_profiles
- users

---

## Query 4️⃣: Create Test User

**Paste this:**

```sql
INSERT INTO public.users (email, name, bio) 
VALUES ('test@bennett.edu.in', 'Test User', 'Testing Vibe Beats')
RETURNING id, email, name, created_at;
```

**You should see:**
```
id                                    | email                  | name       | created_at
550e8400-e29b-41d4-a716-446655440000 | test@bennett.edu.in    | Test User  | 2025-10-22...
```

✅ If you see the UUID, everything works!

---

## 🎯 Storage Buckets (Manual UI)

Go to: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/storage/buckets

**Create these 3 buckets:**

1. **avatars** (Public)
2. **profile-pictures** (Public)
3. **cover-photos** (Public)

For each bucket:
- Click **+ New Bucket**
- Enter name
- Toggle **Public bucket** ✅
- Click **Create bucket**

---

## Query 5️⃣: Storage Policies

Open `supabase/migrations/004_create_storage_buckets.sql` and copy the content.

Paste into SQL Editor and click **Run**.

---

## ✅ Done!

You now have:
- ✅ 7 Production Tables
- ✅ Row Level Security
- ✅ 3 Storage Buckets
- ✅ Performance Indexes
- ✅ Ready for Frontend!

---

## 📝 Notes

- Copy the **entire content** of each migration file
- Paste into Supabase **SQL Editor → New Query**
- Click **Run** after each one
- Wait for "Query executed successfully" message
- If you get errors, check the error message and try again

---

## 🆘 Common Errors

| Error | Solution |
|-------|----------|
| "already exists" | Normal if running twice - just skip |
| "permission denied" | Make sure you're logged in as admin |
| "syntax error" | Make sure you copied the entire query |
| Timeout | Try breaking query into smaller pieces |

---

**Ready to build!** 🚀

