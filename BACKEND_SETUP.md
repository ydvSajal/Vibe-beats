# Vibe Beats - Backend Setup Guide

## 🎯 Overview

Your **Vibe Beats** app is a music-based social dating/networking platform with Tinder-style swiping, leaderboards, and messaging. This guide covers all backend requirements based on your app's features.

---

## 📊 Current App Features Analysis

### ✅ **Implemented Features:**
1. **Authentication Flow**
   - Email-based signup (Bennett University email restriction)
   - OTP verification system
   - Token-based authentication
   
2. **User Profiles**
   - Profile creation with name and photo
   - Music preference selection (5+ songs)
   - Category selection (Indie, Pop, Rock, Hip-Hop, EDM, Punjabi, Haryanvi, Hindi)
   - Profile viewing and editing

3. **Swipe Pool (Core Feature)**
   - Tinder-style card swiping
   - Left swipe (skip) / Right swipe (like)
   - Match detection (mutual right swipes)
   - Profile cards with user info and songs

4. **Leaderboard**
   - Ranking system based on right swipes received
   - Category filtering
   - Real-time rank updates

5. **Messaging/Inbox**
   - Conversation list with matches
   - Direct messaging between matched users
   - Conversation locking (only matched users can message)

6. **Profile Management**
   - View own profile
   - Edit profile details
   - Account settings
   - Privacy and safety settings

---

## 🗄️ Required Backend Infrastructure

### **1. Database Schema (Supabase)**

Your app needs these database tables:

#### **A. `users` Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@bennett.edu.in'),
  name TEXT NOT NULL,
  photo TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all profiles (for swipe pool)
CREATE POLICY "Public profiles are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);
```

#### **B. `songs` Table**
```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  artwork TEXT,
  is_locked BOOLEAN DEFAULT false,
  is_editable BOOLEAN DEFAULT true,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Songs are viewable by everyone" 
ON songs FOR SELECT 
USING (true);

CREATE POLICY "Users can manage own songs" 
ON songs FOR ALL 
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_songs_user_id ON songs(user_id);
```

#### **C. `swipes` Table**
```sql
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('left', 'right')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_user_id)
);

ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swipes" 
ON swipes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create swipes" 
ON swipes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_target_user_id ON swipes(target_user_id);
CREATE INDEX idx_swipes_direction ON swipes(direction);
```

#### **D. `matches` Table**
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user1_id < user2_id), -- Ensure unique pair ordering
  UNIQUE(user1_id, user2_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matches" 
ON matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Index for faster queries
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
```

#### **E. `messages` Table**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their matches" 
ON messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE id = messages.match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

CREATE POLICY "Users can send messages in their matches" 
ON messages FOR INSERT 
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM matches 
    WHERE id = match_id 
    AND (user1_id = auth.uid() OR user2_id = auth.uid())
  )
);

-- Index for faster queries
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

#### **F. `user_stats` View**
```sql
-- View for leaderboard data
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.name,
  u.photo,
  u.category,
  COUNT(CASE WHEN s.direction = 'right' THEN 1 END) as right_swipes_received,
  ROW_NUMBER() OVER (ORDER BY COUNT(CASE WHEN s.direction = 'right' THEN 1 END) DESC) as rank
FROM users u
LEFT JOIN swipes s ON s.target_user_id = u.id
GROUP BY u.id, u.name, u.photo, u.category;
```

---

### **2. Storage Buckets (Supabase Storage)**

#### **A. Profile Photos Bucket**
```sql
-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Policy: Anyone can view profile photos
CREATE POLICY "Public profile photos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-photos');

-- Policy: Users can upload their own photos
CREATE POLICY "Users can upload own profile photos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update own profile photos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own profile photos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### **B. Song Artwork Bucket** (Optional - if not using external URLs)
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('song-artwork', 'song-artwork', true);

CREATE POLICY "Public song artwork" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'song-artwork');
```

---

### **3. Edge Functions (Supabase Functions)**

Your current Edge Function structure is good, but needs these updates:

#### **File: `supabase/functions/make-server/index.ts`**

**Add file upload handler:**
```typescript
// Upload profile photo
app.post("/make-server-2e8e40fd/upload/profile-photo", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const formData = await c.req.formData();
    const file = formData.get('photo') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400);
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File size must be less than 5MB' }, 400);
    }
    
    const supabase = getSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, await file.arrayBuffer(), {
        contentType: file.type,
        upsert: true
      });
    
    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);
    
    return c.json({ 
      success: true, 
      url: publicUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});
```

**Update profile creation to use real database:**
```typescript
// Create/Update profile
app.post("/make-server-2e8e40fd/profile", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { name, photo, songs, category } = await c.req.json();
    
    const supabase = getSupabaseClient();
    
    // Update user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        name,
        photo,
        category,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
      return c.json({ error: 'Failed to update profile' }, 500);
    }
    
    // Delete old songs and insert new ones
    await supabase
      .from('songs')
      .delete()
      .eq('user_id', user.id);
    
    if (songs && songs.length > 0) {
      const songsToInsert = songs.map((song, index) => ({
        user_id: user.id,
        title: song.title,
        artist: song.artist,
        artwork: song.artwork,
        is_locked: song.isLocked || false,
        is_editable: song.isEditable || true,
        position: index
      }));
      
      const { error: songsError } = await supabase
        .from('songs')
        .insert(songsToInsert);
      
      if (songsError) {
        console.error('Songs error:', songsError);
      }
    }
    
    return c.json({ success: true, profile });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});
```

---

### **4. Authentication Setup**

#### **Supabase Auth Configuration:**

1. **Enable Email Provider:**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable "Email" provider
   - Enable "Confirm email" (optional for production)

2. **Email Templates:**
   Update OTP email template in Supabase Dashboard:
   ```html
   <h2>Your OTP Code</h2>
   <p>Enter this code in Vibe Beats:</p>
   <h1>{{ .Token }}</h1>
   <p>This code expires in 5 minutes.</p>
   ```

3. **Email Restrictions:**
   Add custom validation in Edge Function:
   ```typescript
   if (!email.endsWith('@bennett.edu.in')) {
     return c.json({ error: 'Only Bennett University emails allowed' }, 400);
   }
   ```

---

## 🔧 Frontend Integration Updates

### **1. Update API Client for File Uploads**

**File: `src/utils/api.ts`**

Add file upload function:
```typescript
export const api = {
  // ... existing code ...
  
  upload: {
    profilePhoto: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch(`${BASE_URL}/upload/profile-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken() || publicAnonKey}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Upload failed');
      }
      
      return response.json();
    },
  },
};
```

### **2. Update Profile Creation Component**

**File: `src/components/ProfileCreationScreen.tsx`**

Add file upload handler:
```typescript
const [selectedFile, setSelectedFile] = useState<File | null>(null);

const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePhoto(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }
};

const handleSaveProfile = async () => {
  setLoading(true);
  try {
    let photoUrl = profilePhoto;
    
    // Upload photo if a new file was selected
    if (selectedFile) {
      const uploadResult = await api.upload.profilePhoto(selectedFile);
      photoUrl = uploadResult.url;
    }
    
    await api.profile.create({
      name: 'User', // Get from form input
      photo: photoUrl,
      songs: mockSongs,
      category: selectedCategory,
    });
    
    toast.success('Profile created! 🎉');
    setTimeout(() => onComplete(), 500);
  } catch (error) {
    console.error('Profile creation error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to create profile');
  } finally {
    setLoading(false);
  }
};
```

Update the photo upload button:
```tsx
<input
  type="file"
  accept="image/*"
  onChange={handlePhotoChange}
  className="hidden"
  id="photo-upload"
/>
<label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#FF1744] cursor-pointer">
  <Camera className="w-6 h-6 text-[#FF1744]" />
</label>
```

---

## 🔐 Environment Variables

Create `.env.local` file:
```bash
VITE_SUPABASE_URL=https://ezovnklmvqqfiojjvmel.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ IMPORTANT:** Add `.env.local` to `.gitignore`

---

## 📱 PWA Fixes

### **1. Fix Manifest Path**

Update `index.html`:
```html
<link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
```

### **2. Create PWA Icons**

Generate icons using [Real Favicon Generator](https://realfavicongenerator.net/):

Required sizes:
- `public/icons/icon-72x72.png`
- `public/icons/icon-96x96.png`
- `public/icons/icon-128x128.png`
- `public/icons/icon-144x144.png`
- `public/icons/icon-152x152.png`
- `public/icons/icon-192x192.png`
- `public/icons/icon-384x384.png`
- `public/icons/icon-512x512.png`

### **3. Update Manifest**

**File: `public/manifest.json`**
```json
{
  "name": "Vibe Beats - Music Dating",
  "short_name": "Vibe Beats",
  "description": "Connect through music. Swipe, match, and vibe!",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FF1744",
  "theme_color": "#FF1744",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "categories": ["social", "music", "lifestyle"],
  "shortcuts": [
    {
      "name": "Swipe Pool",
      "short_name": "Swipe",
      "description": "Start swiping on profiles",
      "url": "/?tab=pool",
      "icons": [{ "src": "/icons/icon-192x192.png", "sizes": "192x192" }]
    }
  ]
}
```

### **4. Improved Service Worker**

**File: `public/service-worker.js`**
```javascript
const CACHE_NAME = 'vibe-beats-v1';
const RUNTIME_CACHE = 'vibe-beats-runtime';

// Assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event - Network first, fall back to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip API calls (always fetch from network)
  if (event.request.url.includes('/functions/v1/')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful responses
        if (response.status === 200) {
          caches.open(RUNTIME_CACHE)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            return new Response('Offline', { status: 503 });
          });
      })
  );
});
```

---

## 🚀 Deployment Checklist

### **Pre-Deployment:**
- [ ] All database tables created in Supabase
- [ ] Storage buckets configured with policies
- [ ] Edge Functions deployed to Supabase
- [ ] PWA icons generated (all 8 sizes)
- [ ] Environment variables set in Vercel
- [ ] Service worker tested locally

### **Vercel Environment Variables:**
```
VITE_SUPABASE_URL=https://ezovnklmvqqfiojjvmel.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key>
```

### **Post-Deployment:**
- [ ] Test PWA installation on mobile
- [ ] Test file uploads
- [ ] Test authentication flow
- [ ] Test swiping and matching
- [ ] Test messaging
- [ ] Test leaderboard
- [ ] Check service worker in DevTools
- [ ] Test offline functionality

---

## 📚 Additional Features to Consider

### **Phase 2 Enhancements:**
1. **Spotify Integration** - Real music data from Spotify API
2. **Push Notifications** - Match alerts and messages
3. **Real-time Updates** - Supabase Realtime for live messaging
4. **Profile Reports** - Moderation system
5. **Block Users** - Safety feature
6. **Photo Verification** - Prevent fake profiles
7. **Advanced Matching** - Music taste compatibility algorithm

---

## 🆘 Troubleshooting

### **PWA Not Installing:**
- Check manifest.json is accessible at `/manifest.json`
- Verify HTTPS is enabled (automatic on Vercel)
- Check all icon files exist
- Test with Lighthouse PWA audit

### **File Uploads Failing:**
- Check storage bucket policies
- Verify file size limits
- Check CORS settings in Supabase

### **Backend Errors:**
- Check Supabase Edge Function logs
- Verify environment variables
- Test database policies with SQL queries

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **PWA Guide:** https://web.dev/progressive-web-apps/
- **Vercel Docs:** https://vercel.com/docs

---

**Next Steps:**
1. Run the database migration scripts in Supabase SQL Editor
2. Configure storage buckets
3. Generate and add PWA icons
4. Deploy Edge Functions
5. Test everything locally
6. Deploy to Vercel
7. Test on mobile devices

Good luck! 🎵🚀
