import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, UserX, AlertTriangle } from 'lucide-react';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface PrivacySafetyScreenProps {
  onBack: () => void;
}

export function PrivacySafetyScreen({ onBack }: PrivacySafetyScreenProps) {
  const [showProfile, setShowProfile] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  const handleReportIssue = () => {
    toast.success('Report form opened. Our team will review your concern.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </motion.button>
          <h1 className="text-xl text-gray-900 dark:text-white">Privacy & Safety</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Privacy Settings */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Settings
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-900 dark:text-white">Show Profile</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Make your profile visible to others</p>
              </div>
              <Switch
                checked={showProfile}
                onCheckedChange={setShowProfile}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-900 dark:text-white">Show Activity Status</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Let others see when you're active</p>
              </div>
              <Switch
                checked={showActivity}
                onCheckedChange={setShowActivity}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-900 dark:text-white">Incognito Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Browse profiles without being seen</p>
              </div>
              <Switch
                checked={incognitoMode}
                onCheckedChange={setIncognitoMode}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white">Read Receipts</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Show when you've read messages</p>
              </div>
              <Switch
                checked={readReceipts}
                onCheckedChange={setReadReceipts}
              />
            </div>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UserX className="w-5 h-5" />
            Blocked Users
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 p-6 text-center">
            <UserX className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No blocked users</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You haven't blocked anyone yet
            </p>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Data & Privacy
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
            <motion.button
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-gray-900 dark:text-white">Download My Data</span>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </motion.button>

            <motion.button
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-gray-900 dark:text-white">Privacy Policy</span>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </motion.button>

            <motion.button
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-gray-900 dark:text-white">Terms of Service</span>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </motion.button>
          </div>
        </div>

        {/* Safety & Support */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Safety & Support
          </h2>
          
          <div className="space-y-3">
            <motion.button
              onClick={handleReportIssue}
              className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white rounded-2xl shadow-premium flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <AlertTriangle className="w-5 h-5" />
              Report an Issue
            </motion.button>

            <motion.button
              className="w-full py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Shield className="w-5 h-5" />
              Safety Center
            </motion.button>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-br from-[#A855F7]/10 to-[#EC4899]/10 dark:from-[#A855F7]/20 dark:to-[#EC4899]/20 rounded-2xl p-4 border border-[#A855F7]/20">
          <h3 className="text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Safety Tips
          </h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>• Never share personal information too quickly</li>
            <li>• Meet in public places for first dates</li>
            <li>• Trust your instincts</li>
            <li>• Report suspicious behavior immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
