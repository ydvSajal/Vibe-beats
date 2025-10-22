# 📊 Database Schema Setup Guide for Vibe Beats

## ✅ What You Need to Do

You have 4 migration files to run in this order:

1. **002_create_proper_schema.sql** - Create all tables
2. **003_create_rls_policies.sql** - Add security policies
3. **004_create_storage_buckets.sql** - Storage buckets & policies
4. Plus: Manual storage bucket creation in UI

---

## 🚀 Step-by-Step Instructions

### Step 1: Create the Database Schema

1. Go to **Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel

2. Click **SQL Editor** (left sidebar)

3. Click **New Query** (or New SQL file)

4. **Copy the entire content** of `supabase/migrations/002_create_proper_schema.sql`

5. Paste it into the SQL editor

6. Click **Run** (or press `Cmd/Ctrl + Enter`)

7. ✅ Should see: "Query executed successfully"

**What was created:**
- ✅ users table
- ✅ user_profiles table
- ✅ swipes table
- ✅ matches table
- ✅ messages table
- ✅ conversations table
- ✅ leaderboard table
- ✅ Indexes for performance
- ✅ Update triggers for updated_at columns

---

### Step 2: Create RLS (Row Level Security) Policies

1. Go to **SQL Editor** again

2. Click **New Query**

3. **Copy the entire content** of `supabase/migrations/003_create_rls_policies.sql`

4. Paste into the SQL editor

5. Click **Run**

6. ✅ Should see: "Query executed successfully"

**What was created:**
- ✅ RLS enabled on all tables
- ✅ User privacy policies
- ✅ Message security policies
- ✅ Leaderboard policies
- ✅ Profile access controls

---

### Step 3: Create Storage Buckets (UI)

1. Go to **Storage** (left sidebar)

2. Click **Buckets** tab

3. **Create Bucket 1: "avatars"**
   - Click **+ New Bucket**
   - Name: `avatars`
   - Toggle **Public bucket** (ON)
   - Click **Create bucket**
   - Size limit: 5 MB

4. **Create Bucket 2: "profile-pictures"**
   - Click **+ New Bucket**
   - Name: `profile-pictures`
   - Toggle **Public bucket** (ON)
   - Click **Create bucket**
   - Size limit: 10 MB

5. **Create Bucket 3: "cover-photos"**
   - Click **+ New Bucket**
   - Name: `cover-photos`
   - Toggle **Public bucket** (ON)
   - Click **Create bucket**
   - Size limit: 10 MB

6. ✅ All buckets created

---

### Step 4: Create Storage RLS Policies

1. Go to **SQL Editor** again

2. Click **New Query**

3. **Copy the entire content** of `supabase/migrations/004_create_storage_buckets.sql`

4. Paste into the SQL editor

5. Click **Run**

6. ✅ Should see: "Query executed successfully"

**What was created:**
- ✅ Avatar bucket policies
- ✅ Profile picture policies
- ✅ Cover photo policies
- ✅ User folder isolation

---

## 📋 Verification Checklist

After completing all steps, verify everything:

### Check 1: Tables Exist
In **SQL Editor**, run:
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**You should see:**
- conversations
- leaderboard
- matches
- messages
- swipes
- user_profiles
- users

### Check 2: RLS is Enabled
In **SQL Editor**, run:
```sql
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**All should show:** `rowsecurity = true` ✅

### Check 3: Buckets Exist
Go to **Storage → Buckets**

**You should see:**
- avatars ✅
- profile-pictures ✅
- cover-photos ✅

### Check 4: Test Insert User
In **SQL Editor**, run:
```sql
INSERT INTO public.users (email, name) 
VALUES ('test@bennett.edu.in', 'Test User')
RETURNING id, email, name, created_at;
```

**You should see:** A new user with UUID ✅

---

## 📊 Database Schema Overview

### Tables Created

```
users
├── id (UUID, PK)
├── email (TEXT, UNIQUE)
├── name (TEXT)
├── bio (TEXT)
├── avatar_url (TEXT)
├── age (INTEGER)
├── gender (TEXT)
├── location (TEXT)
├── musical_genre (TEXT)
├── favorite_artists (TEXT[])
├── is_active (BOOLEAN)
└── timestamps (created_at, updated_at)

user_profiles (1:1 with users)
├── user_id (FK → users)
├── profile_picture_url (TEXT)
├── music_taste (TEXT)
├── favorite_songs (TEXT[])
├── spotify_playlist_url (TEXT)
└── timestamps

swipes (user swipes on songs)
├── swiper_id (FK → users)
├── swiped_user_id (FK → users)
├── song_id (TEXT)
├── direction ('like' or 'skip')
└── created_at

matches (when users match on song)
├── user1_id (FK → users)
├── user2_id (FK → users)
├── song_id (TEXT)
├── match_score (INTEGER)
└── timestamps

messages (direct messages)
├── sender_id (FK → users)
├── recipient_id (FK → users)
├── content (TEXT)
├── is_read (BOOLEAN)
├── read_at (TIMESTAMP)
└── timestamps

conversations (thread metadata)
├── user1_id (FK → users)
├── user2_id (FK → users)
├── last_message_at (TIMESTAMP)
├── last_message (TEXT)
└── timestamps

leaderboard (rankings)
├── user_id (FK → users)
├── rank (INTEGER)
├── points (INTEGER)
├── matches_count (INTEGER)
├── week_points (INTEGER)
├── month_points (INTEGER)
└── timestamps
```

### Storage Buckets

```
avatars/
├── [user-uuid]/
│   └── avatar.jpg

profile-pictures/
├── [user-uuid]/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg

cover-photos/
├── [user-uuid]/
│   └── cover.jpg
```

---

## 🔐 Security Features

### Row Level Security (RLS)
- ✅ Users can only see their own private data
- ✅ Users can view other users' public profiles
- ✅ Messages are only visible to sender/recipient
- ✅ Swipes are private to the user
- ✅ Leaderboard is public

### Storage Security
- ✅ Files organized by user folder
- ✅ Users can only upload/delete their own files
- ✅ All avatars/pictures are publicly viewable
- ✅ File size limits enforced (5-10 MB)

---

## 🎯 Next Steps

### After Database Setup:
1. Update backend code to use new tables (instead of KV store)
2. Create API endpoints to interact with new tables
3. Test CRUD operations
4. Deploy updated backend

### File Upload Example:
```typescript
// Upload avatar
const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file, { upsert: true });

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.jpg`);
```

---

## ❓ Troubleshooting

### Error: "relation 'public.users' already exists"
- The table already exists. This is OK, skip this part or drop the table first.

### Error: "No rows returned"
- Make sure to use RETURNING clause to see results.

### Error: "permission denied"
- Make sure you're using Service Role Key or have proper RLS policies.

### Bucket creation failed
- Make sure bucket names are unique and lowercase.

---

## 📞 Quick Reference

**SQL Editor Location:** Dashboard → SQL Editor → New Query

**Storage Buckets Location:** Dashboard → Storage → Buckets

**Table Settings:** Dashboard → Editor → Tables → [table name]

**RLS Policies:** Dashboard → Authentication → Policies

---

## ✨ What You Now Have

✅ **8 Properly Designed Tables** with relationships and constraints  
✅ **Row Level Security** protecting user data  
✅ **3 Storage Buckets** for user media  
✅ **Performance Indexes** for fast queries  
✅ **Auto-updating Timestamps** on all records  
✅ **Production-Ready Schema** for Vibe Beats

---

**Status:** Ready to build! 🚀

