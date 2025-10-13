# 🚀 TuneMatch Deployment Checklist

## Pre-Deployment Requirements

### 1. ✅ Environment Setup
Before deploying, ensure you have:

- [ ] **Supabase Project**: Create a project at [supabase.com](https://supabase.com)
- [ ] **Environment Variables** configured in Supabase:
  ```
  SUPABASE_URL=your-project-url
  SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ```

### 2. ✅ Custom Icons (Optional but Recommended)
Replace placeholder icons in `/public/manifest.json`:
- Create icons at: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Use tools like [RealFaviconGenerator](https://realfavicongenerator.net/)
- Place icons in `/public/icons/` directory
- Update paths in both `/manifest.json` and `/public/manifest.json`

### 3. ✅ PWA Assets
Optional enhancements:
- [ ] Add screenshots to `/public/screenshots/`
  - `swipe-screen.png` (540x720)
  - `profile-screen.png` (540x720)
- [ ] Create custom offline page at `/public/offline.html` (already included)

---

## 🌐 Deployment Steps

### Step 1: Deploy Backend (Supabase Edge Functions)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy edge function
supabase functions deploy make-server-2e8e40fd
```

### Step 2: Deploy Frontend

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts to configure:
# - Framework: React (or detect automatically)
# - Build command: npm run build
# - Output directory: dist
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Configure:
# - Build command: npm run build
# - Publish directory: dist
```

#### Option C: GitHub Pages
```bash
# Build the app
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Step 3: Configure Custom Domain (Optional)
- Point your domain to deployment platform
- Update `manifest.json` with production domain
- Update `start_url` in manifest
- Enable HTTPS (required for PWA)

---

## 🔧 Post-Deployment Configuration

### 1. Update Manifest URLs
In `/public/manifest.json`:
```json
{
  "start_url": "https://yourdomain.com/",
  "scope": "https://yourdomain.com/",
  "icons": [
    {
      "src": "https://yourdomain.com/icons/icon-192x192.png",
      ...
    }
  ]
}
```

### 2. Test PWA Installation
1. Open app on mobile device (Chrome/Safari)
2. Check for "Add to Home Screen" prompt
3. Install and verify standalone mode works
4. Test offline functionality

### 3. Verify Service Worker
1. Open Chrome DevTools → Application → Service Workers
2. Confirm service worker is registered
3. Test "Update on reload"
4. Verify cache storage

### 4. Lighthouse Audit
Run Google Lighthouse audit:
```bash
# Using Chrome DevTools
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Run audit for:
#    - Performance
#    - PWA
#    - Best Practices
#    - Accessibility
#    - SEO

# Target Scores:
# - Performance: >90
# - PWA: 100
# - Best Practices: >90
# - Accessibility: >90
```

---

## 📱 PWA Distribution

### iOS (Safari)
1. Users tap Share button
2. Select "Add to Home Screen"
3. App icon appears on home screen

### Android (Chrome)
1. Chrome shows install banner automatically
2. Or users tap menu → "Install app"
3. App icon appears in app drawer

### Desktop (Chrome/Edge)
1. Install icon in address bar
2. Or menu → "Install TuneMatch"
3. App opens in standalone window

---

## 🔐 Security Checklist

- [ ] HTTPS enabled (required for PWA)
- [ ] CORS properly configured
- [ ] API keys secured in environment variables
- [ ] Service role key NOT exposed to frontend
- [ ] Rate limiting configured (optional)
- [ ] Input validation on all forms
- [ ] XSS protection enabled

---

## 📊 Analytics Setup (Optional)

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Mixpanel/Amplitude
Track key events:
- User signup
- Profile created
- Swipes (left/right)
- Matches
- Messages sent
- App installed

---

## 🧪 Testing Checklist

### Before Launch
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on Desktop Chrome
- [ ] Test offline mode
- [ ] Test dark mode
- [ ] Test all user flows
- [ ] Test on slow network (3G)
- [ ] Verify no console errors
- [ ] Test PWA installation
- [ ] Verify service worker updates

### Performance Tests
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse PWA score = 100
- [ ] All images optimized
- [ ] JavaScript bundle size < 500kb

---

## 📢 Launch Checklist

### Pre-Launch
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] PWA installable on all platforms
- [ ] Analytics configured
- [ ] Error tracking set up (Sentry, etc.)

### Launch Day
- [ ] Share install link with initial users
- [ ] Monitor error logs
- [ ] Check analytics for user behavior
- [ ] Gather user feedback
- [ ] Monitor performance metrics

### Post-Launch
- [ ] Fix critical bugs immediately
- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Monitor app usage statistics
- [ ] Update service worker cache version as needed

---

## 🔄 Update Process

### Updating the App
1. Make changes to code
2. Update cache version in service worker:
   ```javascript
   const CACHE_NAME = 'tunematch-v2'; // Increment version
   ```
3. Deploy new version
4. Service worker auto-detects update
5. Shows "Update Available" notification
6. Users refresh to get new version

---

## 🆘 Troubleshooting

### PWA Not Installing
- Check HTTPS is enabled
- Verify manifest.json is valid (use [Web Manifest Validator](https://manifest-validator.appspot.com/))
- Ensure service worker is registered
- Check browser console for errors

### Service Worker Not Updating
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Unregister old service worker
- Check cache version is updated

### Offline Mode Not Working
- Verify service worker is active
- Check cache strategy in service worker
- Test with DevTools offline mode
- Ensure critical assets are cached

---

## 📚 Additional Resources

- [PWA Builder](https://www.pwabuilder.com/) - Test and improve your PWA
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing
- [Workbox](https://developers.google.com/web/tools/workbox) - Advanced service worker tools
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/) - Best practices

---

## ✅ Final Deployment Verification

Before marking as complete:

1. **PWA Score**: Lighthouse PWA score = 100 ✅
2. **Performance**: Load time < 2s on 3G ✅
3. **Installation**: Installable on iOS and Android ✅
4. **Offline**: Works offline with cached content ✅
5. **Updates**: Service worker update notification working ✅
6. **Security**: HTTPS enabled, API keys secured ✅
7. **Cross-browser**: Works on Chrome, Safari, Firefox, Edge ✅
8. **Mobile**: Responsive on all screen sizes ✅
9. **Dark Mode**: Working across all screens ✅
10. **Backend**: All API endpoints functioning ✅

---

**Ready to deploy?** Follow the steps above and your TuneMatch PWA will be live! 🎉

For questions or issues, refer to the documentation files:
- `/E2E_CHECKLIST.md` - Testing verification
- `/PWA_SETUP.md` - PWA setup guide
- `/QUICK_START.md` - Quick start guide
- `/BACKEND_GUIDE.md` - Backend setup
