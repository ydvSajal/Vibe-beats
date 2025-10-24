# Quick Spotify Setup - 5 Minutes

## The Problem You Had
❌ Profile setup showed "Request failed" error
❌ Spotify "Connect" button didn't actually connect
❌ No way to fetch user's top tracks

## What I Fixed
✅ Fixed profile creation API call (now uses real user data)
✅ Implemented real Spotify OAuth flow
✅ Added top tracks fetching from Spotify
✅ Auto-loads user's profile picture and artists
✅ Build verified successfully

---

## 3-Step Setup to Get Spotify Working

### Step 1: Create Spotify App (2 minutes)
1. Go to: https://developer.spotify.com/dashboard
2. Sign up or login
3. **Create an App** → name it "Vibe Beats"
4. Accept terms
5. Copy your **Client ID** and **Client Secret**

### Step 2: Add Redirect URI (1 minute)
1. Click **Settings** in your Spotify app
2. Add Redirect URI: `http://localhost:5173/callback`
3. Save

### Step 3: Set Environment Variables (2 minutes)
Create `.env.local` in project root:

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Then restart:
```powershell
npm run dev
```

---

## Test It
1. Sign up: `test@bennett.edu.in` → verify OTP
2. Complete onboarding (photo, bio, genres)
3. On profile setup screen → click **"Connect Spotify"**
4. Login to Spotify → authorize
5. **Your top 10 tracks load automatically!** 🎵

---

## What Happens
```
User clicks "Connect Spotify"
      ↓
Redirects to Spotify login
      ↓
User authorizes app
      ↓
Backend securely exchanges code for token
      ↓
Frontend fetches top tracks
      ↓
Displays in profile setup with images
```

---

## Files Changed
- ✅ `src/utils/spotify.ts` — NEW: Spotify OAuth & API calls
- ✅ `src/components/ProfileCreationScreen.tsx` — Fixed API call, added Spotify connection
- ✅ `supabase/functions/make-server-2e8e40fd/index.ts` — Added Spotify token endpoints
- ✅ Build successful

---

## Quick Reference
| Function | What It Does |
|----------|-------------|
| `initiateSpotifyAuth()` | Start OAuth redirect |
| `getSpotifyTopTracks(10)` | Fetch user's top 10 tracks |
| `getSpotifyUser()` | Get user profile & picture |
| `isSpotifyConnected()` | Check if logged in |
| `disconnectSpotify()` | Logout |

All in `src/utils/spotify.ts`

---

## Troubleshooting Quick Fixes

**"Client ID not configured"**
- Did you restart dev server after adding .env.local? Try: `npm run dev`

**"Invalid redirect URI"**
- Make sure in Spotify Dashboard → Settings → Redirect URIs matches exactly:
  `http://localhost:5173/callback`

**No tracks appear**
- Check browser console for errors
- Make sure your Spotify account has listening history

**"Request failed" on profile save**
- That's fixed! It was using hardcoded "User" name. Now uses actual name from signup.

---

## For Production

When deploying to production:

1. Update redirect URI in Spotify Dashboard:
   - Add: `https://yourdomain.com/callback`

2. Set environment variables in Vercel/hosting:
   ```
   VITE_SPOTIFY_CLIENT_ID=...
   VITE_SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
   SPOTIFY_CLIENT_ID=...
   SPOTIFY_CLIENT_SECRET=...
   ```

3. Deploy Edge Function:
   ```powershell
   supabase functions deploy make-server-2e8e40fd
   ```

---

## Done! 🚀

Your app now has professional Spotify integration, just like Spotify, Apple Music, and other modern apps!

Next: Run the app and test: `npm run dev`
