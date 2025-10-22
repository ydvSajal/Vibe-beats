# 🔄 Continuing Development - Backend Iteration Guide

This guide explains how to continue iterating on the backend after the initial setup.

---

## 🎯 Development Workflow

### 1. Local Development Cycle

```
Edit Code → Test Locally → Deploy → Verify Production
```

### 2. Backend File Locations

| File | Purpose | How to Modify |
|------|---------|---------------|
| `supabase/functions/server/index.ts` | Main backend logic | Edit and redeploy |
| `supabase/functions/server/kv_store.ts` | Database helper | Edit and redeploy |
| `supabase/migrations/001_create_kv_store.sql` | DB schema | Edit and push |
| `src/utils/api.ts` | Frontend client | Edit and refresh browser |
| `src/utils/supabase/info.tsx` | Config (keys, project ID) | Update when needed |

---

## 🚀 Deployment Steps

### Deploy Backend Changes

After editing `supabase/functions/server/index.ts` or `kv_store.ts`:

```bash
npx supabase functions deploy server
```

This:
1. ✅ Bundles TypeScript code
2. ✅ Uploads to Supabase
3. ✅ Restarts the Edge Function
4. ✅ Takes ~10-30 seconds

### Deploy Database Changes

After editing `supabase/migrations/001_create_kv_store.sql`:

```bash
npx supabase db push
```

**Note**: Be careful with migrations! Always test locally first.

### Test After Deployment

Wait 5-10 seconds for the function to restart, then:

```bash
# Test health
curl https://ezovnklmvqqfiojjvmel.supabase.co/functions/v1/make-server-2e8e40fd/health \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📝 Common Tasks

### Add a New Endpoint

#### 1. Edit `supabase/functions/server/index.ts`

Find the relevant section and add:

```typescript
// === NEW FEATURE ===

// Get all users (example)
app.get("/make-server-2e8e40fd/users", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const allUserIds = await kv.get('profiles:all') || [];
    const users = [];
    
    for (const userId of allUserIds) {
      const profile = await kv.get(`user:${userId}`);
      if (profile) users.push(profile);
    }
    
    return c.json({ users });
  } catch (error) {
    console.log('Get users error:', error);
    return c.json({ error: 'Failed to get users' }, 500);
  }
});
```

#### 2. Add to `src/utils/api.ts`

```typescript
export const api = {
  // ... existing code ...
  
  users: {
    getAll: async () => {
      return apiCall('/users');
    },
  },
};
```

#### 3. Deploy

```bash
npx supabase functions deploy server
```

#### 4. Test in Frontend

```typescript
import { api } from '@/utils/api';

const { users } = await api.users.getAll();
console.log(users);
```

---

### Add Database Fields

#### 1. Create Migration

```bash
npx supabase migration new add_user_bio
```

This creates `supabase/migrations/002_add_user_bio.sql`

#### 2. Edit Migration

```sql
-- Add bio field to users
-- Since we use JSONB KV store, we don't need schema changes
-- Just document the new field structure:

ALTER TABLE IF EXISTS kv_store_2e8e40fd ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update existing users to include bio in their profile objects
-- This is handled in the backend code, not SQL
```

#### 3. Update Backend Code

In `supabase/functions/server/index.ts`, update profile creation:

```typescript
const updatedProfile = {
  ...existingProfile,
  bio: bio || existingProfile.bio || '', // Add this
  // ... rest of code
};
```

#### 4. Deploy

```bash
npx supabase db push
npx supabase functions deploy server
```

---

### Fix a Bug

#### 1. Identify the Issue

Check logs:
```bash
npx supabase functions describe server
```

Or view in dashboard: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel

#### 2. Edit the Code

Make fix in `supabase/functions/server/index.ts`

#### 3. Deploy

```bash
npx supabase functions deploy server
```

#### 4. Verify

Test the endpoint immediately

---

## 🧪 Testing Your Changes

### Local Testing (Before Deployment)

```bash
# Option 1: Use curl with Bearer token
curl -X POST https://ezovnklmvqqfiojjvmel.supabase.co/functions/v1/make-server-2e8e40fd/auth/signup \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bennett.edu.in","name":"Test"}'

# Option 2: Use PowerShell
$headers = @{
  'Authorization' = 'Bearer <ANON_KEY>'
  'Content-Type' = 'application/json'
}
$body = @{email='test@bennett.edu.in'; name='Test'} | ConvertTo-Json
Invoke-RestMethod -Uri 'https://ezovnklmvqqfiojjvmel.supabase.co/functions/v1/make-server-2e8e40fd/auth/signup' -Method POST -Headers $headers -Body $body
```

### Production Testing

1. Deploy to production (via Supabase CLI)
2. Test with real data
3. Check logs for errors
4. Monitor function metrics

---

## 🐛 Debugging

### View Function Logs

```bash
# Real-time logs
npx supabase functions list
```

Then check dashboard: https://supabase.com/dashboard/project/ezovnklmvqqfiojjvmel/functions

### Check Database State

```bash
# Connect to Supabase dashboard SQL Editor
SELECT * FROM kv_store_2e8e40fd WHERE key LIKE 'user:%' LIMIT 5;
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid auth | Add Bearer token to headers |
| 400 Bad Request | Invalid email | Use @bennett.edu.in emails |
| 500 Internal Error | Backend crash | Check function logs |
| 404 Not Found | Wrong endpoint path | Verify full URL path |
| Timeout | Slow database | Optimize KV queries |

---

## 🔄 Update Patterns

### Pattern 1: Add New Auth Method

1. Add new endpoint in `index.ts`
2. Add to API client in `api.ts`
3. Use in component
4. Deploy & test

### Pattern 2: Modify Existing Endpoint

1. Edit endpoint logic in `index.ts`
2. Update API client if signature changed
3. Update components that call it
4. Deploy & test thoroughly

### Pattern 3: Add Database Tables

For complex data, you might need actual tables instead of KV:

```sql
CREATE TABLE IF NOT EXISTS custom_table (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Then access from backend:

```typescript
const { data, error } = await supabase
  .from('custom_table')
  .select('*')
  .eq('user_id', userId);
```

---

## 📦 Production Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] No console errors
- [ ] Database queries optimized
- [ ] Rate limiting configured
- [ ] Error messages user-friendly
- [ ] Security headers set
- [ ] Environment variables secure
- [ ] Backup strategy defined
- [ ] Monitoring alerts set up
- [ ] Documentation updated

---

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Hono Framework](https://hono.dev)
- [Deno Runtime](https://deno.land)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

## 💡 Tips for Iterating

1. **Test Early, Test Often** - Deploy small changes frequently
2. **Keep Backups** - Save old code before major changes
3. **Monitor Logs** - Always check function logs after deploy
4. **Version Your APIs** - Add versioning to avoid breaking changes
5. **Document Changes** - Keep BACKEND_SETUP.md updated
6. **Use Feature Flags** - Gradually roll out new features

---

## 🚀 Advanced Topics

### Scaling the Backend

Current setup (KV store) works for:
- ✅ < 100 users easily
- ✅ < 1,000 users with optimization
- ✅ < 10,000 users with proper indexing

For larger scale, migrate to:
- PostgreSQL tables with proper schema
- Firestore for real-time updates
- Elasticsearch for search

### Real-Time Updates

Add WebSocket support:

```typescript
import { serve } from "std/http/server.ts";
import { acceptWebSocket } from "std/ws/mod.ts";

// Add WebSocket handler for real-time messaging
```

### Caching Strategy

Implement Redis caching:

```typescript
// Cache frequently accessed profiles
const cache = new Map();
const getCachedProfile = (userId) => {
  if (cache.has(userId)) return cache.get(userId);
  // Fetch from DB...
};
```

---

## 📞 Need Help?

1. Check logs in Supabase dashboard
2. Review error messages carefully
3. Test endpoints individually
4. Ask in Supabase Discord
5. Check code comments in `index.ts`

---

## ✅ Checklist for Next Iteration

After reading this guide, you should be able to:

- [ ] Understand file structure
- [ ] Deploy changes via CLI
- [ ] Add new endpoints
- [ ] Debug issues
- [ ] Test before production
- [ ] Monitor backend health
- [ ] Scale when needed

---

**Continue building! Your backend is ready for evolution.** 🚀

Last Updated: October 22, 2025
