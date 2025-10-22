# Backend Quick Reference — Vibe Beats

**Total Setup Time: ~5-10 minutes**

## The Absolute Easiest Path

### 1. Copy-Paste SQL (30 seconds)
- Go to Supabase Dashboard → SQL Editor
- Paste the SQL from `docs/BACKEND_SETUP.md` Step 2
- Click Run

### 2. Deploy Function (2 minutes)
```powershell
npm install -g supabase
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy server
```

### 3. Add 3 Environment Variables (2 minutes)
- Supabase Dashboard → Functions → server → Settings
- Add these 3 keys from your API Keys

### 4. Update Client Config (1 minute)
- Edit `src/utils/supabase/info.tsx`
- Change projectId and publicAnonKey

### 5. Done! ✅
```powershell
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-2e8e40fd/health
```

---

## What Gets Created

| Thing | What It Stores |
|------|-----------------|
| **kv_store_2e8e40fd table** | All app data (users, profiles, messages, swipes, matches) |
| **Edge Function** | Backend logic for signup, profiles, swipes, messaging, leaderboard |
| **Indexes** | Speed up queries for users and conversations |

---

## How Features Work

### Profiles & Images
```
Frontend uploads image → Gets URL → Saves URL in profile.photo
Backend stores profile JSON in KV with the photo URL
```

### Swipes & Matches
```
User A swipes right on User B → Stored as swipe:userId_A:userId_B = "right"
If User B also swiped right → Both added to each other's matches array
```

### Leaderboard
```
GET /leaderboard → Fetches all user profiles → Sorts by rightSwipes stat
```

### Messaging
```
When match happens → conversation:id created
User sends message → Added to messages:conversationId array
```

---

## All Endpoints

**Base URL:** `https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd`

```
POST   /auth/signup                    Sign up
POST   /auth/signin                    Login
POST   /auth/verify-otp                Verify OTP
GET    /auth/me                        Get current user

POST   /profile                        Create/update profile
GET    /profile/<userId>               Get profile

GET    /matches/potential              Get profiles to swipe
POST   /matches/swipe                  Swipe left/right
GET    /matches                        Get all matches

GET    /messages/conversations         List conversations
GET    /messages/<conversationId>      Get messages
POST   /messages/send                  Send message

GET    /leaderboard?category=All       Get leaderboard
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Table doesn't exist | Run the SQL in Supabase Dashboard |
| 401 Unauthorized | Add Bearer token header |
| Function not found | Check you deployed with `supabase functions deploy server` |
| Cold start slow | Normal (1-2s first time, then fast) |

---

## File Locations

- Backend code: `src/supabase/functions/server/`
- SQL migration: `supabase/migrations/001_create_kv_store.sql`
- Setup script: `scripts/setup-backend.ps1`
- Client config: `src/utils/supabase/info.tsx`
- Main docs: `docs/BACKEND_SETUP.md`

---

## Full Docs

See `docs/BACKEND_SETUP.md` for detailed setup, testing, security, and deployment info.
