# 🎵 Vibe Beats - Music Dating App

A Progressive Web App that connects people through their music taste. Swipe, match, and vibe with people who share your musical preferences!

## ✨ Features

- 🎯 **Tinder-style Swiping** - Swipe left to pass, right to like
- 🎵 **Music Profiles** - Showcase your favorite songs (Spotify integration ready)
- 🏆 **Leaderboard** - Get ranked based on right swipes received
- 💬 **Messaging** - Chat with your matches
- 📱 **PWA** - Install as native app on mobile
- 🔒 **Bennett University Only** - Exclusive to @bennett.edu.in emails

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy
```bash
vercel --prod
```

## 📁 Project Structure

```
├── public/
│   ├── icons/              # PWA icons (need to generate)
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Service worker for offline
│   └── generate-icons.html # Icon generator tool
├── src/
│   ├── components/         # React components
│   ├── utils/             # API client and utilities
│   └── supabase/          # Backend Edge Functions
├── BACKEND_SETUP.md       # Comprehensive backend guide
├── DEPLOY.md              # Quick deployment guide
└── generate-pwa-icons.ps1 # PowerShell icon generator
```

## 🗄️ Backend Requirements

This app requires:
1. **Supabase Database** - User profiles, swipes, matches, messages
2. **Supabase Storage** - Profile photo uploads
3. **Supabase Auth** - Email/OTP authentication
4. **Edge Functions** - API endpoints

See `BACKEND_SETUP.md` for detailed setup instructions.

## 📱 PWA Setup

### Generate Icons:
1. Open `public/generate-icons.html` in browser
2. Download icon pack
3. Extract to `public/icons/`

Or use PowerShell script:
```powershell
.\generate-pwa-icons.ps1
```

### Test PWA:
1. Deploy to Vercel (requires HTTPS)
2. Visit on mobile Chrome/Safari
3. Look for "Install App" prompt
4. Test offline functionality

## 🔐 Environment Variables

Create `.env.local`:
```bash
VITE_SUPABASE_URL=https://ezovnklmvqqfiojjvmel.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

## 🎨 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Supabase (PostgreSQL + Edge Functions + Storage)
- **Hosting:** Vercel
- **PWA:** Service Workers + Web App Manifest

## 📚 Documentation

- **Full Backend Guide:** [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Quick Deploy:** [DEPLOY.md](./DEPLOY.md)
- **Original Figma:** [PairMUSIc Design](https://www.figma.com/design/bX3KgBBoanAjs2Ej4aHjJI/PairMUSIc)

## 🐛 Troubleshooting

### PWA Not Installing?
- Check HTTPS is enabled (automatic on Vercel)
- Verify manifest.json is accessible
- Ensure all icons exist
- Run Lighthouse audit

### Backend Errors?
- Check Supabase dashboard for logs
- Verify database tables exist
- Check RLS policies are enabled

## 🚀 Deployment Steps

1. **Generate PWA Icons** (5 min)
2. **Setup Supabase Database** (20 min)
3. **Deploy to Vercel** (2 min)
4. **Test on Mobile** (5 min)

See [DEPLOY.md](./DEPLOY.md) for step-by-step guide.

## 📄 License

MIT

## 🤝 Contributing

This is a private project for Bennett University students.

---

**Ready to deploy?** Follow [DEPLOY.md](./DEPLOY.md) 🚀
  