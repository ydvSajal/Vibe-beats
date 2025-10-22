# Step-by-Step Setup Guide with Visual Flow

## 🎬 5-Minute Setup (Visual Walkthrough)

### Step 1: Create Supabase Project (1 min)

```
1. Go to https://supabase.com
2. Click "Create new project"
3. Choose organization and database password
4. Wait for project to initialize
5. Copy your PROJECT_REF from URL: https://supabase.com/dashboard/project/[PROJECT_REF]
   Example: ezovnklmvqqfiojjvmel
```

### Step 2: Create KV Store Table (30 sec)

```
Dashboard → SQL Editor → New Query
↓
Paste this SQL:
├─ CREATE TABLE kv_store_2e8e40fd (...)
├─ CREATE INDEX idx_kv_prefix (...)
└─ CREATE INDEX idx_kv_conversations (...)
↓
Click "Run" button
↓
✅ Table created! Check "Tables" section confirms it exists
```

### Step 3: Deploy Edge Function (2 min)

```
Open PowerShell → Navigate to project directory
↓
$ npm install -g supabase
  ↳ (Installs Supabase CLI globally)
↓
$ supabase link --project-ref YOUR_PROJECT_REF
  ↳ (Links your machine to your Supabase project)
  ↳ Paste your access token when prompted
↓
$ supabase functions deploy server
  ↳ (Deploys the Hono backend to Edge Functions)
  ↳ Takes ~30 seconds
↓
✅ Done! Function deployed to:
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-2e8e40fd/
```

### Step 4: Add Environment Variables (1 min)

```
Supabase Dashboard → Functions → server → Settings
↓
Click "Add Environment Variable"
├─ SUPABASE_URL = https://YOUR_PROJECT_REF.supabase.co
├─ SUPABASE_SERVICE_ROLE_KEY = (from Settings → API Keys → Service role)
└─ SUPABASE_ANON_KEY = (from Settings → API Keys → anon/public)
↓
✅ All 3 added!
```

### Step 5: Configure Client (1 min)

```
Open: src/utils/supabase/info.tsx
↓
Replace:
├─ projectId = "YOUR_PROJECT_REF"
└─ publicAnonKey = "YOUR_ANON_KEY"
↓
Save file
↓
✅ Done!
```

### Step 6: Test (30 sec)

```
PowerShell:
$ curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-2e8e40fd/health

Expected response:
{"status":"ok"}

✅ Everything working!
```

---

## 🗂 File Changes You'll Make

### 1. `src/utils/supabase/info.tsx`
```typescript
// BEFORE:
export const projectId = "YOUR_PROJECT_ID";
export const publicAnonKey = "YOUR_ANON_KEY";

// AFTER (paste your actual values):
export const projectId = "ezovnklmvqqfiojjvmel";
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### 2. That's it! 👆
All backend code already exists and is ready to deploy.

---

## 🧪 Test Each Feature (After Setup)

### Test 1: Health Check
```powershell
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-2e8e40fd/health
```
**Expected:** `{"status":"ok"}`

### Test 2: Sign Up
```powershell
$body = @{
    email = "test@bennett.edu.in"
    name = "Test User"
} | ConvertTo-Json

curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-2e8e40fd/auth/signup `
  -H "Content-Type: application/json" `
  -Body $body
```
**Expected:** `{"success":true,"userId":"<uuid>"}`

### Test 3: Get Leaderboard
```powershell
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/make-server-2e8e40fd/leaderboard
```
**Expected:** `{"leaderboard":[...]}`

---

## 🎯 Common Questions During Setup

**Q: Where do I find PROJECT_REF?**
A: 
- Supabase Dashboard URL: `dashboard.supabase.com/project/[THIS-IS-IT]`
- Or: Settings → General → Project Reference

**Q: Where do I find API keys?**
A:
- Supabase Dashboard → Settings → API
- Copy: Service role key and Anon/public key

**Q: Do I need to edit any other files?**
A: No! Only `src/utils/supabase/info.tsx` and your Supabase dashboard.

**Q: Can I use the helper script instead?**
A: Yes! Run: `.\scripts\setup-backend.ps1 -ProjectRef YOUR_PROJECT_REF`
   (See SETUP_SCRIPT.md for details)

**Q: What if the function deploy fails?**
A: 
- Check: `supabase functions logs server` for errors
- Ensure: `src/supabase/functions/server/` directory exists
- Try again: `supabase functions deploy server`

---

## 📊 What Gets Created

After setup, you have:

```
In Supabase Cloud:
├─ PostgreSQL Database
│  └─ kv_store_2e8e40fd table (with 2 indexes)
├─ Edge Function: "server"
│  └─ Handles: Auth, Profiles, Swipes, Matches, Messages, Leaderboard
└─ Auth setup
   └─ @bennett.edu.in validation

In Your Codebase:
├─ src/supabase/functions/server/ (Deno + Hono backend)
├─ src/utils/api.ts (client API wrapper)
├─ src/utils/supabase/info.tsx (your config)
└─ supabase/migrations/ (database migrations)
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `curl https://YOUR_REF.supabase.co/.../health` returns `{"status":"ok"}`
- [ ] Supabase Dashboard shows `kv_store_2e8e40fd` table
- [ ] Supabase Dashboard → Functions shows `server` deployed
- [ ] `src/utils/supabase/info.tsx` has your projectId & key
- [ ] You can sign up (test with curl command above)

---

## 🚀 Next: Connect Your Frontend

Once setup verified, connect frontend:

1. **Go to ProfileCreationScreen.tsx**
   - It imports `BASE_URL` from `src/utils/api.ts`
   - api.ts already uses your Supabase config
   - Should work automatically! ✅

2. **Go to SwipePoolScreen.tsx**
   - Uses `POST /matches/swipe` endpoint
   - Should work automatically! ✅

3. **Go to LeaderboardScreen.tsx**
   - Uses `GET /leaderboard` endpoint
   - Should work automatically! ✅

4. **Test entire flow:**
   - Sign up
   - Create profile with image
   - Swipe on profiles
   - Get matches
   - Send messages
   - View leaderboard

---

## 📞 If Anything Goes Wrong

| Error | Solution |
|-------|----------|
| "Table not found" | Run SQL in Supabase Dashboard (Step 2) |
| "Function not responding" | Check function was deployed (`supabase functions deploy server`) |
| "Unauthorized 401" | Add `-H "Authorization: Bearer <TOKEN>"` to curl commands |
| "CORS error" | CORS is already enabled in backend ✓ |
| "Cold start slow" | Normal (1-2s first request, then fast) |

---

## 📚 Full Documentation

- **BACKEND_SETUP.md** — Detailed architecture & advanced setup
- **QUICK_START.md** — Quick reference for commands & endpoints
- **ARCHITECTURE.md** — Visual data flow & structure
- **SETUP_SCRIPT.md** — Automation script guide

---

**Total Time to Complete: 5-10 minutes ⏱️**

**You're Done After Step 6!** 🎉

