# 🎵 Bennett Beats

A music-first social discovery platform for Bennett University students. Connect, match, and vibe with fellow students who share your music taste!

![Bennett Beats](https://img.shields.io/badge/Made%20for-Bennett%20University-FF6B6B?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-6BCB77?style=for-the-badge)

## ✨ Features

### 🎧 Music-First Matching
- Connect your Spotify to showcase your top songs
- 2 locked songs from your actual Spotify top tracks
- Customize 8 additional songs to show your vibe

### 💕 Smart Swipe System
- Swipe right to like profiles with similar music taste
- Swipe left to pass
- Get notified when you match!
- Undo feature for accidental swipes

### 💬 Instant Messaging
- Chat with your matches
- Share playlists and music recommendations
- First message unlocks the conversation

### 🏆 Leaderboard
- Compete for the top spot in your music category
- Filter by genre: Indie, Pop, Rock, Hip-Hop, EDM
- Top 3 get special badges (Gold, Silver, Bronze)

### 👤 Profile Management
- Showcase your top 10 songs
- Display your rank and stats
- Edit your profile anytime

## 🚀 Getting Started

### For Students

1. **Visit the Landing Page**
   - Check out features and testimonials
   - Click "Get Started Free"

2. **Sign Up**
   - Use your @bennett.edu.in email
   - Enter your name
   - Verify with OTP (demo mode auto-verifies)

3. **Create Your Profile**
   - Connect Spotify (mock for demo)
   - Choose your main music genre
   - Save your profile

4. **Start Swiping!**
   - Browse profiles of fellow students
   - Swipe right on those who share your taste
   - Get matches and start chatting

### For Developers

```bash
# The app runs on Figma Make
# All dependencies are auto-installed
# Backend is powered by Supabase
```

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Backend**: Supabase Edge Functions (Hono)
- **Database**: Supabase KV Store
- **Icons**: Lucide React
- **Notifications**: Sonner
- **UI Components**: shadcn/ui

## 📱 Screens

1. **Landing Page** - Marketing and features showcase
2. **Onboarding** - Sign up with email and OTP
3. **Profile Creation** - Set up your music profile
4. **Swipe Pool** - Discover and match with students
5. **Leaderboard** - See top-ranked profiles
6. **Inbox** - Chat with your matches
7. **Profile** - View and edit your profile

## 🎨 Design System

### Colors
- **Primary Gradient**: `#FF6B6B → #FFD93D`
- **Secondary Gradient**: `#6BCB77 → #4D96FF`
- **Background**: `#F0F4FF` to white gradient
- **Text Primary**: `#222222`
- **Text Secondary**: `#555555`

### Typography
- Headings: 24-28px Bold
- Subheadings: 18-20px Semi-Bold
- Body: 14-16px Regular
- Buttons: 16px Medium

### Components
- Rounded corners: 12px
- Touch targets: 44px minimum
- Card-based layouts
- Smooth animations

## 🔐 Backend Features

### Authentication
- Email-based signup
- OTP verification (demo mode)
- Session management
- Secure logout

### Data Storage
- User profiles with songs and stats
- Swipe history (like/pass)
- Match detection
- Conversation threads
- Message history
- Leaderboard rankings

### API Endpoints
- `/auth/*` - Authentication
- `/profile/*` - Profile management
- `/matches/*` - Swipe and matching
- `/messages/*` - Messaging
- `/leaderboard` - Rankings

## 📊 Stats

- **500+** Active Students
- **2K+** Matches Made
- **10K+** Messages Sent

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing checklist.

## 📚 Documentation

- [Backend Guide](./BACKEND_GUIDE.md) - Backend architecture and API docs
- [Testing Guide](./TESTING_GUIDE.md) - Full testing checklist

## 🎯 Roadmap

- [ ] Real Spotify API integration
- [ ] Push notifications for matches
- [ ] Real-time messaging with WebSockets
- [ ] Profile picture upload to Supabase Storage
- [ ] Music taste compatibility scoring
- [ ] Advanced search filters
- [ ] User blocking/reporting
- [ ] Profile verification
- [ ] Concert/event matching
- [ ] Playlist sharing

## 🤝 Contributing

This is a prototype for Bennett University students. Feel free to suggest improvements!

## ⚠️ Important Notes

- Currently in demo mode with mock Spotify integration
- Backend uses KV store for data persistence
- Not intended for production use with real PII
- For educational and prototyping purposes

## 📄 License

Made with ❤️ for Bennett University students

## 🙏 Acknowledgments

- Bennett University community
- Unsplash for beautiful images
- shadcn/ui for amazing components
- Supabase for backend infrastructure

---

**Bennett Beats** - Find Your Music Soulmate 🎵
