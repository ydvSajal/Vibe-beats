# Vibe Beats Backend Structure & Setup Summary

## 🎯 Your Setup Options (Pick One)

### **Option 1: Fastest (Recommended) — 5 minutes**
Dashboard SQL Editor + CLI Deploy
1. Copy-paste SQL in Supabase Dashboard
2. Run 3 CLI commands
3. Add 3 environment variables
✅ **Best for:** Most people, easiest, no local setup

### **Option 2: One-Command Helper — 5 minutes**
```powershell
.\scripts\setup-backend.ps1 -ProjectRef <ref>
```
✅ **Best for:** Automation lovers, keeps config consistent

### **Option 3: Full Control — 10 minutes**
Manual Supabase CLI with migrations
- Use `supabase` CLI locally
- Manage migrations in version control
✅ **Best for:** Production, CI/CD setup

---

## 📋 Complete Backend Structure

```
VIBE BEATS APP
│
├─ Frontend (React + Vite)
│  └─ Components
│     ├─ ProfileCreationScreen     ← User signs up, creates profile
│     ├─ EditProfileScreen         ← Edit profile + upload photo
│     ├─ SwipePoolScreen           ← Swipe on other users' profiles
│     ├─ LeaderboardScreen         ← See rankings by right swipes
│     └─ InboxScreen               ← Message matched users
│
├─ Backend (Supabase)
│  │
│  ├─ Edge Function (Deno + Hono)
│  │  └─ Server: src/supabase/functions/server/
│  │     ├─ index.tsx              ← All endpoints & business logic
│  │     └─ kv_store.tsx           ← Database helper functions
│  │
│  ├─ Database (PostgreSQL + KV Store)
│  │  └─ kv_store_2e8e40fd
│  │     ├─ user:UUID              ← Profile data
│  │     ├─ profiles:all           ← List of all user IDs
│  │     ├─ swipe:id1:id2          ← Swipe history
│  │     ├─ matches:id             ← Matched user list
│  │     ├─ conversation:id1:id2   ← Conversation metadata
│  │     └─ messages:convId        ← Message history
│  │
│  └─ Auth (Supabase Auth)
│     ├─ @bennett.edu.in validation
│     └─ Token generation
│
└─ Client Config
   └─ src/utils/supabase/info.tsx
      ├─ projectId
      └─ publicAnonKey
```

---

## 🔄 How Data Flows

### Scenario 1: User Creates Profile

```
Frontend (ProfileCreationScreen.tsx)
   ↓
   Upload image to CDN (Firebase/Cloudinary)
   ↓
   POST /profile with name, photo URL, songs
   ↓
Edge Function (server/index.tsx)
   ↓
   Update user:UUID in KV store
   ↓
Database (kv_store_2e8e40fd)
   ↓
   Frontend shows "Profile saved ✓"
```

### Scenario 2: User Swipes

```
Frontend (SwipePoolScreen.tsx)
   ↓
   GET /matches/potential
   ↓
Edge Function
   ↓
   Find all profiles, filter out swiped ones
   ↓
   Return unswiped profiles
   ↓
User swipes → POST /matches/swipe with targetUserId & direction
   ↓
Edge Function checks if reciprocal swipe = "right"
   ↓
If match: Create conversation, add to both users' matches
   ↓
Update KV store: matches:userId, conversation:id1:id2
   ↓
Frontend shows "It's a match! 💬"
```

### Scenario 3: Get Leaderboard

```
Frontend (LeaderboardScreen.tsx)
   ↓
   GET /leaderboard?category=All
   ↓
Edge Function
   ↓
   Fetch all user:UUID from KV store
   ↓
   Sort by rightSwipes stat
   ↓
   Add ranks (1st, 2nd, 3rd...)
   ↓
Frontend displays sorted list
```

---

## 📊 Data Models

### User Profile (in KV)
```json
{
  "key": "user:550e8400-e29b-41d4-a716-446655440000",
  "value": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@bennett.edu.in",
    "name": "John Doe",
    "photo": "https://cdn.example.com/john.jpg",
    "songs": [
      {
        "id": "1",
        "title": "Midnight",
        "artist": "The Weeknd",
        "artwork": "https://api.spotify.com/artwork1.jpg"
      }
    ],
    "stats": {
      "rank": 5,
      "rightSwipes": 23,
      "category": "Pop"
    },
    "createdAt": "2025-10-22T10:30:00Z",
    "updatedAt": "2025-10-22T14:45:00Z"
  }
}
```

### Swipe Record (in KV)
```json
{
  "key": "swipe:user_a_id:user_b_id",
  "value": "right"  // or "left"
}
```

### Match (in KV)
```json
{
  "key": "matches:user_a_id",
  "value": ["user_b_id", "user_c_id", "user_d_id"]
}
```

### Conversation (in KV)
```json
{
  "key": "conversation:user_a_id:user_b_id",
  "value": {
    "id": "user_a_id:user_b_id",
    "participants": ["user_a_id", "user_b_id"],
    "createdAt": "2025-10-22T12:00:00Z",
    "lastMessage": {
      "id": "msg_123",
      "senderId": "user_a_id",
      "text": "Hey! 👋",
      "timestamp": "2025-10-22T13:30:00Z"
    }
  }
}
```

### Messages (in KV)
```json
{
  "key": "messages:user_a_id:user_b_id",
  "value": [
    {
      "id": "msg_1",
      "conversationId": "user_a_id:user_b_id",
      "senderId": "user_a_id",
      "text": "Hey! 👋",
      "timestamp": "2025-10-22T13:30:00Z"
    },
    {
      "id": "msg_2",
      "conversationId": "user_a_id:user_b_id",
      "senderId": "user_b_id",
      "text": "Hi there! 😊",
      "timestamp": "2025-10-22T13:31:00Z"
    }
  ]
}
```

---

## 🛠 Setup Checklist

- [ ] Create Supabase project (get project-ref)
- [ ] Create KV store table (SQL in Dashboard)
- [ ] Deploy Edge Function (Supabase CLI)
- [ ] Add 3 environment variables (Function Settings)
- [ ] Update client config (src/utils/supabase/info.tsx)
- [ ] Test health endpoint (curl)
- [ ] Test signup endpoint (curl)
- [ ] Connect frontend (update API base URL if needed)
- [ ] Test profile creation
- [ ] Test swipe functionality
- [ ] Test leaderboard
- [ ] Test messaging

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `docs/BACKEND_SETUP.md` | **Main guide** — Detailed setup, architecture, troubleshooting |
| `docs/QUICK_START.md` | **Quick ref** — 5-min setup, all endpoints, troubleshooting |
| `docs/SETUP_SCRIPT.md` | **Automation** — How to use the helper script |
| This file | **Full overview** — Visual architecture & data flow |
| `supabase/migrations/001_create_kv_store.sql` | **Database** — SQL to create KV store table |
| `scripts/setup-backend.ps1` | **Script** — Automated setup helper |

---

## 🚀 Next After Setup

1. **Test all endpoints** with curl (see QUICK_START.md)
2. **Connect frontend** by updating API base URL in `src/utils/api.ts`
3. **Test user flows:**
   - Sign up → Create profile → Swipe → Match → Message
   - Check leaderboard
   - Edit profile
4. **Set up GitHub Actions** for auto-deployment (optional, see BACKEND_SETUP.md)
5. **Add security** with RLS policies (production, see BACKEND_SETUP.md)

---

## ❓ FAQ

**Q: Where are my images stored?**
A: You upload them to a CDN or Supabase Storage, store the URL in `profile.photo`. KV only stores the URL string.

**Q: How do swipes create matches?**
A: When User A swipes right on User B, it creates `swipe:A:B="right"`. If User B also swiped right on A earlier, both are added to each other's `matches:` list.

**Q: How is the leaderboard calculated?**
A: The `/leaderboard` endpoint fetches all `user:` profiles from KV, sorts by `rightSwipes` stat, and returns ranked list.

**Q: Can I scale this?**
A: Yes! The KV store works for 1000s of users. For millions, consider: Supabase Row-Level Security, PostgreSQL tables, and read replicas.

**Q: How do I store images better?**
A: Use Firebase Storage, Cloudinary, or Supabase Storage for images. Save URLs in KV. This keeps the KV store small and fast.

---

Created: October 2025
Last Updated: October 22, 2025
