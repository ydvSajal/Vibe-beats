// Mock authentication helper for demo mode
// In production, this would use real Supabase auth

let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
  localStorage.setItem('currentUserId', userId);
};

export const getCurrentUserId = (): string | null => {
  if (!currentUserId) {
    currentUserId = localStorage.getItem('currentUserId');
  }
  return currentUserId;
};

export const clearCurrentUserId = () => {
  currentUserId = null;
  localStorage.removeItem('currentUserId');
};
