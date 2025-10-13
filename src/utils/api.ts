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
      return apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, name }),
      });
    },
    
    verifyOTP: async (email: string, otp: string) => {
      return apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
    },
    
    signin: async (email: string) => {
      return apiCall('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    
    getMe: async () => {
      return apiCall('/auth/me');
    },
  },

  profile: {
    create: async (data: { name: string; photo: string; songs: any[]; category: string }) => {
      return apiCall('/profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    update: async (data: Partial<{ name: string; photo: string; songs: any[]; category: string }>) => {
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
    
    swipe: async (targetUserId: string, direction: 'left' | 'right') => {
      return apiCall('/matches/swipe', {
        method: 'POST',
        body: JSON.stringify({ targetUserId, direction }),
      });
    },
    
    getMatches: async () => {
      return apiCall('/matches');
    },
  },

  messages: {
    getConversations: async () => {
      return apiCall('/messages/conversations');
    },
    
    getMessages: async (conversationId: string) => {
      return apiCall(`/messages/${conversationId}`);
    },
    
    send: async (conversationId: string, text: string) => {
      return apiCall('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ conversationId, text }),
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
