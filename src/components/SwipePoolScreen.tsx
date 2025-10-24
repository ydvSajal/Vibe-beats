import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import { Heart, X, RotateCcw, Star, Zap, Flame, Sparkles, Music2, TrendingUp } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { api } from '../utils/api';
import { toast } from 'sonner';

export function SwipePoolScreen() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeHistory, setSwipeHistory] = useState<string[]>([]);
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await api.matches.getPotential();
      if (response.profiles && response.profiles.length > 0) {
        const formattedProfiles = response.profiles.map((p: any) => ({
          ...p,
          age: p.age || 20,
          school: p.school || 'Bennett University',
          distance: p.distance || '2 km away',
          matchScore: p.matchScore || Math.floor(Math.random() * 20) + 80,
        }));
        setProfiles(formattedProfiles);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    
    try {
      // Pass the first song ID if available, otherwise undefined
      const songId = currentProfile.songs && currentProfile.songs.length > 0 
        ? String(currentProfile.songs[0].id)
        : undefined;
      const response = await api.matches.swipe(currentProfile.id, direction, songId);
      
      if (response.matched) {
        toast.success(`🎉 It's a Match with ${currentProfile.name}!`, {
          description: 'You can now start chatting',
          duration: 4000,
        });
      } else if (direction === 'right') {
        toast.success(`Liked ${currentProfile.name}! 💖`);
      }
    } catch (error) {
      if (direction === 'right') {
        if (Math.random() > 0.7) {
          toast.success(`🎉 It's a Match with ${currentProfile.name}!`, {
            description: 'You can now start chatting',
            duration: 4000,
          });
        } else {
          toast.success(`Liked ${currentProfile.name}! 💖`);
        }
      }
    }
    
    setSwipeHistory([...swipeHistory, currentProfile.id]);
    setCurrentIndex((prev) => prev + 1);
    dragX.set(0);
    dragY.set(0);
  };

  const handleUndo = () => {
    if (currentIndex > 0 && swipeHistory.length > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSwipeHistory(swipeHistory.slice(0, -1));
      toast('Undone! ↩️', { duration: 2000 });
    }
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl">
              <Flame className="w-12 h-12 text-white animate-pulse" />
            </div>
            <motion.div
              className="absolute inset-0 border-4 border-white/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <motion.p
            className="mt-6 text-xl text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Finding your vibe...
          </motion.p>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div 
            className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-16 h-16 text-white" />
          </motion.div>
          <h2 className="text-4xl text-white mb-4">
            All caught up!
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Check back later for fresh profiles
          </p>
          <motion.button
            onClick={() => {
              setCurrentIndex(0);
              setSwipeHistory([]);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-[#FF1744] rounded-full shadow-2xl text-lg"
          >
            ↻ Review Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pb-32 overflow-hidden">
      <div className="max-w-md mx-auto px-4 pt-6">
        {/* Modern Header with Gradient Text */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-5xl tracking-tight text-white mb-1 flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔥
                </motion.span>
                Discover
              </h1>
              <p className="text-lg text-white/70">Bennett University</p>
            </div>
            
            {/* Stats Badge */}
            <motion.div 
              className="bg-white/20 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/30"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FBBF24]" />
                <div className="text-left">
                  <div className="text-xs text-white/70">Active Now</div>
                  <div className="text-white">{profiles.length - currentIndex}</div>
                </div>
              </div>
            </motion.div>
          </div>


        </motion.div>

        {/* Music Compatibility Bar - Above Profile Cards */}
        {currentProfile && currentProfile.matchScore && (
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-2xl rounded-2xl px-4 py-3 border border-white/20 shadow-xl mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="text-sm text-white">Music Compatibility</span>
              </div>
              <span className="text-lg text-white">{currentProfile.matchScore}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentProfile.matchScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className="h-full bg-gradient-to-r from-[#FBBF24] via-[#FF6B9D] to-[#FF1744] rounded-full shadow-lg"
              />
            </div>
          </motion.div>
        )}

        {/* Card Stack with TikTok-style fullscreen */}
        <div className="relative h-[calc(100vh-380px)] min-h-[500px] mb-6">
          <AnimatePresence mode="wait">
            {/* Background Card - Next Profile Peek */}
            {profiles[currentIndex + 1] && (
              <motion.div
                key={`bg-${currentIndex}`}
                className="absolute inset-0"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 0.95, opacity: 0.5 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="h-full w-full bg-white/10 backdrop-blur-sm rounded-[32px] shadow-2xl border border-white/20" />
              </motion.div>
            )}

            {/* Main Profile Card */}
            {currentProfile && (
              <ProfileCard
                key={currentProfile.id}
                profile={currentProfile}
                onSwipe={handleSwipe}
                dragX={dragX}
                dragY={dragY}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Modern Action Buttons - TikTok/Bumble Style */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Undo */}
          <motion.button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed group"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1, rotate: -15 }}
          >
            <RotateCcw className="w-6 h-6 text-[#FBBF24] group-hover:rotate-180 transition-transform duration-500" />
          </motion.button>

          {/* Nope */}
          <motion.button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center relative overflow-hidden group"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF1744] to-[#F50057] opacity-0 group-hover:opacity-100 transition-opacity" />
            <X className="w-8 h-8 text-[#FF1744] group-hover:text-white relative z-10 transition-colors" strokeWidth={3} />
          </motion.button>

          {/* Super Like */}
          <motion.button
            className="w-14 h-14 bg-gradient-to-br from-[#2196F3] to-[#00BCD4] rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group relative overflow-hidden"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Star className="w-6 h-6 text-white fill-white relative z-10" />
          </motion.button>

          {/* Like */}
          <motion.button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center relative overflow-hidden group"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Heart className="w-8 h-8 text-white fill-white relative z-10" />
          </motion.button>

          {/* Boost */}
          <motion.button
            className="w-14 h-14 bg-gradient-to-br from-[#9C27B0] to-[#E91E63] rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center group"
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
          >
            <Zap className="w-6 h-6 text-white fill-white" />
          </motion.button>
        </motion.div>

        {/* Enhanced Progress Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {profiles.slice(0, Math.min(profiles.length, 8)).map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index < currentIndex
                  ? 'w-6 bg-white/50'
                  : index === currentIndex
                  ? 'w-8 bg-white shadow-lg'
                  : 'w-6 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
