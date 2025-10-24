# Complete Supabase OTP Authentication Format

## Overview
This guide shows the proper way to handle OTP authentication with Supabase backend (Edge Functions).

---

## 1. SIGNUP FLOW (Send OTP Email)

### Frontend Request
```typescript
// api.ts
signup: async (email: string, name: string) => {
  return apiCall('/auth/entry', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'signup', 
      email, 
      name 
    }),
  });
}
```

### Backend Response (Edge Function)
```typescript
// supabase/functions/make-server-2e8e40fd/index.ts

app.post("/make-server-2e8e40fd/auth/entry", async (c) => {
  const { action, email, name } = await c.req.json();

  if (action === 'signup') {
    const supabase = getSupabaseClient();
    
    // Step 1: Create auth user (this sends OTP email automatically)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: crypto.randomUUID(), // Random password for magic link auth
      user_metadata: { name },
      email_confirm: false, // User must confirm via OTP
    });

    if (authError) {
      return c.json({ error: authError.message }, 400);
    }

    // Step 2: Create profile in public.users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({ 
        id: authData.user.id, 
        email, 
        name, 
        is_active: true 
      });

    if (insertError) {
      return c.json({ error: 'Failed to create user profile' }, 500);
    }

    // Response to frontend
    return c.json({ 
      success: true, 
      userId: authData.user.id,
      message: 'Check your email for OTP' 
    });
  }
});
```

### Frontend receives:
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Check your email for OTP"
}
```

---

## 2. VERIFY OTP FLOW

### Frontend Request
```typescript
// api.ts
verifyOTP: async (email: string, otp: string) => {
  return apiCall('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}
```

### Backend Response (Edge Function)
```typescript
app.post("/make-server-2e8e40fd/auth/verify-otp", async (c) => {
  try {
    const { email, otp } = await c.req.json();

    if (!email || !otp) {
      return c.json({ error: 'Email and OTP required' }, 400);
    }

    // Create anon client for OTP verification
    const clientForAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify OTP token
    const { data: sessionData, error: verifyError } = await clientForAuth.auth.verifyOtp({
      email,
      token: otp,
      type: 'email', // OTP type
    });

    if (verifyError || !sessionData.session) {
      console.log('OTP verification error:', verifyError);
      return c.json({ 
        error: 'Invalid or expired OTP',
        details: verifyError?.message
      }, 400);
    }

    // Get user from public.users table
    const supabase = getSupabaseClient();
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Return session token and user
    return c.json({
      success: true,
      user: user,
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_in: sessionData.session.expires_in,
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return c.json({ 
      error: 'Failed to verify OTP',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});
```

### Frontend receives:
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@bennett.edu.in",
    "name": "John Doe",
    "is_active": true
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "sbr_...",
    "expires_in": 3600
  }
}
```

---

## 3. LOGIN FLOW (Request OTP)

### Frontend Request
```typescript
// api.ts
login: async (email: string) => {
  return apiCall('/auth/entry', {
    method: 'POST',
    body: JSON.stringify({ action: 'login', email }),
  });
}
```

### Backend Response (Edge Function)
```typescript
if (action === 'login') {
  const clientForAuth = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  // Request OTP to be sent to email
  const { error: signInError } = await clientForAuth.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Don't create user during login
    }
  });

  if (signInError) {
    return c.json({ 
      error: signInError.message 
    }, 400);
  }

  // Verify user exists
  const supabase = getSupabaseClient();
  const { data: user } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('email', email)
    .single();

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({
    success: true,
    message: 'OTP sent to email',
    userId: user.id,
  });
}
```

---

## 4. COMPLETE FRONTEND FLOW (OnboardingScreen.tsx)

```typescript
// src/components/OnboardingScreen.tsx

const handleNameSubmit = async () => {
  if (!name.trim()) {
    toast.error('Please enter your name');
    return;
  }

  setLoading(true);
  try {
    // Step 1: Signup
    const response = await api.auth.signup(email, name);
    
    if (response.success) {
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('email', email); // Store for OTP verification
      toast.success('Account created! Check your email for OTP');
      setShowOTP(true);
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Signup failed');
  } finally {
    setLoading(false);
  }
};

const handleOTPComplete = async (otp: string) => {
  setLoading(true);
  try {
    // Step 2: Verify OTP
    const response = await api.auth.verifyOTP(email, otp);
    
    if (response.success) {
      // Store session tokens
      localStorage.setItem('authToken', response.session.access_token);
      localStorage.setItem('refreshToken', response.session.refresh_token);
      localStorage.setItem('userId', response.user.id);
      
      // Update auth context
      setAuthToken(response.session.access_token);
      
      toast.success('Email verified! 🎉');
      setTimeout(() => onComplete(), 500);
    }
  } catch (error) {
    toast.error('Invalid OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

---

## 5. SUPABASE DASHBOARD SETUP

### Required Configuration

**Step 1: Enable Email Provider**
- Go to: Authentication → Providers → Email
- Toggle ON the "Enable email provider"
- Choose delivery method:
  - Built-in email service (limited to 3 per hour in development)
  - Custom SMTP
  - SendGrid / Mailgun integration

**Step 2: Configure OTP Settings**
- Go to: Authentication → Providers → Email → OTP Settings
- Set OTP expiry (usually 60 minutes)
- Set OTP length (usually 6 digits)

**Step 3: Email Templates**
- Go to: Authentication → Email Templates
- Find: "Confirm signup" and "Verify OTP"
- Ensure both are enabled and have proper `{{ .ConfirmationURL }}` or `{{ .TokenHash }}`

**Step 4: Set Redirect URL**
- Go to: Authentication → URL Configuration
- Add your app URL: `http://localhost:5173` (dev) or production URL
- This is where Supabase redirects after email verification

---

## 6. KEY DIFFERENCES: OTP vs Magic Link

| Feature | OTP | Magic Link |
|---------|-----|-----------|
| User sees | 6-digit code | Email with link |
| Input | Copy/paste | Click link |
| Implementation | `verifyOtp()` | `verifyOtp()` with type |
| User Experience | Faster | More secure |

---

## 7. ERROR HANDLING CHECKLIST

```typescript
// Common OTP errors:
// 1. "Invalid or expired OTP" 
//    → User waited too long (usually 60min expiry)
//    → User entered wrong code
//    → Solution: Request new OTP

// 2. "Email not found in auth system"
//    → User hasn't signed up yet
//    → Solution: Go to signup flow

// 3. "Too many requests"
//    → Rate limiting by Supabase
//    → Solution: Wait a few minutes

// 4. "Email configuration not set up"
//    → Supabase project doesn't have email provider
//    → Solution: Configure in Dashboard → Authentication → Email
```

---

## 8. TESTING OTP LOCALLY

### Option 1: Use Supabase CLI
```bash
# Watch function logs
supabase functions logs make-server-2e8e40fd --follow

# Test signup
curl -X POST http://localhost:54321/functions/v1/make-server-2e8e40fd/auth/entry \
  -H "Content-Type: application/json" \
  -d '{"action":"signup","email":"test@bennett.edu.in","name":"Test User"}'
```

### Option 2: Use Console in Frontend
```typescript
// Open DevTools Console
const result = await api.auth.signup('test@bennett.edu.in', 'Test User');
console.log(result);
```

### Option 3: Check Email Inbox
- During development with built-in email, check your console logs
- OTP might be printed in logs: `OTP token: 123456`

---

## SUMMARY

✅ **Signup** → Creates auth user → Sends OTP email  
✅ **OTP Verification** → Verifies token → Returns session  
✅ **Login** → Sends OTP to email → User verifies  
✅ **Session Management** → Store access/refresh tokens  

This is the complete production-ready OTP format for Supabase!
