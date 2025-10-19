# 🚀 Vibe Beats - Quick Deploy Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Generate PWA Icons
Open `public/generate-icons.html` in your browser and download the icon pack, or run:
```powershell
.\generate-pwa-icons.ps1
```

### Step 2: Commit Changes
```bash
git add .
git commit -m "Add backend setup and PWA improvements"
git push origin main
```

### Step 3: Deploy to Vercel
```bash
vercel --prod
```

---

## 📋 Current Status

### ✅ **Fixed:**
- [x] PWA manifest configured
- [x] Service worker improved
- [x] Meta tags for iOS/Android
- [x] Build configuration
- [x] Vercel deployment settings

### ⚠️ **Needs Attention:**
- [ ] **PWA Icons** - Generate and add to `public/icons/`
- [ ] **Backend Database** - Set up Supabase tables
- [ ] **File Storage** - Configure Supabase Storage buckets
- [ ] **Environment Variables** - Add to Vercel

---

## 🗄️ Backend Setup (30 Minutes)

### 1. Supabase Database Setup

Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/sql) and run these scripts:

#### Create Tables:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@bennett.edu.in'),
  name TEXT NOT NULL,
  photo TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs table
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  artwork TEXT,
  is_locked BOOLEAN DEFAULT false,
  is_editable BOOLEAN DEFAULT true,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swipes table
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('left', 'right')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_songs_user_id ON songs(user_id);
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_target_user_id ON swipes(target_user_id);
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
```

#### Enable Row Level Security:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Public profiles viewable" ON users FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for songs table
CREATE POLICY "Songs viewable by all" ON songs FOR SELECT USING (true);
CREATE POLICY "Users manage own songs" ON songs FOR ALL USING (auth.uid() = user_id);

-- Policies for swipes table
CREATE POLICY "Users view own swipes" ON swipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create swipes" ON swipes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for matches table
CREATE POLICY "Users view own matches" ON matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies for messages table
CREATE POLICY "Users view messages in own matches" ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE id = messages.match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

CREATE POLICY "Users send messages in own matches" ON messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);
```

### 2. Supabase Storage Setup

Go to [Storage](https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/storage/buckets):

1. Create bucket: `profile-photos` (Public)
2. Add policies:

```sql
-- View policy
CREATE POLICY "Public profile photos" ON storage.objects 
FOR SELECT USING (bucket_id = 'profile-photos');

-- Upload policy
CREATE POLICY "Users upload own photos" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Deploy Edge Functions

Your Edge Function is already in `src/supabase/functions/server/`. To deploy:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref ezovnklmvqqfiojjvmel

# Deploy function
supabase functions deploy make-server
```

---

## 🔐 Environment Variables

Add these to Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://ezovnklmvqqfiojjvmel.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6b3Zua2xtdnFxZmlvamp2bWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMzNTYsImV4cCI6MjA3NTczOTM1Nn0._gT4PmAjO3mPOnLA9qKxkHhTV3rEwBxiHDI13FzQv4M
```

---

## ✅ Testing Checklist

After deployment, test:

### PWA:
- [ ] Visit site on mobile Chrome/Safari
- [ ] Check for "Install App" banner
- [ ] Install and open as standalone app
- [ ] Test offline mode (enable airplane mode)
- [ ] Check icons display correctly

### Backend:
- [ ] Sign up with @bennett.edu.in email
- [ ] Receive and verify OTP
- [ ] Create profile (test if photo upload works after implementing)
- [ ] Browse swipe pool
- [ ] Swipe right and get match
- [ ] Send message to match
- [ ] View leaderboard

---

## 🐛 Troubleshooting

### PWA Not Installing:
1. Check manifest at: `https://your-site.vercel.app/manifest.json`
2. Verify all icons exist
3. Run Lighthouse audit in Chrome DevTools
4. Check service worker in DevTools → Application → Service Workers

### Backend Errors:
1. Check Supabase Edge Function logs
2. Verify database tables exist
3. Check RLS policies
4. Test API endpoints with Postman

---

## 📚 Full Documentation

See `BACKEND_SETUP.md` for comprehensive backend setup guide with:
- Detailed database schema
- File upload implementation
- Advanced PWA features
- Security best practices

---

## 🎯 Next Steps

1. **Immediate:**
   - [ ] Generate PWA icons
   - [ ] Set up Supabase database tables
   - [ ] Deploy to Vercel
   - [ ] Test on mobile

2. **Phase 2:**
   - [ ] Implement file uploads
   - [ ] Add Spotify integration
   - [ ] Enable push notifications
   - [ ] Add real-time messaging

---

**Need Help?**
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- PWA: https://web.dev/progressive-web-apps/

**Ready to deploy? Run:** `vercel --prod` 🚀
