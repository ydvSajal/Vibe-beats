import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for auth
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Helper to verify user from token
async function verifyUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.log('Auth error:', error);
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-2e8e40fd/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION ROUTES =====

// Sign up
app.post("/make-server-2e8e40fd/auth/signup", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    if (!email || !email.includes('@bennett.edu.in')) {
      return c.json({ error: 'Invalid email. Must use @bennett.edu.in' }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Create user with a random password (we'll use OTP for login)
    const randomPassword = crypto.randomUUID();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Generate session token for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession(data.user.id);
    
    if (sessionError || !sessionData.session) {
      console.log('Session error:', sessionError);
      return c.json({ error: 'Failed to create session' }, 500);
    }
    
    // Initialize user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      photo: '',
      songs: [],
      stats: {
        rank: 0,
        rightSwipes: 0,
        category: '',
      },
      createdAt: new Date().toISOString(),
    });
    
    // Add to all profiles list
    const allProfiles = await kv.get('profiles:all') || [];
    allProfiles.push(data.user.id);
    await kv.set('profiles:all', allProfiles);
    
    return c.json({ 
      success: true, 
      userId: data.user.id,
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to sign up' }, 500);
  }
});

// Verify OTP (simplified for demo)
app.post("/make-server-2e8e40fd/auth/verify-otp", async (c) => {
  try {
    const { email, otp } = await c.req.json();
    
    // For demo purposes, accept any 6-digit OTP
    if (otp && otp.length === 6) {
      return c.json({ success: true, message: 'OTP verified' });
    }
    
    return c.json({ error: 'Invalid OTP' }, 400);
  } catch (error) {
    console.log('Verify OTP error:', error);
    return c.json({ error: 'Failed to verify OTP' }, 500);
  }
});

// Sign in (using email/password for simplicity)
app.post("/make-server-2e8e40fd/auth/signin", async (c) => {
  try {
    const { email } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    // For demo purposes, we'll use a magic link approach simulation
    // In production, you'd send an actual OTP via email
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: crypto.randomUUID(), // This won't work, just for structure
    });
    
    if (error) {
      // For demo, let's create a session token manually
      // In production, use proper Supabase auth
      return c.json({ 
        success: true, 
        message: 'OTP sent (demo mode)',
        email 
      });
    }
    
    return c.json({ 
      success: true, 
      accessToken: data.session?.access_token 
    });
  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Get current user session
app.get("/make-server-2e8e40fd/auth/me", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const profile = await kv.get(`user:${user.id}`);
    return c.json({ user: profile });
  } catch (error) {
    console.log('Get user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

// ===== PROFILE ROUTES =====

// Create/Update profile
app.post("/make-server-2e8e40fd/profile", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { name, photo, songs, category } = await c.req.json();
    
    const existingProfile = await kv.get(`user:${user.id}`) || {};
    
    const updatedProfile = {
      ...existingProfile,
      id: user.id,
      name: name || existingProfile.name,
      photo: photo || existingProfile.photo,
      songs: songs || existingProfile.songs,
      stats: {
        ...existingProfile.stats,
        category: category || existingProfile.stats?.category,
      },
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`user:${user.id}`, updatedProfile);
    
    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get profile by ID
app.get("/make-server-2e8e40fd/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// ===== SWIPE & MATCHING ROUTES =====

// Get potential matches (profiles to swipe on)
app.get("/make-server-2e8e40fd/matches/potential", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Get all profiles
    const allProfileIds = await kv.get('profiles:all') || [];
    
    // Filter out current user and already swiped profiles
    const potentialMatches = [];
    
    for (const profileId of allProfileIds) {
      if (profileId === user.id) continue;
      
      // Check if already swiped
      const swipe = await kv.get(`swipe:${user.id}:${profileId}`);
      if (swipe) continue;
      
      const profile = await kv.get(`user:${profileId}`);
      if (profile && profile.songs && profile.songs.length > 0) {
        potentialMatches.push(profile);
      }
    }
    
    return c.json({ profiles: potentialMatches });
  } catch (error) {
    console.log('Get potential matches error:', error);
    return c.json({ error: 'Failed to get potential matches' }, 500);
  }
});

// Swipe on a profile
app.post("/make-server-2e8e40fd/matches/swipe", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { targetUserId, direction } = await c.req.json();
    
    // Record the swipe
    await kv.set(`swipe:${user.id}:${targetUserId}`, direction);
    
    let isMatch = false;
    
    if (direction === 'right') {
      // Update target user's right swipe count
      const targetProfile = await kv.get(`user:${targetUserId}`);
      if (targetProfile) {
        targetProfile.stats.rightSwipes = (targetProfile.stats.rightSwipes || 0) + 1;
        await kv.set(`user:${targetUserId}`, targetProfile);
      }
      
      // Check if target user also swiped right on current user
      const reciprocalSwipe = await kv.get(`swipe:${targetUserId}:${user.id}`);
      
      if (reciprocalSwipe === 'right') {
        isMatch = true;
        
        // Create match records
        const userMatches = await kv.get(`matches:${user.id}`) || [];
        const targetMatches = await kv.get(`matches:${targetUserId}`) || [];
        
        userMatches.push(targetUserId);
        targetMatches.push(user.id);
        
        await kv.set(`matches:${user.id}`, userMatches);
        await kv.set(`matches:${targetUserId}`, targetMatches);
        
        // Create conversation
        const conversationId = [user.id, targetUserId].sort().join(':');
        await kv.set(`conversation:${conversationId}`, {
          id: conversationId,
          participants: [user.id, targetUserId],
          createdAt: new Date().toISOString(),
          lastMessage: null,
        });
      }
    }
    
    return c.json({ success: true, isMatch });
  } catch (error) {
    console.log('Swipe error:', error);
    return c.json({ error: 'Failed to process swipe' }, 500);
  }
});

// Get matches
app.get("/make-server-2e8e40fd/matches", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const matchIds = await kv.get(`matches:${user.id}`) || [];
    const matches = [];
    
    for (const matchId of matchIds) {
      const profile = await kv.get(`user:${matchId}`);
      if (profile) {
        matches.push(profile);
      }
    }
    
    return c.json({ matches });
  } catch (error) {
    console.log('Get matches error:', error);
    return c.json({ error: 'Failed to get matches' }, 500);
  }
});

// ===== MESSAGING ROUTES =====

// Get conversations
app.get("/make-server-2e8e40fd/messages/conversations", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const matchIds = await kv.get(`matches:${user.id}`) || [];
    const conversations = [];
    
    for (const matchId of matchIds) {
      const conversationId = [user.id, matchId].sort().join(':');
      const conversation = await kv.get(`conversation:${conversationId}`);
      const messages = await kv.get(`messages:${conversationId}`) || [];
      const otherUser = await kv.get(`user:${matchId}`);
      
      conversations.push({
        id: conversationId,
        otherUser,
        lastMessage: messages.length > 0 ? messages[messages.length - 1] : null,
        messageCount: messages.length,
        isLocked: messages.length === 0,
      });
    }
    
    return c.json({ conversations });
  } catch (error) {
    console.log('Get conversations error:', error);
    return c.json({ error: 'Failed to get conversations' }, 500);
  }
});

// Get messages for a conversation
app.get("/make-server-2e8e40fd/messages/:conversationId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const conversationId = c.req.param('conversationId');
    const messages = await kv.get(`messages:${conversationId}`) || [];
    
    return c.json({ messages });
  } catch (error) {
    console.log('Get messages error:', error);
    return c.json({ error: 'Failed to get messages' }, 500);
  }
});

// Send a message
app.post("/make-server-2e8e40fd/messages/send", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { conversationId, text } = await c.req.json();
    
    const messages = await kv.get(`messages:${conversationId}`) || [];
    
    const newMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: user.id,
      text,
      timestamp: new Date().toISOString(),
    };
    
    messages.push(newMessage);
    await kv.set(`messages:${conversationId}`, messages);
    
    // Update conversation last message
    const conversation = await kv.get(`conversation:${conversationId}`);
    if (conversation) {
      conversation.lastMessage = newMessage;
      await kv.set(`conversation:${conversationId}`, conversation);
    }
    
    return c.json({ success: true, message: newMessage });
  } catch (error) {
    console.log('Send message error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// ===== LEADERBOARD ROUTES =====

// Get leaderboard
app.get("/make-server-2e8e40fd/leaderboard", async (c) => {
  try {
    const category = c.req.query('category') || 'All';
    
    const allProfileIds = await kv.get('profiles:all') || [];
    const profiles = [];
    
    for (const profileId of allProfileIds) {
      const profile = await kv.get(`user:${profileId}`);
      if (profile && profile.songs && profile.songs.length > 0) {
        if (category === 'All' || profile.stats?.category === category) {
          profiles.push(profile);
        }
      }
    }
    
    // Sort by right swipes
    profiles.sort((a, b) => (b.stats?.rightSwipes || 0) - (a.stats?.rightSwipes || 0));
    
    // Add ranks
    profiles.forEach((profile, index) => {
      profile.stats.rank = index + 1;
      // Update rank in storage
      kv.set(`user:${profile.id}`, profile);
    });
    
    return c.json({ leaderboard: profiles });
  } catch (error) {
    console.log('Get leaderboard error:', error);
    return c.json({ error: 'Failed to get leaderboard' }, 500);
  }
});

Deno.serve(app.fetch);
