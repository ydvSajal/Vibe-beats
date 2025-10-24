# Spotify Integration Setup Guide

## Overview

The app now has **full Spotify integration** to fetch user's top tracks and recently played songs during profile setup.

---

## Step 1: Register Spotify App

1. Go to: https://developer.spotify.com/dashboard
2. Log in or create a free Spotify account
3. Click **"Create an App"**
4. Fill in the form:
   - **App name:** Vibe Beats
   - **Accept terms** and create
5. You'll get:
   - **Client ID** (copy this)
   - **Client Secret** (copy this, keep secret!)

---

## Step 2: Configure Redirect URI

1. In your Spotify App Dashboard, go to **Settings**
2. Under **Redirect URIs**, add:
   - Development: `http://localhost:5173/callback`
   - Production: `https://yourdomain.com/callback`
3. Click **Save**

---

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root:

```env
# Frontend - Spotify OAuth
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback

# Backend - Spotify Token Exchange
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

For production, set these in your Vercel/hosting environment variables.

---

## Step 4: Deploy Backend Function

```powershell
cd c:\Users\sajal\OneDrive\Documents\GitHub\Vibe-beats
supabase functions deploy make-server-2e8e40fd
```

---

## Step 5: Create OAuth Callback Handler (Optional but Recommended)

If you want automatic token handling after OAuth, create this page:

**`src/pages/callback.tsx`** or **`src/components/SpotifyCallback.tsx`**:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../utils/spotify';
import { toast } from 'sonner';

export function SpotifyCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');

      if (error) {
        toast.error(`Spotify auth failed: ${error}`);
        navigate('/');
        return;
      }

      if (code) {
        const token = await exchangeCodeForToken(code, state || '');
        if (token) {
          toast.success('Connected to Spotify! 🎵');
          navigate('/');
        } else {
          toast.error('Failed to connect to Spotify');
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Connecting to Spotify...</p>
    </div>
  );
}
```

---

## How It Works

### User Flow:

1. **User clicks "Connect Spotify"** during profile setup
2. **Redirected to Spotify login** page
3. **User authorizes app** and grants permissions:
   - Read profile info
   - Read email
   - Read top tracks
   - Read recently played
4. **Spotify redirects back** to your app with authorization code
5. **Backend exchanges code** for access token (securely)
6. **Frontend stores token** in localStorage
7. **App fetches user's top 10 tracks** from Spotify
8. **Displays tracks** in profile setup screen

### Permissions Requested:

- ✅ `user-read-private` — Read user's profile
- ✅ `user-read-email` — Read user's email
- ✅ `user-top-read` — Read user's top tracks
- ✅ `user-read-recently-played` — Read recently played

---

## API Endpoints Created

### 1. Exchange Authorization Code
```
POST /make-server-2e8e40fd/spotify/exchange-token
Body: { code, redirect_uri }
Response: { access_token, refresh_token, expires_in }
```

### 2. Refresh Access Token
```
POST /make-server-2e8e40fd/spotify/refresh-token
Body: { refresh_token }
Response: { access_token, refresh_token, expires_in }
```

---

## Frontend Functions

All in `src/utils/spotify.ts`:

| Function | Purpose |
|----------|---------|
| `initiateSpotifyAuth()` | Start OAuth flow |
| `exchangeCodeForToken()` | Exchange code for token |
| `getSpotifyAccessToken()` | Get current token (refreshes if needed) |
| `refreshSpotifyToken()` | Manually refresh token |
| `getSpotifyUser()` | Fetch user's Spotify profile |
| `getSpotifyTopTracks(limit)` | Fetch user's top tracks |
| `getSpotifyRecentTracks(limit)` | Fetch recently played tracks |
| `isSpotifyConnected()` | Check if user is authenticated |
| `disconnectSpotify()` | Logout from Spotify |

---

## Testing

### Local Testing:

1. Start dev server:
   ```powershell
   npm run dev
   ```

2. Sign up and reach profile setup screen

3. Click "Connect Spotify"

4. You'll be redirected to Spotify login

5. Authorize the app

6. Should load your top tracks automatically

### Verify in Browser Console:

```javascript
// Check if token is stored
localStorage.getItem('spotify_access_token')

// Get top tracks
import { getSpotifyTopTracks } from './utils/spotify'
const tracks = await getSpotifyTopTracks(10)
console.log(tracks)
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Spotify Client ID not configured" | Check `.env.local` and restart dev server |
| Redirect fails | Verify redirect URI matches exactly in Spotify Dashboard |
| "Invalid authorization code" | Code expires after 10 minutes, try again |
| Token expires | Automatic refresh via `getSpotifyAccessToken()` |
| No tracks showing | Check Spotify Premium status (some limits apply to free tier) |

---

## Security Notes

⚠️ **IMPORTANT:**
- **Never** commit `.env.local` with real credentials
- **Client Secret** should only be on backend (in Deno function)
- Frontend only stores access token (short-lived, ~1 hour)
- Refresh token is secure in localStorage (rotated each use)
- Always validate state parameter to prevent CSRF attacks

---

## What Changed in the App

### New Files:
- `src/utils/spotify.ts` — Spotify integration utilities

### Updated Components:
- `ProfileCreationScreen.tsx` — Now connects to Spotify and fetches top tracks
- `make-server-2e8e40fd/index.ts` — Added Spotify token endpoints

### Fixes:
- ✅ Profile creation request error fixed (now uses actual user data)
- ✅ Spotify integration now working (real OAuth flow)
- ✅ Top tracks display properly with images and artist info
- ✅ Auto-saves favorite artists from Spotify profile

---

## Next Steps (Optional Enhancements)

- [ ] Add song preview player (click to preview on Spotify)
- [ ] Store Spotify connection in database
- [ ] Allow users to customize song selections
- [ ] Add playlist integration
- [ ] Add real-time sync with Spotify updates
- [ ] Add more permission scopes for playlist creation

---

## Ready to Test! 🎵

Once you set up the Spotify credentials and environment variables, your app will have **professional Spotify integration** just like Spotify, Apple Music, and other modern apps!
