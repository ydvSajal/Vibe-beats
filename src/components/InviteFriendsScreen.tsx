import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Copy, Users, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InviteFriendsScreenProps {
  onBack: () => void;
}

export function InviteFriendsScreen({ onBack }: InviteFriendsScreenProps) {
  const inviteCode = 'BEATS2025';
  const inviteLink = 'https://bennettbeats.app/invite/BEATS2025';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Bennett Beats',
          text: 'Find your music soulmate on Bennett Beats! Use my invite code: ' + inviteCode,
          url: inviteLink,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
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
          <h1 className="text-xl text-gray-900 dark:text-white">Invite Friends</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Illustration */}
        <motion.div
          className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#A855F7] to-[#EC4899] rounded-full flex items-center justify-center shadow-premium"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Users className="w-16 h-16 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl text-gray-900 dark:text-white mb-3">
            Invite Your Friends
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Share Bennett Beats with your friends and discover music together!
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-card border border-gray-200 dark:border-gray-700">
            <div className="text-3xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent mb-1">
              5
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Friends Invited</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-card border border-gray-200 dark:border-gray-700">
            <div className="text-3xl bg-gradient-to-r from-[#A855F7] to-[#EC4899] bg-clip-text text-transparent mb-1">
              3
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Friends Joined</p>
          </div>
        </div>

        {/* Invite Code */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card border border-gray-200 dark:border-gray-700 mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Invite Code</p>
          <div className="flex items-center justify-between">
            <code className="text-2xl text-gray-900 dark:text-white tracking-wider">
              {inviteCode}
            </code>
            <motion.button
              onClick={handleCopyCode}
              className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Copy className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Invite Link */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-card border border-gray-200 dark:border-gray-700 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Invite Link</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
              {inviteLink}
            </code>
            <motion.button
              onClick={handleCopyLink}
              className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0"
              whileTap={{ scale: 0.9 }}
            >
              <Copy className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <motion.button
            onClick={handleShare}
            className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white rounded-2xl shadow-premium flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            Share Invite Link
          </motion.button>

          <motion.button
            className="w-full py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-card border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-5 h-5" />
            Send via Message
          </motion.button>
        </div>

        {/* Info */}
        <div className="mt-8 bg-gradient-to-br from-[#A855F7]/10 to-[#EC4899]/10 dark:from-[#A855F7]/20 dark:to-[#EC4899]/20 rounded-2xl p-4 border border-[#A855F7]/20">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            💡 <strong>Tip:</strong> When your friends join using your invite code, you both get bonus features!
          </p>
        </div>
      </div>
    </div>
  );
}
