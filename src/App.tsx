import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { LandingPage } from './components/LandingPage';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ProfileCreationScreen } from './components/ProfileCreationScreen';
import { SwipePoolScreen } from './components/SwipePoolScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { InboxScreen } from './components/InboxScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { TabNavigation } from './components/TabNavigation';
import { InstallPrompt } from './components/InstallPrompt';
import { getAuthToken } from './utils/api';
import { registerServiceWorker, setupInstallPrompt } from './utils/pwa';

type AppState = 'landing' | 'onboarding' | 'profile-creation' | 'main';
type TabState = 'pool' | 'leaderboard' | 'inbox' | 'profile';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [activeTab, setActiveTab] = useState<TabState>('pool');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          onDemoLogin={() => setAppState('main')}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (appState === 'onboarding') {
    return (
      <>
        <OnboardingScreen 
          onComplete={() => setAppState('profile-creation')}
          onBack={() => setAppState('landing')}
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  if (appState === 'profile-creation') {
    return (
      <>
        <ProfileCreationScreen onComplete={() => setAppState('main')} />
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
