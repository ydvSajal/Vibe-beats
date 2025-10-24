# OTP Email Troubleshooting Checklist

## 1. **Verify Supabase Email Configuration**
- Go to: https://app.supabase.com → Your Project → Settings → Email
- Check if you have an active email provider:
  - ✓ Built-in email (limited, works for OTP)
  - ✓ Custom SMTP configured
  - ✗ Neither (OTP emails won't send)

## 2. **Check Email Templates**
- Settings → Email Templates
- Look for: "Confirm signup" or "Verify OTP" template
- Ensure it's **enabled** and has proper content

## 3. **Test OTP Sending Manually**
```bash
# In Supabase CLI or dashboard, test:
# Go to Authentication → Users → Add User
# Set email and enable "Auto Confirm" for testing
# Then test signInWithOtp manually
```

## 4. **Frontend Testing Steps**
1. Sign up with: `test@bennett.edu.in`
2. Wait 5-10 seconds for email (check spam folder)
3. If no email arrives:
   - Check backend logs: `supabase functions logs make-server-2e8e40fd`
   - Look for error message about OTP sending

## 5. **What Changed**
- Backend now returns error details if OTP sending fails
- Frontend will display the error instead of silently failing
- This will help us diagnose the real issue

## 6. **Next Steps After Testing**
If OTP email still doesn't arrive:
- [ ] Enable Supabase email provider in dashboard
- [ ] Configure custom SMTP if needed
- [ ] Deploy updated backend function
- [ ] Test again
