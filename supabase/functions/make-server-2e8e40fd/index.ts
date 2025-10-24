// @ts-nocheck - This is a Deno Edge Function, TypeScript errors are expected in VS Code
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
  
  // Handle "Bearer <token>" format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Invalid authorization header format');
    return null;
  }
  
  const token = parts[1];
  if (!token) return null;
  
  const supabase = getSupabaseClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.log('Auth error:', error);
      return null;
    }
    
    return user;
  } catch (e) {
    console.log('verifyUser exception:', e);
    return null;
  }
}

// ===== HEALTH CHECK =====
app.get("/make-server-2e8e40fd/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION ROUTES =====

// Auth entry point - unified login/signup endpoint
app.post("/make-server-2e8e40fd/auth/entry", async (c) => {
  try {
    const { action, email, name } = await c.req.json();
    if (!email || !email.includes('@bennett.edu.in')) {
      return c.json({ error: 'Invalid email. Must use @bennett.edu.in' }, 400);
    }

    const supabase = getSupabaseClient();

    if (action === 'login') {
      // Send OTP for login (works for both new and existing users)
      try {
        const clientForAuth = createClient(
          Deno.env.get('SUPABASE_URL') ?? '', 
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );
        
        // Send OTP email using signInWithOtp
        const { data: otpData, error: otpError } = await clientForAuth.auth.signInWithOtp({ 
          email,
          options: {
            shouldCreateUser: true,
            data: {
              name: name || email.split('@')[0], // Use email prefix as default name
            }
          }
        });
        
        if (otpError) {
          console.log('entry.login OTP send error:', otpError);
          return c.json({ 
            error: `Failed to send OTP email: ${otpError.message}`,
            details: otpError.message
          }, 400);
        }

        console.log('OTP sent successfully for login:', email);

        return c.json({ 
          success: true, 
          email: email,
          message: 'OTP sent to your email. Check your inbox and enter the 6-digit code.',
          otpSent: true
        });
      } catch (e) {
        console.log('entry.login exception:', e);
        return c.json({ error: 'Login failed', details: e instanceof Error ? e.message : 'Unknown error' }, 500);
      }
    }

    if (action === 'signup') {
      // Validate required fields
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return c.json({ error: 'Name is required for signup' }, 400);
      }

      try {
        // Check existing user in auth.users first
        const clientForAuth = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
        
        // Check if user exists in public.users
        const { data: existing, error: checkError } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
        
        if (checkError) {
          console.log('entry.signup check existing error:', checkError);
          return c.json({ error: 'Database error checking existing user' }, 500);
        }
        
        if (existing) {
          return c.json({ error: 'A user with this email address has already been registered' }, 400);
        }

        // Step 1: Send OTP email using signInWithOtp
        // This will create an auth user OR send OTP to existing auth user
        const { data: otpData, error: otpError } = await clientForAuth.auth.signInWithOtp({ 
          email,
          options: {
            shouldCreateUser: true,
            data: {
              name: name, // Store name in user metadata
            }
          }
        });
        
        if (otpError) {
          console.log('entry.signup OTP send error:', otpError);
          return c.json({ 
            error: `Failed to send OTP email: ${otpError.message}. Ensure email is configured in Supabase Dashboard → Authentication → Providers → Email.`,
            details: otpError.message
          }, 400);
        }

        console.log('OTP sent successfully for:', email);

        // Return success - we'll create the public.users record after OTP verification
        return c.json({ 
          success: true, 
          email: email,
          name: name,
          message: 'OTP sent to your email. Check your inbox and enter the 6-digit code.',
          otpSent: true
        });
      } catch (e) {
        console.log('entry.signup exception:', e);
        return c.json({ error: 'Signup failed', details: e instanceof Error ? e.message : 'Unknown error' }, 500);
      }
    }

    return c.json({ error: 'Invalid action' }, 400);
  } catch (e) {
    console.log('auth entry exception:', e);
    return c.json({ error: 'Auth entry error' }, 500);
  }
});

// Verify OTP (real implementation using Supabase auth)
app.post("/make-server-2e8e40fd/auth/verify-otp", async (c) => {
  try {
    const { email, otp } = await c.req.json();
    
    if (!email || !otp) {
      return c.json({ error: 'Email and OTP required' }, 400);
    }

    // Create anon client for OTP verification
    const clientForAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify OTP token
    const { data: sessionData, error: verifyError } = await clientForAuth.auth.verifyOtp({
      email,
      token: otp,
      type: 'email', // OTP type for email-based OTP
    });

    if (verifyError || !sessionData.session) {
      console.log('OTP verification error:', verifyError);
      return c.json({ 
        error: 'Invalid or expired OTP',
        details: verifyError?.message
      }, 400);
    }

    // Get authenticated user info from session
    const authUserId = sessionData.user.id;
    const authUserEmail = sessionData.user.email;
    const authUserName = sessionData.user.user_metadata?.name || 'User';

    // Check if user exists in public.users, if not create it
    const supabase = getSupabaseClient();
    const { data: existingUser, error: userLookupError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUserId)
      .maybeSingle();

    let user;
    if (!existingUser) {
      // Create user in public.users table (first time OTP verification)
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUserId,
          email: authUserEmail,
          name: authUserName,
          is_active: true,
          email_confirmed: true
        })
        .select()
        .single();

      if (insertError) {
        console.log('User creation error:', insertError);
        return c.json({ error: 'Failed to create user profile' }, 500);
      }
      user = newUser;
    } else {
      // User already exists, just update email_confirmed flag
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ email_confirmed: true })
        .eq('id', authUserId)
        .select()
        .single();

      if (updateError) {
        console.log('User update error:', updateError);
        user = existingUser; // Use existing user data
      } else {
        user = updatedUser;
      }
    }

    // Return session token and user
    return c.json({
      success: true,
      user: user,
      session: {
        access_token: sessionData.session.access_token,
        refresh_token: sessionData.session.refresh_token,
        expires_in: sessionData.session.expires_in,
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return c.json({ 
      error: 'Failed to verify OTP',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
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
    
    const { 
      bio, 
      avatar_url, 
      photo,
      age, 
      gender, 
      location, 
      musical_genre, 
      favorite_artists,
      name 
    } = await c.req.json();
    
    const supabase = getSupabaseClient();
    
    // Prepare update data (only include fields that are provided)
    const updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (photo !== undefined) updateData.avatar_url = photo; // photo alias for avatar_url
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (location !== undefined) updateData.location = location;
    if (musical_genre !== undefined) updateData.musical_genre = musical_genre;
    if (favorite_artists !== undefined) updateData.favorite_artists = favorite_artists;
    if (name !== undefined) updateData.name = name;
    
    // Update users table
    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.log('Profile update error:', updateError);
      return c.json({ error: updateError.message }, 500);
    }

    // Get or create user profile in user_profiles table
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProfile) {
      // Update existing profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          profile_completed: true,
          profile_picture_url: avatar_url || photo,
          bio: bio || existingProfile.bio,
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.log('User profile update error:', profileError);
      }
    } else {
      // Create new profile
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          profile_completed: true,
          profile_picture_url: avatar_url || photo,
          bio: bio || '',
        });

      if (insertError) {
        console.log('User profile creation error:', insertError);
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

// ===== SPOTIFY ROUTES =====

// Exchange Spotify authorization code for access token
app.post("/make-server-2e8e40fd/spotify/exchange-token", async (c) => {
  try {
    const { code, redirect_uri } = await c.req.json();

    if (!code) {
      return c.json({ error: 'Authorization code required' }, 400);
    }

    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.log('Spotify credentials not configured');
      return c.json({ error: 'Spotify not configured' }, 500);
    }

    // Exchange code for token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirect_uri || '',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('Spotify token exchange error:', error);
      return c.json({ error: 'Failed to exchange code' }, 400);
    }

    const data = await response.json();
    
    return c.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });
  } catch (error) {
    console.log('Spotify exchange error:', error);
    return c.json({ error: 'Failed to exchange token' }, 500);
  }
});

// Refresh Spotify access token
app.post("/make-server-2e8e40fd/spotify/refresh-token", async (c) => {
  try {
    const { refresh_token } = await c.req.json();

    if (!refresh_token) {
      return c.json({ error: 'Refresh token required' }, 400);
    }

    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      return c.json({ error: 'Spotify not configured' }, 500);
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('Spotify refresh error:', error);
      return c.json({ error: 'Failed to refresh token' }, 400);
    }

    const data = await response.json();
    
    return c.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refresh_token,
      expires_in: data.expires_in,
    });
  } catch (error) {
    console.log('Spotify refresh error:', error);
    return c.json({ error: 'Failed to refresh token' }, 500);
  }
});

// Export app
export default app;
