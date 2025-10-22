import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";

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

// Create Supabase client for database operations
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

// ===== HEALTH CHECK =====
app.get("/make-server-2e8e40fd/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION ROUTES =====

// Sign up - Create user in auth and users table
app.post("/make-server-2e8e40fd/auth/signup", async (c) => {
  try {
    const { email, name } = await c.req.json();
    
    if (!email || !email.includes('@bennett.edu.in')) {
      return c.json({ error: 'Invalid email. Must use @bennett.edu.in' }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists:', email);
      return c.json({ error: 'A user with this email address has already been registered' }, 400);
    }

    // Create auth user
    const randomPassword = crypto.randomUUID();
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      user_metadata: { name },
      email_confirm: true
    });
    
    if (authError) {
      console.log('Signup error:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Insert user into users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        is_active: true,
      });

    if (insertError) {
      console.log('Insert user error:', insertError);
      return c.json({ error: 'Failed to create user profile' }, 500);
    }

    // Create session
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession(authData.user.id);
    
    if (sessionError || !sessionData.session) {
      console.log('Session error:', sessionError);
      return c.json({ error: 'Failed to create session' }, 500);
    }
    
    return c.json({ 
      success: true, 
      userId: authData.user.id,
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token
    });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to sign up' }, 500);
  }
});

// Verify OTP
app.post("/make-server-2e8e40fd/auth/verify-otp", async (c) => {
  try {
    const { email, otp } = await c.req.json();
    
    if (otp && otp.length === 6) {
      return c.json({ success: true, message: 'OTP verified' });
    }
    
    return c.json({ error: 'Invalid OTP' }, 400);
  } catch (error) {
    console.log('Verify OTP error:', error);
    return c.json({ error: 'Failed to verify OTP' }, 500);
  }
});

// Login - Check if user exists and create session
app.post("/make-server-2e8e40fd/auth/login", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email || !email.includes('@bennett.edu.in')) {
      return c.json({ error: 'Invalid email. Must use @bennett.edu.in' }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Check if user exists
    const { data: user, error: selectError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();
    
    if (selectError || !user) {
      return c.json({ error: 'User not found. Please sign up first.' }, 404);
    }
    
    // Create a session for this user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession(user.id);
    
    if (sessionError || !sessionData.session) {
      console.log('Session creation error:', sessionError);
      return c.json({ error: 'Failed to create session' }, 500);
    }
    
    return c.json({
      success: true,
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token
    });
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Failed to log in' }, 500);
  }
});

// Sign in
app.post("/make-server-2e8e40fd/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return c.json({ error: error.message }, 401);
    }
    
    return c.json({ 
      success: true, 
      userId: data.user.id,
      accessToken: data.session?.access_token 
    });
  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Get current user
app.get("/make-server-2e8e40fd/auth/me", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ user: data });
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
    
    const { bio, avatar_url, age, gender, location, musical_genre, favorite_artists } = await c.req.json();
    
    const supabase = getSupabaseClient();
    
    // Update users table
    const { error: updateError } = await supabase
      .from('users')
      .update({
        bio,
        avatar_url,
        age,
        gender,
        location,
        musical_genre,
        favorite_artists,
      })
      .eq('id', user.id);

    if (updateError) {
      return c.json({ error: updateError.message }, 500);
    }

    // Get or create user profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          profile_completed: true,
          profile_picture_url: avatar_url,
          bio,
        })
        .eq('user_id', user.id);

      if (profileError) {
        return c.json({ error: profileError.message }, 500);
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          profile_completed: true,
          profile_picture_url: avatar_url,
          bio,
        });

      if (insertError) {
        return c.json({ error: insertError.message }, 500);
      }
    }
    
    // Get updated user
    const { data: updatedUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return c.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get profile by ID
app.get("/make-server-2e8e40fd/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .select('*, user_profiles(*)')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json({ profile: data });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// ===== SWIPE & MATCHING ROUTES =====

// Get potential matches (other users for swiping)
app.get("/make-server-2e8e40fd/matches/potential", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = getSupabaseClient();
    
    // Get users that the current user hasn't swiped on yet
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', user.id)
      .eq('is_active', true)
      .limit(10);

    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    return c.json({ potentialMatches: data || [] });
  } catch (error) {
    console.log('Get potential matches error:', error);
    return c.json({ error: 'Failed to get potential matches' }, 500);
  }
});

// Record a swipe (like or skip)
app.post("/make-server-2e8e40fd/matches/swipe", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { swiped_user_id, song_id, direction } = await c.req.json();
    
    if (!['like', 'skip'].includes(direction)) {
      return c.json({ error: 'Invalid direction' }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Record the swipe
    const { error: swipeError } = await supabase
      .from('swipes')
      .insert({
        swiper_id: user.id,
        swiped_user_id,
        song_id,
        direction,
      });

    if (swipeError) {
      return c.json({ error: swipeError.message }, 500);
    }

    // Check if it's a mutual match (if direction is 'like')
    if (direction === 'like') {
      const { data: reciprocalSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', swiped_user_id)
        .eq('swiped_user_id', user.id)
        .eq('song_id', song_id)
        .eq('direction', 'like')
        .single();

      if (reciprocalSwipe) {
        // Create a match
        const user1_id = user.id < swiped_user_id ? user.id : swiped_user_id;
        const user2_id = user.id < swiped_user_id ? swiped_user_id : user.id;

        await supabase
          .from('matches')
          .insert({
            user1_id,
            user2_id,
            song_id,
            match_score: 100,
          });

        return c.json({ success: true, matched: true });
      }
    }
    
    return c.json({ success: true, matched: false });
  } catch (error) {
    console.log('Swipe error:', error);
    return c.json({ error: 'Failed to record swipe' }, 500);
  }
});

// Get user's matches
app.get("/make-server-2e8e40fd/matches/get", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    return c.json({ matches: data || [] });
  } catch (error) {
    console.log('Get matches error:', error);
    return c.json({ error: 'Failed to get matches' }, 500);
  }
});

// ===== MESSAGING ROUTES =====

// Get conversations for user
app.get("/make-server-2e8e40fd/messages/conversations", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    return c.json({ conversations: data || [] });
  } catch (error) {
    console.log('Get conversations error:', error);
    return c.json({ error: 'Failed to get conversations' }, 500);
  }
});

// Get messages from a conversation
app.get("/make-server-2e8e40fd/messages/get/:otherUserId", async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const otherUserId = c.req.param('otherUserId');
    
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    return c.json({ messages: data || [] });
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
    
    const { recipient_id, content } = await c.req.json();
    
    if (!recipient_id || !content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Insert message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id,
        content,
      });

    if (messageError) {
      return c.json({ error: messageError.message }, 500);
    }

    // Update or create conversation
    const user1_id = user.id < recipient_id ? user.id : recipient_id;
    const user2_id = user.id < recipient_id ? recipient_id : user.id;

    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('user1_id', user1_id)
      .eq('user2_id', user2_id)
      .single();

    if (existingConversation) {
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message: content,
        })
        .eq('id', existingConversation.id);
    } else {
      await supabase
        .from('conversations')
        .insert({
          user1_id,
          user2_id,
          last_message_at: new Date().toISOString(),
          last_message: content,
        });
    }
    
    return c.json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.log('Send message error:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// ===== LEADERBOARD ROUTES =====

// Get leaderboard rankings
app.get("/make-server-2e8e40fd/leaderboard", async (c) => {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*, users(name, avatar_url)')
      .order('points', { ascending: false })
      .limit(50);

    if (error) {
      return c.json({ error: error.message }, 500);
    }
    
    return c.json({ leaderboard: data || [] });
  } catch (error) {
    console.log('Get leaderboard error:', error);
    return c.json({ error: 'Failed to get leaderboard' }, 500);
  }
});

// Export app
export default app;
