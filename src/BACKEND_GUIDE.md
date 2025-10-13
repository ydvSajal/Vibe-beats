# Bennett Beats - Backend Integration Guide

## Overview
The app is now connected to Supabase with a full backend implementation using:
- **Database**: Key-Value store for user profiles, matches, messages, and leaderboard
- **Authentication**: Supabase Auth (demo mode for testing)
- **Server**: Hono web server with REST API endpoints

## Backend Architecture

### Data Storage (KV Store)
The app uses a key-value store to manage all data:

- `user:{userId}` - User profile data
- `profiles:all` - Array of all user IDs
- `swipe:{userId}:{targetId}` - Swipe records (left/right)
- `matches:{userId}` - Array of matched user IDs
- `conversation:{conversationId}` - Conversation metadata
- `messages:{conversationId}` - Array of messages

### API Endpoints

#### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/signin` - Sign in (demo mode)
- `GET /auth/me` - Get current user profile

#### Profile Management
- `POST /profile` - Create/update user profile
- `GET /profile/:userId` - Get profile by ID

#### Matching System
- `GET /matches/potential` - Get profiles to swipe on
- `POST /matches/swipe` - Record a swipe (like/pass)
- `GET /matches` - Get all matches

#### Messaging
- `GET /messages/conversations` - Get all conversations
- `GET /messages/:conversationId` - Get messages for a conversation
- `POST /messages/send` - Send a message

#### Leaderboard
- `GET /leaderboard?category={category}` - Get leaderboard (all or by category)

## Features Implemented

### ✅ User Authentication
- Email-based signup with @bennett.edu.in validation
- Demo OTP verification flow
- Session management with local storage
- Logout functionality

### ✅ Profile Creation
- Upload profile photo
- Select top songs (2 locked from Spotify, rest customizable)
- Choose music category (Indie, Pop, Rock, Hip-Hop, EDM)
- Save profile to backend

### ✅ Swipe & Matching
- Load potential matches from backend
- Swipe left (pass) or right (like)
- Automatic match detection when both users like each other
- Match notifications
- Undo functionality

### ✅ Messaging System
- View all conversations
- Send and receive messages
- Locked/unlocked conversation states
- Real-time message updates
- Conversation timestamps

### ✅ Leaderboard
- View rankings by right swipes
- Filter by music category
- Top 3 users with badges (gold, silver, bronze)
- Search functionality
- Live data from backend

### ✅ Profile Management
- View own profile stats
- Display rank, likes, and category
- Show top 10 songs
- Edit profile option
- Logout functionality

## Demo Mode

The app currently runs in demo mode:
- Mock authentication tokens (format: `demo_{userId}`)
- Simulated OTP verification
- Fallback to mock data if backend fails

For production deployment:
1. Set up proper Supabase authentication
2. Implement real OTP via email
3. Add Spotify OAuth integration
4. Set up proper session management
5. Add data validation and sanitization

## Testing the Backend

1. **Create an account**: Use any email ending with @bennett.edu.in
2. **Set up profile**: Choose songs and category
3. **Swipe on profiles**: Like or pass profiles in the pool
4. **Get matches**: When two users like each other
5. **Send messages**: Chat with your matches
6. **Check leaderboard**: See rankings based on likes

## Security Notes

⚠️ **Important**: This is a prototype implementation. For production:
- Use proper JWT authentication
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS only
- Implement proper CORS policies
- Add data encryption for sensitive information
- Set up proper session expiration
- Add protection against XSS and CSRF attacks

## Next Steps

Potential enhancements:
- Real Spotify API integration
- Push notifications for matches
- Real-time messaging with WebSockets
- Profile pictures upload to Supabase Storage
- Music taste compatibility scoring
- Advanced search filters
- User blocking/reporting
- Profile verification
