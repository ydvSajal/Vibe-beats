# Backend Setup — Vibe Beats

This guide explains how to set up and deploy the Supabase Edge Function backend for Vibe Beats.

## Prerequisites

- Supabase account and a project: https://supabase.com
- Supabase CLI installed: https://supabase.com/docs/guides/cli/getting-started
- Node.js and npm/pnpm installed

## Step 1: Create KV Store Table

The backend uses a Supabase table called `kv_store_2e8e40fd` to store application data (profiles, matches, messages, etc.).

### Option A: SQL Editor (via Supabase Dashboard)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → SQL Editor
2. Create a new query and run:

```sql
CREATE TABLE kv_store_2e8e40fd (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Optional: Add indexes for better query performance
CREATE INDEX idx_kv_prefix ON kv_store_2e8e40fd(key) WHERE key LIKE 'user:%';
CREATE INDEX idx_kv_conversations ON kv_store_2e8e40fd(key) WHERE key LIKE 'conversation:%';
```

### Option B: Using Supabase CLI

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## Step 2: Deploy Edge Function

The Edge Function code is located at `src/supabase/functions/server/`.

### Deploy via Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your project
supabase link --project-ref <your-project-ref>

# Deploy the function
supabase functions deploy server
```

### Verify Deployment

```bash
# Test the health endpoint
curl https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/health
```

Expected response:
```json
{
  "status": "ok"
}
```

## Step 3: Configure Environment Variables

Set the following environment variables in your Supabase Edge Function:

1. Go to Supabase Dashboard → Functions → `server` function → Settings
2. Add environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` | Your Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | ⚠️ Keep this secret! |
| `SUPABASE_ANON_KEY` | Your anon/public key | Safe to be public |

**⚠️ Important**: Never commit `SUPABASE_SERVICE_ROLE_KEY` to Git. Use environment variables in production.

## Step 4: Configure Client

The client needs to know your Supabase project details.

1. Update `src/utils/supabase/info.tsx`:

```typescript
export const projectId = "<your-project-ref>";  // e.g., "ezovnklmvqqfiojjvmel"
export const publicAnonKey = "<your-anon-key>";  // e.g., "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
```

Alternatively, use Vite environment variables:
- Create `.env.local`:
  ```
  VITE_SUPABASE_URL=https://<project-ref>.supabase.co
  VITE_SUPABASE_ANON_KEY=<your-anon-key>
  ```

## Testing Backend Endpoints

### Test Auth Endpoints

```bash
# Sign up
curl -X POST https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@bennett.edu.in","name":"Test User"}'

# Verify OTP (demo accepts any 6-digit code)
curl -X POST https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@bennett.edu.in","otp":"123456"}'
```

### Test Profile Endpoints

```bash
# Create/Update profile (requires Bearer token)
curl -X POST https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"Test User","photo":"https://...","songs":[],"category":"Indie"}'

# Get profile
curl https://<project-ref>.supabase.co/functions/v1/make-server-2e8e40fd/profile/<userId> \
  -H "Authorization: Bearer <token>"
```

## Backend Data Models

### User Profile
```typescript
{
  id: string;
  email: string;
  name: string;
  photo: string;
  songs: Array<{id, title, artist, artwork}>;
  stats: {
    rank: number;
    rightSwipes: number;
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Swipe Record
Stored as `swipe:<userId>:<targetUserId>` → "left" | "right"

### Match
Stored as `matches:<userId>` → Array of matched user IDs

### Conversation
```typescript
{
  id: string;  // Format: "<userId1>:<userId2>" (sorted)
  participants: [string, string];
  createdAt: string;
  lastMessage: Message | null;
}
```

### Message
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
}
```

## Troubleshooting

### Function Not Deploying
- Ensure Supabase CLI is updated: `npm install -g supabase@latest`
- Check logs: `supabase functions logs server`

### Auth Failing
- Verify SUPABASE_SERVICE_ROLE_KEY is set correctly
- Check email domain is @bennett.edu.in (or update validation in function)

### KV Store Errors
- Ensure table `kv_store_2e8e40fd` exists and is accessible
- Check service role key permissions on the table

### Cold Start Latency
- Edge Functions may have ~1-2s cold start time on first request
- Subsequent requests are faster

## Next Steps

- Set up CI/CD to auto-deploy Edge Function on commits
- Configure custom domain for function (if using custom domain)
- Implement real OTP flow with email provider (e.g., SendGrid)
- Add database migrations for scaling

## References

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Deno / Hono Framework](https://hono.dev/)
