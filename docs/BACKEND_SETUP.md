# Backend Setup — Vibe Beats

Complete guide to set up and deploy the Supabase backend for Vibe Beats with minimal time and effort.

---

## 🚀 Quick Start (5 Minutes)

### Easiest Path: Use Supabase Dashboard (Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com → Create new project
   - Save your **project-ref** (e.g., `ezovnklmvqqfiojjvmel`)

2. **Create KV Store Table** (Copy & Paste)
   - Open [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → **SQL Editor**
   - Click **New Query**
   - Paste this SQL and click **Run**:

   ```sql
   CREATE TABLE kv_store_2e8e40fd (
     key TEXT NOT NULL PRIMARY KEY,
     value JSONB NOT NULL
   );

   CREATE INDEX idx_kv_prefix ON kv_store_2e8e40fd (key) WHERE key LIKE 'user:%';
   CREATE INDEX idx_kv_conversations ON kv_store_2e8e40fd (key) WHERE key LIKE 'conversation:%';
   ```

3. **Deploy Backend Function**
   - Open terminal in project directory
   - Run (one time setup):
     ```powershell
     npm install -g supabase
     supabase link --project-ref <your-project-ref>
     supabase functions deploy server
     ```

4. **Add Environment Variables**
   - Go to Supabase Dashboard → **Functions** → `server` → **Settings**
   - Click **Add Environment Variable** and add these 3:

   | Variable | Value |
   |----------|-------|
   | `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | (Find in Settings → API Keys → Service role) |
   | `SUPABASE_ANON_KEY` | (Find in Settings → API Keys → anon/public) |

5. **Configure Client**
   - Open `src/utils/supabase/info.tsx`
   - Update:
     ```typescript
     export const projectId = "<your-project-ref>";
     export const publicAnonKey = "<your-anon-key>";
     ```

6. **Done!** Test:
   ```powershell
   curl https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/health
   ```

---

## 📊 Backend Architecture

The backend uses a **single KV store table** (`kv_store_2e8e40fd`) with JSON values. This keeps setup minimal while supporting all app features.

### Data Structure

```
kv_store_2e8e40fd
├── user:<userId> → { id, email, name, photo, songs, stats, createdAt, updatedAt }
├── profiles:all → [userId1, userId2, ...]
├── swipe:<userId>:<targetId> → "left" | "right"
├── matches:<userId> → [userId1, userId2, ...]
├── conversation:<id> → { id, participants, createdAt, lastMessage }
├── messages:<conversationId> → [{ id, senderId, text, timestamp }, ...]
└── (leaderboard computed from all user profiles)
```

### Feature Coverage

| Feature | Storage | Implementation |
|---------|---------|-----------------|
| **Sign Up / Auth** | `user:<userId>` in KV | Supabase Auth + profile initialization |
| **Edit Profile** | `user:<userId>` in KV | POST `/profile` updates the JSON |
| **Store Images** | URL in `user.<photo>` field | Upload to external CDN (Firebase, Cloudinary) or Supabase Storage |
| **Swipe** | `swipe:<userId>:<targetId>` | POST `/matches/swipe` saves direction |
| **Get Potential Matches** | Query KV for all profiles + filter swiped | GET `/matches/potential` returns unswiped profiles |
| **View Matches** | `matches:<userId>` array | GET `/matches` returns matched profiles |
| **Messaging** | `conversation:<id>` + `messages:<conversationId>` | GET/POST `/messages/` endpoints |
| **Leaderboard** | All `user:<userId>` profiles | GET `/leaderboard` sorts by `rightSwipes` stat |


---

## 🗂 Endpoint Reference

All endpoints are at: `https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/`

### Authentication
- `POST /auth/signup` → Create account (email must be @bennett.edu.in)
- `POST /auth/signin` → Login (OTP flow)
- `POST /auth/verify-otp` → Verify 6-digit code
- `GET /auth/me` → Get current user session

### Profiles
- `POST /profile` → Create/update profile (name, photo, songs, category)
- `GET /profile/<userId>` → Get profile by ID

### Swipes & Matching
- `GET /matches/potential` → Get 10 potential matches to swipe on
- `POST /matches/swipe` → Swipe left/right on a profile
- `GET /matches` → Get all matched profiles

### Messaging
- `GET /messages/conversations` → List all conversations
- `GET /messages/<conversationId>` → Get message history
- `POST /messages/send` → Send a message

### Leaderboard
- `GET /leaderboard?category=All` → Get rankings by right swipes

---

## 🖼 Image Handling

The app stores **image URLs** in profiles, not the images themselves. For production:

### Option 1: Firebase Storage (Easiest)
```typescript
// Upload image to Firebase Storage
// Save URL in profile.photo field
// KV store will store the URL as a string
```

### Option 2: Supabase Storage (No Extra Setup)
```typescript
// Upload to Supabase Storage bucket
// Get public URL and save in profile.photo
```

### Option 3: External CDN (Cloudinary, ImgBB)
```typescript
// Upload to Cloudinary or similar
// Save public URL in KV
```

The backend doesn't care—it just stores whatever URL you put in `profile.photo`.

---

## 🔒 Security & Best Practices

1. **Never commit secrets** to Git
   - Service role key stays in Supabase environment variables only
   - Anon key can be public (it's in client code anyway)

2. **Row-Level Security (RLS)** (Optional for production)
   - Go to Supabase Dashboard → SQL Editor
   - Add RLS policies on `kv_store_2e8e40fd` to restrict who can access what keys

3. **Rate Limiting** (Consider for production)
   - Add Cloudflare or similar to rate-limit the Edge Function

---

## 🛠 Setup with Helper Script (Optional Faster)

If you have Node.js and npm installed:

```powershell
.\scripts\setup-backend.ps1 -ProjectRef <your-project-ref>
```

This automates:
- Installing Supabase CLI
- Linking your project
- Pushing database migrations

---

## 🧪 Test Your Setup

### 1. Health Check
```powershell
curl https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/health
```
Expected: `{"status":"ok"}`

### 2. Sign Up
```powershell
$body = @{
    email = "test@bennett.edu.in"
    name = "Test User"
} | ConvertTo-Json

curl -X POST https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/auth/signup `
  -H "Content-Type: application/json" `
  -Body $body
```
Expected: `{"success":true,"userId":"<uuid>"}`

### 3. Create Profile
```powershell
$body = @{
    name = "Test User"
    photo = "https://example.com/avatar.jpg"
    songs = @(@{id="1"; title="Song1"; artist="Artist1"; artwork="http://..."})
    category = "Indie"
} | ConvertTo-Json

curl -X POST https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/profile `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer <token>" `
  -Body $body
```

### 4. Get Leaderboard
```powershell
curl https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/leaderboard
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `Table kv_store_2e8e40fd does not exist` | Run the SQL in Supabase Dashboard (Step 2 of Quick Start) |
| `Unauthorized` error on endpoints | Add Bearer token: `-H "Authorization: Bearer <token>"` |
| Function not responding | Check Supabase Dashboard → Functions → `server` → Logs |
| Email validation fails | Ensure email is `@bennett.edu.in` or update validation in `src/supabase/functions/server/index.tsx` |
| Cold start takes 2+ seconds | Normal for first request; subsequent requests are faster |

---

## 📦 Project Structure

```
Vibe-beats/
├── src/
│   ├── supabase/
│   │   └── functions/
│   │       └── server/
│   │           ├── index.tsx          ← Main backend logic (Hono/Deno)
│   │           └── kv_store.tsx       ← KV helper functions
│   ├── utils/
│   │   ├── api.ts                     ← Client API calls
│   │   └── supabase/
│   │       └── info.tsx               ← Supabase config (projectId, keys)
│   └── components/
│       ├── ProfileCreationScreen.tsx  ← Profile creation
│       ├── ProfileScreen.tsx          ← View/edit profile
│       ├── SwipePoolScreen.tsx        ← Swipe functionality
│       ├── LeaderboardScreen.tsx      ← Leaderboard
│       ├── InboxScreen.tsx            ← Messaging
│       └── ...
├── supabase/
│   └── migrations/
│       └── 001_create_kv_store.sql    ← Database migration
├── scripts/
│   └── setup-backend.ps1              ← Setup helper
└── docs/
    └── BACKEND_SETUP.md               ← This file
```

---

## 🔄 Client Integration Examples

### Sign Up Flow
```typescript
// In ProfileCreationScreen.tsx
const response = await fetch(`${BASE_URL}/auth/signup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, name })
});
const { userId } = await response.json();
```

### Update Profile with Image
```typescript
// In EditProfileScreen.tsx
const imageUrl = await uploadToCloudinary(imageFile); // Your upload logic
const response = await fetch(`${BASE_URL}/profile`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  },
  body: JSON.stringify({
    name, photo: imageUrl, songs, category
  })
});
```

### Swipe
```typescript
// In SwipePoolScreen.tsx
const response = await fetch(`${BASE_URL}/matches/swipe`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  },
  body: JSON.stringify({ targetUserId, direction: 'right' })
});
```

### Get Leaderboard
```typescript
// In LeaderboardScreen.tsx
const response = await fetch(`${BASE_URL}/leaderboard?category=All`, {
  headers: { 'Authorization': `Bearer ${getAuthToken()}` }
});
const { leaderboard } = await response.json();
```

---

## 🚀 Deployment & CI/CD

### GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - 'src/supabase/functions/server/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
      - run: npm install -g supabase
      - run: |
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
          supabase functions deploy server
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

## 📝 Next Steps

1. ✅ Complete Quick Start (5 min)
2. ✅ Test endpoints with curl
3. ✅ Connect frontend to backend
4. ⬜ Set up GitHub Actions for auto-deploy
5. ⬜ Implement real OTP email flow (SendGrid)
6. ⬜ Add RLS policies for security
7. ⬜ Scale database as needed

---

## 📚 References

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Hono Framework](https://hono.dev)
- [Deno Runtime](https://deno.land)
