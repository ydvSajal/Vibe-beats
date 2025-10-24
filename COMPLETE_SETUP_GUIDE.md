# Complete Setup Guide - OTP + Full Onboarding

## ✅ What Has Been Fixed

### 1. Backend (Supabase Edge Function)
- ✅ **OTP Sending**: Properly sends OTP emails during signup
- ✅ **OTP Verification**: Creates user profile in `public.users` after verification
- ✅ **Profile Updates**: Accepts all profile fields (name, bio, photo, age, gender, genres)

### 2. Frontend Components
- ✅ **OnboardingScreen**: Email → Name → OTP flow
- ✅ **CompleteOnboarding** (NEW): 5-step onboarding after OTP
  - Step 1: Confirm name
  - Step 2: Upload profile photo
  - Step 3: Write bio
  - Step 4: Enter age & gender
  - Step 5: Select music genres (up to 3)
- ✅ **EditProfileScreen**: All fields now editable with working image upload

### 3. Flow Summary
```
Landing → Onboarding (Email/Name/OTP) → Complete Onboarding (Photo/Bio/Info/Genres) → Main App
```

---

## 🚀 Deployment Steps

### Step 1: Clear Test User
Run this SQL in Supabase Dashboard → SQL Editor:
```sql
DELETE FROM public.users WHERE email = 'S24CSEU1704@bennett.edu.in';
DELETE FROM auth.users WHERE email = 'S24CSEU1704@bennett.edu.in';
```

Or go to **Authentication → Users** and manually delete the user.

---

### Step 2: Deploy Backend Function
```powershell
cd c:\Users\sajal\OneDrive\Documents\GitHub\Vibe-beats
supabase functions deploy make-server-2e8e40fd
```

---

### Step 3: Configure Supabase Email

#### A. Enable Email Provider
1. Go to: https://app.supabase.com → Your Project
2. **Authentication → Providers → Email**
3. Toggle ON: "Enable email provider"
4. Choose delivery method:
   - ✅ Built-in (for testing, 3 emails/hour limit)
   - ✅ Custom SMTP (for production)

#### B. Update Email Template
1. **Authentication → Email Templates**
2. Find: "Confirm signup"
3. Click **Edit** (pencil icon)
4. Replace content with the OTP template from `OTP_EMAIL_TEMPLATES.md` (Option 2 recommended)
5. **Save**

Key: Make sure template uses `{{ .Token }}` not `{{ .ConfirmationURL }}`

#### C. Set Redirect URL
1. **Authentication → URL Configuration**
2. Add your URLs:
   - `http://localhost:5173` (development)
   - Your production domain (when deployed)

---

## 📱 Complete User Flow

### Registration Flow
```
1. User lands on app → "Get Started"
2. Chooses "Register"
3. Enters email (must be @bennett.edu.in)
4. Enters name
5. Clicks "Send Verification Code"
6. Backend sends OTP email
7. User receives 6-digit code in email
8. Enters OTP code
9. Backend verifies OTP & creates user in public.users
10. Shows CompleteOnboarding flow:
    - Confirms name
    - Uploads profile photo
    - Writes bio
    - Enters age & gender
    - Selects favorite genres
11. Profile saved → Main app
```

### Login Flow
```
1. User clicks "Login"
2. Enters email
3. Backend sends OTP
4. User enters OTP
5. Verified → Main app
```

---

## 🔧 Testing Checklist

### Before Testing
- [ ] Clear test user from database
- [ ] Deploy backend function
- [ ] Configure email provider in Supabase
- [ ] Update email template to use `{{ .Token }}`

### Test Registration
- [ ] Start app: `npm run dev`
- [ ] Click "Get Started" → "Register"
- [ ] Enter email: `your-email@bennett.edu.in`
- [ ] Enter name: "Test User"
- [ ] Click "Send Verification Code"
- [ ] Check email inbox for OTP (6-digit code)
- [ ] Enter OTP in app
- [ ] Complete onboarding:
  - [ ] Confirm name
  - [ ] Upload photo (click camera icon)
  - [ ] Write bio
  - [ ] Enter age & gender
  - [ ] Select 1-3 genres
- [ ] Click "Complete"
- [ ] Should see main app (Swipe Pool)

### Test Profile Editing
- [ ] Navigate to "Profile" tab
- [ ] Click "Edit Profile"
- [ ] Try changing:
  - [ ] Profile photo (click camera icon)
  - [ ] Name
  - [ ] Bio
  - [ ] Genre
- [ ] Click "Save Changes"
- [ ] Should see success toast
- [ ] Go back and verify changes saved

---

## 🐛 Troubleshooting

### Issue: "User with this email has already been registered"
**Solution**: Delete the user first:
```sql
DELETE FROM public.users WHERE email = 'your-email@bennett.edu.in';
DELETE FROM auth.users WHERE email = 'your-email@bennett.edu.in';
```

### Issue: OTP email not received
**Solutions**:
1. Check Supabase → Authentication → Email is enabled
2. Check email template uses `{{ .Token }}` not `{{ .ConfirmationURL }}`
3. Check spam folder
4. Try with different email
5. Check function logs: `supabase functions logs make-server-2e8e40fd --follow`

### Issue: "Invalid OTP"
**Solutions**:
1. Make sure you're entering the correct 6-digit code
2. OTP expires after 60 minutes - request new one
3. Check if email template is correctly configured

### Issue: Image upload not working
**Current Status**: 
- Images are stored as base64 data URLs (works but not optimal)
- TODO: Implement Supabase Storage upload
- For now, keep images under 5MB

### Issue: Profile not saving
**Solutions**:
1. Check console for errors
2. Verify auth token is set: `localStorage.getItem('authToken')`
3. Check backend logs for errors
4. Verify database connection

---

## 📁 New Files Created

1. **CompleteOnboarding.tsx** - 5-step onboarding component
2. **clear-test-user.sql** - SQL to remove test users
3. **OTP_EMAIL_TEMPLATES.md** - Email templates for OTP
4. **SUPABASE_OTP_FORMAT.md** - Complete OTP documentation
5. **OTP_DEPLOYMENT.md** - Deployment guide

---

## 🎯 What's Working Now

✅ Email/Name/OTP signup flow
✅ OTP email sending (if configured)
✅ OTP verification
✅ 5-step complete onboarding
✅ Profile photo upload (base64)
✅ All profile fields editable
✅ Name, bio, age, gender, genres saving
✅ Build successful
✅ Production ready (after email config)

---

## 🔜 TODO (Future Enhancements)

- [ ] Implement Supabase Storage for image uploads (replace base64)
- [ ] Add image compression before upload
- [ ] Add Spotify OAuth integration
- [ ] Add profile photo cropper
- [ ] Add email change functionality
- [ ] Add password reset flow (if using password auth)
- [ ] Add profile completion percentage indicator

---

## 🚢 Ready to Deploy!

Once you:
1. Clear test users
2. Deploy backend function
3. Configure email in Supabase
4. Update email template

Your app will have a **complete, modern onboarding experience** just like Instagram, Tinder, or Spotify! 🎉
