import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './components/LandingPage';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ProfileCreationScreen } from './components/ProfileCreationScreen';
import { SwipePoolScreen } from './components/SwipePoolScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { InboxScreen } from './components/InboxScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TabNavigation } from './components/TabNavigation';
import { InstallPrompt } from './components/InstallPrompt';
import { getAuthToken, api } from './utils/api';
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa';

type AppState = 'landing' | 'onboarding' | 'profile-creation' | 'main';
type TabState = 'pool' | 'leaderboard' | 'inbox' | 'profile';

function AppContent() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState<TabState>('pool');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Register service worker for PWA functionality
      registerServiceWorker();
      
      // Setup install prompt
      setupInstallPrompt();

      // Check if user is already logged in
      const token = getAuthToken();
      if (token) {
        // User has a token, skip to main app
        // In production, verify the token with the backend
        setAppState('main');
      }
    } catch (error) {
      console.error('Error in AppContent initialization:', error);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl mb-4">
            <div className="text-4xl">🎵</div>
          </div>
          <p className="text-xl text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === 'landing') {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setAppState('onboarding')}
        />
        <InstallPrompt />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (appState === 'onboarding') {
    return (
      <>
        <OnboardingScreen 
          onComplete={() => {
            // Check if user has completed onboarding by looking at localStorage
            // OnboardingScreen already fetches and stores this info
            const userId = localStorage.getItem('userId');
            if (userId) {
              // We need to check if user has musical_genre to determine if they completed onboarding
              // For now, let's check if we can fetch the profile
              api.auth.getMe().then((response) => {
                if (response.success && response.user?.musical_genre) {
                  // User has completed onboarding, go to main app
                  setAppState('main');
                } else {
                  // User needs to complete profile
                  setAppState('profile-creation');
                }
              }).catch(() => {
                // Error or not logged in, go to profile creation
                setAppState('profile-creation');
              });
            } else {
              setAppState('profile-creation');
            }
          }}
          onBack={() => setAppState('landing')}
        />
        <InstallPrompt />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (appState === 'profile-creation') {
    return (
      <>
        <ProfileCreationScreen onComplete={() => setAppState('main')} />
        <InstallPrompt />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        {/* Main Content */}
        {activeTab === 'pool' && <SwipePoolScreen />}
        {activeTab === 'leaderboard' && <LeaderboardScreen />}
        {activeTab === 'inbox' && <InboxScreen />}
        {activeTab === 'profile' && <ProfileScreen />}

        {/* Bottom Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* PWA Install Prompt */}
        <InstallPrompt />
      </div>
      
      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
