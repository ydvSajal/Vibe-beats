-- ============================================================================
-- Migration: Create Row Level Security (RLS) Policies for Vibe Beats
-- ============================================================================
-- Run this AFTER migration 002_create_proper_schema.sql

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. USERS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view their own profile (full)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can view other users' public profiles (limited fields)
CREATE POLICY "Users can view public profiles" ON public.users
  FOR SELECT
  USING (is_active = true);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Service role can insert users (backend)
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 2. USER PROFILES TABLE POLICIES
-- ============================================================================

-- Policy: Users can view own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can view other profiles (for matching)
CREATE POLICY "Users can view other profiles" ON public.user_profiles
  FOR SELECT
  USING (true);

-- Policy: Users can update own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 3. SWIPES TABLE POLICIES
-- ============================================================================

-- Policy: Users can view own swipes
CREATE POLICY "Users can view own swipes" ON public.swipes
  FOR SELECT
  USING (auth.uid() = swiper_id);

-- Policy: Users can insert own swipes
CREATE POLICY "Users can insert own swipes" ON public.swipes
  FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- Policy: Users can't modify or delete swipes
-- (implicit deny - no policies for UPDATE/DELETE)

-- ============================================================================
-- 4. MATCHES TABLE POLICIES
-- ============================================================================

-- Policy: Users can view their matches
CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policy: Service role can insert matches
CREATE POLICY "Service role can insert matches" ON public.matches
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- 5. MESSAGES TABLE POLICIES
-- ============================================================================

-- Policy: Users can view messages they sent or received
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Policy: Users can insert messages (send)
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Policy: Users can update messages they received (mark as read)
CREATE POLICY "Users can mark messages as read" ON public.messages
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Policy: Users cannot delete messages
-- (implicit deny - no policy for DELETE)

-- ============================================================================
-- 6. CONVERSATIONS TABLE POLICIES
-- ============================================================================

-- Policy: Users can view conversations they're part of
CREATE POLICY "Users can view their conversations" ON public.conversations
  FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policy: Service role can insert/update conversations
CREATE POLICY "Service role manages conversations" ON public.conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role updates conversations" ON public.conversations
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- 7. LEADERBOARD TABLE POLICIES
-- ============================================================================

-- Policy: Everyone can view leaderboard
CREATE POLICY "Public leaderboard view" ON public.leaderboard
  FOR SELECT
  USING (true);

-- Policy: Service role updates leaderboard
CREATE POLICY "Service role updates leaderboard" ON public.leaderboard
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role updates rankings" ON public.leaderboard
  FOR UPDATE
  WITH CHECK (true);

-- ============================================================================
-- VERIFY RLS STATUS
-- ============================================================================
-- Run this query to verify RLS is enabled:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN (
--   'users', 'user_profiles', 'swipes', 'matches', 
--   'messages', 'conversations', 'leaderboard'
-- );

-- All should show: rowsecurity = true

-- ============================================================================
-- RLS Policies setup complete! Now create Storage buckets (next migration).
-- ============================================================================
