# 📱 Progressive Web App (PWA) Setup Guide

Your TuneMatch app is now configured as a Progressive Web App! Students can install it on their phones and use it like a native app.

## ✨ What's Been Added

### 1. **PWA Manifest** (`/public/manifest.json`)
- App name, icons, and theme colors
- Standalone display mode (looks like a native app)
- Portrait orientation lock
- App shortcuts (quick access to Swipe, Chat, Leaderboard)
- Share target API support

### 2. **Service Worker** (`/public/service-worker.js`)
- Offline functionality
- Asset caching for faster loads
- Background sync for swipes and messages
- Push notification support

### 3. **PWA Utilities** (`/utils/pwa.ts`)
- Service worker registration
- Install prompt handling
- Network status monitoring
- Web Share API integration
- Push notification helpers

### 4. **Install Prompt Component** (`/components/InstallPrompt.tsx`)
- Beautiful install banner
- Shows after 3 seconds on supported browsers
- Dismissible (saves preference)
- Shows app benefits

## 🚀 How to Use

### For Development (VS Code)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Test PWA Features**
   - Open Chrome DevTools → Application tab
   - Check "Service Workers" section
   - Use "Manifest" section to verify icons
   - Test offline mode with "Offline" checkbox

### For Production Deployment

1. **Build the App**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel (Recommended)**
   ```bash
   npm install -g vercel
   vercel
   ```
   
   Or use Vercel UI:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Alternative: Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

## 📲 How Students Can Install

### On Android (Chrome/Edge)
1. Visit the website
2. See "Install TuneMatch" banner at bottom
3. Tap "Install"
4. App appears on home screen!

**Or manually:**
- Tap menu (⋮) → "Add to Home screen"

### On iOS (Safari)
1. Visit the website
2. Tap Share button (□↑)
3. Scroll down → "Add to Home Screen"
4. Tap "Add"

### On Desktop (Chrome/Edge)
1. Visit the website
2. Look for install icon (⊕) in address bar
3. Click to install

## 🎨 Customizing Icons

You need to create app icons and place them in `/public/icons/`:

### Required Icon Sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

### Easy Way to Generate Icons:
1. Create a 512x512 PNG logo with:
   - Purple/pink gradient background (#A855F7 → #EC4899)
   - Music note or headphone icon
   - App name "TuneMatch"

2. Use online tools:
   - [https://realfavicongenerator.net](https://realfavicongenerator.net)
   - [https://favicon.io](https://favicon.io)
   - [https://www.pwabuilder.com](https://www.pwabuilder.com)

### Temporary Solution:
Until you create real icons, the app will work but show placeholder icons. You can use this quick fix:

Create a simple icon with any design tool or use this as a placeholder URL in manifest.json:
```json
"src": "https://via.placeholder.com/512x512/A855F7/FFFFFF?text=TM"
```

## 🔔 Push Notifications Setup

To enable push notifications:

1. **Generate VAPID Keys**
   ```bash
   npm install web-push -g
   web-push generate-vapid-keys
   ```

2. **Update `/utils/pwa.ts`**
   Replace `YOUR_VAPID_PUBLIC_KEY_HERE` with your public key

3. **Backend Integration**
   Add push notification endpoint to your Supabase edge function:
   ```typescript
   // Send notification when new match
   await sendPushNotification(userId, {
     title: 'New Match! 🎵',
     body: 'You matched with someone who loves Indie too!',
     icon: '/icons/icon-192x192.png'
   });
   ```

## 🌐 Making it Work Offline

The service worker already caches:
- ✅ HTML, CSS, JS files
- ✅ Images and assets
- ✅ API responses (with network-first strategy)

### What works offline:
- View previously loaded profiles
- Browse cached leaderboard
- Read messages
- View your profile

### What requires internet:
- Swiping new profiles
- Sending messages
- Real-time updates

## 📊 Testing PWA Features

### Lighthouse Audit (Chrome DevTools)
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Generate report"
5. Aim for 90+ score

### PWA Checklist:
- ✅ HTTPS enabled (automatic on Vercel/Netlify)
- ✅ Service worker registered
- ✅ Manifest file valid
- ✅ Icons provided (need to add real icons)
- ✅ Offline page works
- ✅ Mobile responsive
- ✅ Fast load time
- ✅ Install prompt shown

## 🎯 Features Included

### Installable
- ✅ Add to home screen
- ✅ Runs in standalone mode
- ✅ Custom splash screen
- ✅ App shortcuts

### Offline Support
- ✅ Service worker caching
- ✅ Background sync
- ✅ Queue swipes when offline
- ✅ Retry failed requests

### Native Features
- ✅ Push notifications
- ✅ Share target (share to app)
- ✅ Web share API
- ✅ Network status detection

### Performance
- ✅ Asset caching
- ✅ Runtime caching
- ✅ Precaching critical resources
- ✅ Cache-first for images

## 🔧 Troubleshooting

### Service Worker Not Registering
- Check console for errors
- Ensure HTTPS (required for PWA)
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

### Install Prompt Not Showing
- Only works on HTTPS
- Only shows if not already installed
- May require engagement (click/scroll)
- iOS Safari uses different UI

### Icons Not Showing
- Check `/public/icons/` folder exists
- Verify icon paths in manifest.json
- Clear cache and reload
- Check browser console for 404 errors

### Offline Not Working
- Service worker must be active
- Visit app at least once while online
- Check Network tab in DevTools
- Verify cache in Application tab

## 📱 iOS Specific Notes

iOS Safari has limited PWA support:
- ❌ No install banner (must use Share → Add to Home Screen)
- ❌ No push notifications
- ❌ No background sync
- ✅ Works as standalone app
- ✅ Service worker caching works
- ✅ Offline functionality works

## 🎉 Best Practices

1. **Always use HTTPS** - Required for service workers
2. **Keep service worker simple** - Complex logic can cause issues
3. **Version your cache names** - Easier to manage updates
4. **Test offline thoroughly** - Check all features work
5. **Optimize images** - Faster load times
6. **Monitor analytics** - Track install rate
7. **Update service worker regularly** - Fix bugs and add features

## 📚 Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Service Worker Cookbook](https://serviceworke.rs/)

## 🎊 What's Next?

1. **Create app icons** (most important!)
2. **Test on real devices** (Android & iOS)
3. **Set up push notifications** (optional)
4. **Add to Play Store** (optional, using TWA)
5. **Monitor install metrics**

---

**Need Help?** Check the console logs for `[PWA]` messages to debug issues.

**Pro Tip:** Test on actual mobile devices, not just Chrome DevTools mobile simulation!
