# Quick Start - 3 Steps to Get OTP Working

## Step 1: Clear Test User (2 minutes)
Go to: https://app.supabase.com → Your Project → **Authentication → Users**
- Find: `S24CSEU1704@bennett.edu.in`
- Click: **⋯** (three dots) → **Delete User**
- Confirm deletion

## Step 2: Enable Email (3 minutes)
1. **Authentication → Providers → Email**
   - Toggle ON: "Enable email provider"
   
2. **Authentication → Email Templates → Confirm signup**
   - Click Edit
   - Replace with this:
   ```html
   <h2>Your Vibe Beats verification code</h2>
   <p>Welcome! Your OTP is:</p>
   <h1 style="font-size: 32px; font-weight: bold; color: #FF1744; letter-spacing: 5px;">
   {{ .Token }}
   </h1>
   <p>This code expires in 60 minutes.</p>
   ```
   - Save

3. **Authentication → URL Configuration**
   - Add: `http://localhost:5173`
   - Save

## Step 3: Deploy Backend (1 minute)
```powershell
cd c:\Users\sajal\OneDrive\Documents\GitHub\Vibe-beats
supabase functions deploy make-server-2e8e40fd
```

---

## Test It! (2 minutes)

```powershell
# Start dev server
npm run dev
```

1. Open: http://localhost:5173
2. Click: "Get Started" → "Register"
3. Enter: `yourname@bennett.edu.in`
4. Enter your name
5. Click: "Send Verification Code"
6. Check email for 6-digit OTP
7. Enter OTP
8. Complete onboarding (photo, bio, genres)
9. Done! 🎉

---

## If OTP Email Doesn't Arrive

### Quick Fix #1: Check Logs
```powershell
supabase functions logs make-server-2e8e40fd --follow
```
Look for: "OTP send error" or "email provider not configured"

### Quick Fix #2: Test Email Provider
Go to: **Authentication → Email Templates**
- Click: "Send test email"
- If this fails → email provider not configured

### Quick Fix #3: Use Built-in Email
Go to: **Authentication → Providers → Email**
- Ensure "Enable email provider" is ON
- Under "SMTP Settings": select "Use built-in service"
- Note: Limited to 3 emails/hour in development

---

## What You Get

✅ **Modern Onboarding Flow**:
- Email/Name entry
- OTP verification
- Profile photo upload
- Bio & info collection
- Genre selection

✅ **Fully Functional Profile**:
- Edit name, bio, photo
- Change genres
- All changes save to database

✅ **Production Ready**:
- Real authentication
- Email verification
- Secure user sessions

---

## Need Help?

Check `COMPLETE_SETUP_GUIDE.md` for detailed troubleshooting and full documentation.
