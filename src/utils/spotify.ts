/**
 * Spotify Integration Utilities
 * Handles OAuth flow, token management, and fetching user's top tracks
 */

// Safe project ID - will always be defined
const SUPABASE_PROJECT_ID = 'ezovnklmvqqfiojjvmel';

// Client ID - can be undefined during dev (use import.meta.env for Vite)
const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';

// Redirect URI - safe to define
const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 
  (typeof window !== 'undefined' ? `${window.location.origin}/callback` : 'http://localhost:5173/callback');

const SPOTIFY_SCOPES = ['user-read-private', 'user-read-email', 'user-top-read', 'user-read-recently-played'];

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  image: string;
  url: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
  }>;
}

/**
 * Start Spotify OAuth flow
 */
export const initiateSpotifyAuth = () => {
  if (!SPOTIFY_CLIENT_ID) {
    console.error('Spotify Client ID not configured');
    return false;
  }

  const state = generateRandomString(16);
  sessionStorage.setItem('spotify_auth_state', state);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SPOTIFY_SCOPES.join(' '),
    state,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  return true;
};

/**
 * Exchange authorization code for access token
 * Note: This should be done on your backend for security (don't expose client secret to frontend)
 */
export const exchangeCodeForToken = async (code: string, state: string): Promise<string | null> => {
  const savedState = sessionStorage.getItem('spotify_auth_state');
  
  if (state !== savedState) {
    console.error('State mismatch - possible CSRF attack');
    return null;
  }

  try {
    // Call your backend to exchange the code via Supabase function
    const response = await fetch(
      `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-2e8e40fd/spotify/exchange-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: SPOTIFY_REDIRECT_URI }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to exchange code');
    }

    const data = await response.json();
    
    // Store tokens
    localStorage.setItem('spotify_access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
    }
    if (data.expires_in) {
      const expiresAt = Date.now() + data.expires_in * 1000;
      localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
    }

    return data.access_token;
  } catch (error) {
    console.error('Token exchange error:', error);
    return null;
  }
};

/**
 * Get current Spotify access token, refresh if needed
 */
export const getSpotifyAccessToken = async (): Promise<string | null> => {
  const token = localStorage.getItem('spotify_access_token');
  const expiresAt = localStorage.getItem('spotify_token_expires_at');

  if (!token) {
    return null;
  }

  // Check if token is expired
  if (expiresAt && Date.now() > parseInt(expiresAt)) {
    return refreshSpotifyToken();
  }

  return token;
};

/**
 * Refresh Spotify access token
 */
export const refreshSpotifyToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  
  if (!refreshToken) {
    return null;
  }

  try {
    // Call your backend to refresh the token via Supabase function
    const response = await fetch(
      `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-2e8e40fd/spotify/refresh-token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    localStorage.setItem('spotify_access_token', data.access_token);
    if (data.expires_in) {
      const expiresAt = Date.now() + data.expires_in * 1000;
      localStorage.setItem('spotify_token_expires_at', expiresAt.toString());
    }

    return data.access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    return null;
  }
};

/**
 * Fetch user's Spotify profile
 */
export const getSpotifyUser = async (): Promise<SpotifyUser | null> => {
  const token = await getSpotifyAccessToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Spotify user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Spotify user:', error);
    return null;
  }
};

/**
 * Fetch user's top tracks from Spotify
 */
export const getSpotifyTopTracks = async (limit: number = 10): Promise<SpotifyTrack[]> => {
  const token = await getSpotifyAccessToken();
  
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=medium_term`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();
    
    return data.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      image: track.album.images[0]?.url || '',
      url: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
};

/**
 * Fetch user's recently played tracks
 */
export const getSpotifyRecentTracks = async (limit: number = 10): Promise<SpotifyTrack[]> => {
  const token = await getSpotifyAccessToken();
  
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently_played?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch recently played');
    }

    const data = await response.json();
    
    return data.items.map((item: any) => {
      const track = item.track;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        image: track.album.images[0]?.url || '',
        url: track.external_urls.spotify,
      };
    });
  } catch (error) {
    console.error('Error fetching recently played:', error);
    return [];
  }
};

/**
 * Check if user is authenticated with Spotify
 */
export const isSpotifyConnected = (): boolean => {
  return !!localStorage.getItem('spotify_access_token');
};

/**
 * Disconnect Spotify
 */
export const disconnectSpotify = (): void => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expires_at');
  sessionStorage.removeItem('spotify_auth_state');
};

/**
 * Generate random string for OAuth state
 */
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
