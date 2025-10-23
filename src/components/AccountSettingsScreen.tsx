import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, Eye, EyeOff, Mail, Smartphone, Trash2, AlertCircle } from 'lucide-react';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface AccountSettingsScreenProps {
  onBack: () => void;
}

export function AccountSettingsScreen({ onBack }: AccountSettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [matchNotifs, setMatchNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion requested. You will receive a confirmation email.');
    }
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
          <h1 className="text-xl text-gray-900 dark:text-white">Account Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-900 dark:text-white">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                aria-label="Push Notifications"
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get updates via email</p>
              </div>
              <Switch
                checked={emailNotifs}
                onCheckedChange={setEmailNotifs}
                aria-label="Email Notifications"
                disabled={!notifications}
              />
            </div>

            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-900 dark:text-white">New Matches</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notify when you get a match</p>
              </div>
              <Switch
                checked={matchNotifs}
                onCheckedChange={setMatchNotifs}
                aria-label="New Matches"
                disabled={!notifications}
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-white">Messages</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notify for new messages</p>
              </div>
              <Switch
                checked={messageNotifs}
                onCheckedChange={setMessageNotifs}
                aria-label="Messages"
                disabled={!notifications}
              />
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Account Information
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 p-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
              <p className="text-gray-900 dark:text-white">yourname@bennett.edu.in</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
              <p className="text-gray-900 dark:text-white">+91 98765 43210</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
              <p className="text-gray-900 dark:text-white">January 2025</p>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Connected Accounts
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">Spotify</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connected</p>
                </div>
              </div>
              <button className="text-sm text-[#A855F7] hover:underline">
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-6">
          <h2 className="text-lg text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </h2>
          
          <motion.button
            onClick={handleDeleteAccount}
            className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border-2 border-red-200 dark:border-red-800 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </motion.button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            This action is permanent and cannot be undone
          </p>
        </div>
      </div>
    </div>
  );
}
