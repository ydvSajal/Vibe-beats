# OTP Implementation - Deployment Guide

## What Was Changed

### Backend Updates (index.ts)
✅ **Signup Flow**:
- Sends OTP email using `signInWithOtp()` with `shouldCreateUser: true`
- Supabase creates auth user automatically
- Creates profile in `public.users` table
- Returns error if email not configured in Supabase

✅ **OTP Verification**:
- Uses `verifyOtp()` with `type: 'email'`
- Validates OTP token
- Returns session tokens (access_token, refresh_token)
- Marks user as `email_confirmed: true`

---

## Deployment Steps

### Step 1: Deploy Backend Function
```powershell
cd c:\Users\sajal\OneDrive\Documents\GitHub\Vibe-beats
supabase functions deploy make-server-2e8e40fd
```

### Step 2: Configure Supabase Email Provider
Go to: **https://app.supabase.com** → Your Project

1. **Authentication → Providers → Email**
   - Toggle ON "Enable email provider"
   - Choose method:
     - ✅ Built-in (testing)
     - ✅ Custom SMTP
     - ✅ SendGrid/Mailgun

2. **Authentication → Email Templates**
   - Find "Confirm signup" template
   - Ensure it's **enabled** and contains `{{ .ConfirmationURL }}`
   - Find "Verify OTP" template
   - Ensure it contains `{{ .TokenHash }}`

3. **Authentication → URL Configuration**
   - Add: `http://localhost:5173` (dev)
   - Add: your production domain (prod)

---

## Frontend Usage (No Changes Needed)

Your `api.ts` already has the correct calls:

```typescript
// Signup - sends OTP email
api.auth.signup('user@bennett.edu.in', 'John Doe')

// Verify OTP - validates 6-digit code
api.auth.verifyOTP('user@bennett.edu.in', '123456')
```

---

## Testing Checklist

- [ ] Deploy function: `supabase functions deploy make-server-2e8e40fd`
- [ ] Email provider configured in Supabase dashboard
- [ ] Test signup → OTP email arrives in inbox
- [ ] Test OTP verification → Session tokens received
- [ ] Check function logs: `supabase functions logs make-server-2e8e40fd --follow`

---

## Key Endpoints Format

### SIGNUP (Sends OTP)
```
POST /auth/entry
{
  "action": "signup",
  "email": "user@bennett.edu.in",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "userId": "uuid",
  "message": "OTP sent to your email"
}
```

### VERIFY OTP
```
POST /auth/verify-otp
{
  "email": "user@bennett.edu.in",
  "otp": "123456"
}

Response:
{
  "success": true,
  "user": { ... },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

### LOGIN (Requests OTP)
```
POST /auth/entry
{
  "action": "login",
  "email": "user@bennett.edu.in"
}

Response:
{
  "success": true,
  "message": "OTP sent to email",
  "userId": "uuid"
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "OTP email not received" | Check Supabase → Email Templates enabled |
| "Email provider not configured" | Go to Auth → Providers → Email and enable |
| "Invalid or expired OTP" | User waited >60 min or wrong code |
| "Too many requests" | Rate limit - wait a few minutes |
| "User not found after OTP" | Check if `public.users` insert succeeded |

---

## Database Schema (users table)

Make sure your `public.users` table has these columns:

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT true,
  email_confirmed BOOLEAN DEFAULT false,
  bio TEXT,
  avatar_url TEXT,
  age INTEGER,
  gender VARCHAR,
  location VARCHAR,
  musical_genre VARCHAR,
  favorite_artists TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Ready to Deploy! 🚀

Once you deploy and configure Supabase email, OTP authentication will be fully functional.
