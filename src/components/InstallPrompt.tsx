import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone } from 'lucide-react';
import { promptInstall, canInstall, isPWA } from '../utils/pwa';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Skip in Figma preview or development
    if (window.location.hostname.includes('figma') || window.location.hostname === 'localhost') {
      return;
    }

    // Check if already installed or dismissed
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isPWA() || isDismissed) {
      return;
    }

    // Listen for install availability
    const handleInstallAvailable = () => {
      if (canInstall()) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-24 left-4 right-4 z-50 max-w-md mx-auto"
      >
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/5 to-[#EC4899]/5" />
          
          {/* Content */}
          <div className="relative p-5">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <h3 className="text-lg text-gray-900 dark:text-white mb-1">
                  Install TuneMatch
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get the full app experience! Install TuneMatch on your device for faster access and offline support.
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleInstall}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] rounded-xl text-white flex items-center justify-center gap-2 shadow-lg shadow-[#A855F7]/25"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Install</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDismiss}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 text-sm"
                  >
                    Not now
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">⚡ Fast</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">📱 Native Feel</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">🔔 Notifications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
