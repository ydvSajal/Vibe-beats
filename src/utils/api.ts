import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2e8e40fd`;

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken() || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const api = {
  auth: {
    signup: async (email: string, name: string) => {
      return apiCall('/auth/entry', {
        method: 'POST',
        body: JSON.stringify({ action: 'signup', email, name }),
      });
    },
    
    login: async (email: string) => {
      return apiCall('/auth/entry', {
        method: 'POST',
        body: JSON.stringify({ action: 'login', email }),
      });
    },
    
    verifyOTP: async (email: string, otp: string) => {
      return apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
    },
    
    getMe: async () => {
      return apiCall('/auth/me');
    },
  },

  profile: {
    create: async (data: { 
      name?: string; 
      photo?: string; 
      songs?: any[]; 
      category?: string;
      bio?: string;
      age?: number;
      gender?: string;
      musical_genre?: string;
      avatar_url?: string;
      location?: string;
      favorite_artists?: string[];
    }) => {
      return apiCall('/profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    update: async (data: Partial<{ 
      name: string; 
      photo: string; 
      songs: any[]; 
      category: string;
      bio: string;
      age: number;
      gender: string;
      musical_genre: string;
      avatar_url: string;
      location: string;
      favorite_artists: string[];
    }>) => {
      return apiCall('/profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    get: async (userId: string) => {
      return apiCall(`/profile/${userId}`);
    },
  },

  matches: {
    getPotential: async () => {
      return apiCall('/matches/potential');
    },
    
    swipe: async (swipedUserId: string, direction: 'left' | 'right', songId?: string) => {
      return apiCall('/matches/swipe', {
        method: 'POST',
        body: JSON.stringify({ 
          swiped_user_id: swipedUserId, 
          song_id: songId || null,
          direction: direction === 'left' ? 'skip' : 'like'
        }),
      });
    },
    
    getMatches: async () => {
      return apiCall('/matches/get');
    },
  },

  messages: {
    getConversations: async () => {
      return apiCall('/messages/conversations');
    },
    
    getMessages: async (otherUserId: string) => {
      return apiCall(`/messages/get/${otherUserId}`);
    },
    
    send: async (recipientId: string, content: string) => {
      return apiCall('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ recipient_id: recipientId, content }),
      });
    },
  },

  leaderboard: {
    get: async (category?: string) => {
      const query = category && category !== 'All' ? `?category=${category}` : '';
      return apiCall(`/leaderboard${query}`);
    },
  },
};
