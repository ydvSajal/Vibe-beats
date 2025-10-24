# Supabase OTP Email Template

## Current Template (Confirmation Link)
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

---

## NEW OTP Email Template (6-Digit Code)

### Option 1: Simple OTP Display (Recommended)
```html
<h2>Your verification code</h2>

<p>Welcome! Your one-time password (OTP) is:</p>

<h1 style="font-size: 32px; font-weight: bold; color: #FF1744; letter-spacing: 5px; margin: 20px 0;">
{{ .Token }}
</h1>

<p>This code will expire in <strong>60 minutes</strong>.</p>

<p>If you didn't request this code, you can safely ignore this email.</p>

<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

<p style="font-size: 12px; color: #999;">
Do not share this code with anyone. Vibe Beats will never ask for your verification code.
</p>
```

---

### Option 2: Professional with Branding
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF1744 0%, #FF6B9D 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px 20px; }
        .otp-box { background-color: #f9f9f9; border-left: 4px solid #FF1744; padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center; }
        .otp-code { font-size: 48px; font-weight: bold; color: #FF1744; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 20px 0; }
        .expiry { color: #666; font-size: 14px; margin: 20px 0; }
        .footer { background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎵 Vibe Beats</h1>
            <p>Email Verification</p>
        </div>
        
        <div class="content">
            <p>Hi there!</p>
            
            <p>You recently signed up for Vibe Beats. To complete your registration, please verify your email using the code below:</p>
            
            <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your verification code:</p>
                <div class="otp-code">{{ .Token }}</div>
            </div>
            
            <p class="expiry">
                <strong>⏱️ Code expires in 60 minutes</strong>
            </p>
            
            <p style="margin: 30px 0; color: #666;">
                Enter this 6-digit code in the Vibe Beats app to verify your email and start discovering music matches!
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd;">
            
            <p style="margin: 20px 0; color: #999; font-size: 12px;">
                <strong>🔒 Security Notice:</strong> Never share this code with anyone. Vibe Beats support will never ask for your verification code.
            </p>
            
            <p style="color: #999; font-size: 12px;">
                If you didn't create a Vibe Beats account, you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p>© 2025 Vibe Beats. All rights reserved.</p>
            <p>Bennett University</p>
        </div>
    </div>
</body>
</html>
```

---

### Option 3: Minimal & Clean
```html
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
    <h2 style="color: #FF1744;">Verify your Vibe Beats account</h2>
    
    <p>Hi!</p>
    
    <p>Your one-time verification code is:</p>
    
    <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <p style="font-size: 28px; font-weight: bold; color: #FF1744; letter-spacing: 4px; margin: 0; font-family: 'Courier New', monospace;">
            {{ .Token }}
        </p>
    </div>
    
    <p>This code expires in 60 minutes.</p>
    
    <p style="color: #666; font-size: 12px;">
        If you didn't request this code, please ignore this email.
    </p>
</div>
```

---

## How to Update in Supabase Dashboard

1. **Go to:** https://app.supabase.com → Your Project
2. **Navigate to:** Authentication → Email Templates
3. **Find:** "Confirm signup" template
4. **Click:** Edit (pencil icon)
5. **Replace** the entire HTML with one of the options above
6. **Key Template Variable:** `{{ .Token }}` = the 6-digit OTP code
7. **Save** and test

---

## Template Variables Reference

| Variable | What It Contains | Example |
|----------|-----------------|---------|
| `{{ .Token }}` | 6-digit OTP code | `123456` |
| `{{ .ConfirmationURL }}` | Confirmation link (old) | `https://...` |
| `{{ .SiteURL }}` | Your site URL | `https://app.com` |
| `{{ .Email }}` | User's email | `user@bennett.edu.in` |

---

## Important Notes

✅ **Use `{{ .Token }}`** for OTP emails (6-digit code)  
❌ **Don't use `{{ .ConfirmationURL }}`** for OTP (that's for magic links)  
✅ **Always mention expiry time** (usually 60 minutes)  
✅ **Add security notice** about not sharing the code  

---

## Which Option Should You Use?

- **Option 1 (Simple)** - If you want minimal, fast-loading email ⭐
- **Option 2 (Professional)** - If you want branded, polished look ⭐⭐⭐ Recommended
- **Option 3 (Minimal)** - If you want balanced & clean ⭐⭐

I recommend **Option 2** for best user experience!
