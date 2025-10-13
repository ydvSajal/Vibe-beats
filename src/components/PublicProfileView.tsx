import { motion, AnimatePresence } from 'motion/react';
import { X, Music2, Sparkles, Heart, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
}

interface PublicProfile {
  id: string;
  name: string;
  age?: number;
  photo: string;
  email?: string;
  category: string;
  bio?: string;
  songs: Song[];
  stats: {
    rank: number;
    rightSwipes: number;
    matches?: number;
  };
  matchScore?: number;
}

interface PublicProfileViewProps {
  profile: PublicProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: () => void;
  onPass?: () => void;
  showActions?: boolean;
}

export function PublicProfileView({ 
  profile, 
  isOpen, 
  onClose, 
  onLike, 
  onPass,
  showActions = false 
}: PublicProfileViewProps) {
  if (!profile) return null;

  // Calculate age from email or use default
  const age = profile.age || 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="h-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header with Photo */}
              <div className="relative h-64 bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-800 dark:via-purple-900 dark:to-gray-700">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center z-10 hover:bg-black/50 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Profile Photo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative"
                  >
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                      <ImageWithFallback
                        src={profile.photo}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Match Score Badge */}
                    {profile.matchScore !== undefined && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] rounded-full shadow-lg"
                      >
                        <span className="text-white text-sm">{profile.matchScore}% Match</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Name, Age, Category */}
                  <div className="text-center">
                    <h2 className="text-3xl text-gray-900 dark:text-white mb-1">
                      {profile.name}, {age}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="px-3 py-1 bg-gradient-to-r from-[#FF1744] to-[#FF6B9D] rounded-full">
                        <span className="text-sm text-white">{profile.category}</span>
                      </div>
                      {profile.stats.rank && (
                        <div className="px-3 py-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full">
                          <span className="text-sm text-white">#{profile.stats.rank} on Leaderboard</span>
                        </div>
                      )}
                    </div>
                    {profile.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                        {profile.bio}
                      </p>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-[#FF1744]/10 to-[#FF6B9D]/10 dark:from-[#FF1744]/20 dark:to-[#FF6B9D]/20 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-1">🔥</div>
                      <div className="text-xl text-gray-900 dark:text-white">
                        {profile.stats.rightSwipes || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Likes</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#FFD700]/10 to-[#FFA500]/10 dark:from-[#FFD700]/20 dark:to-[#FFA500]/20 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xl text-gray-900 dark:text-white">
                        #{profile.stats.rank || '--'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Rank</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10 dark:from-[#8B5CF6]/20 dark:to-[#EC4899]/20 rounded-2xl p-4 text-center">
                      <div className="text-2xl mb-1">💬</div>
                      <div className="text-xl text-gray-900 dark:text-white">
                        {profile.stats.matches || 0}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Matches</div>
                    </div>
                  </div>

                  {/* Music Taste Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Music2 className="w-5 h-5 text-[#FF1744] dark:text-[#FF6B9D]" />
                      <h3 className="text-lg text-gray-900 dark:text-white">
                        Music Taste
                      </h3>
                      <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                    </div>

                    {/* Songs Grid - All songs displayed */}
                    <div className="grid grid-cols-2 gap-3">
                      {profile.songs.map((song, index) => (
                        <motion.div
                          key={song.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-3 border border-gray-200/50 dark:border-gray-700/50"
                        >
                          {/* Album Art */}
                          <div className="relative mb-2 rounded-xl overflow-hidden aspect-square bg-gradient-to-br from-[#FF1744]/20 to-[#FF6B9D]/20">
                            {song.artwork ? (
                              <ImageWithFallback
                                src={song.artwork}
                                alt={song.album}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Music2 className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Play Overlay */}
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center group">
                              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-[#FF1744] border-b-[6px] border-b-transparent ml-1" />
                              </div>
                            </div>
                          </div>

                          {/* Song Info */}
                          <div className="text-center">
                            <p className="text-xs text-gray-900 dark:text-white truncate mb-0.5">
                              {song.title}
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {song.artist}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>Bennett University</span>
                    </div>
                    {profile.email && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">{profile.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons (if in swipe mode) */}
              {showActions && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => {
                        onPass?.();
                        onClose();
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-4 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                    >
                      <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">Pass</span>
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        onLike?.();
                        onClose();
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-4 bg-gradient-to-r from-[#FF1744] to-[#FF6B9D] rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-[#FF1744]/30"
                    >
                      <Heart className="w-6 h-6 text-white" />
                      <span className="text-white">Like</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
