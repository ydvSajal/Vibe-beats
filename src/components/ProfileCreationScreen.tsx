import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Music, Sparkles, Check, Flame } from 'lucide-react';
import { SongCard } from './SongCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface ProfileCreationScreenProps {
  onComplete: () => void;
}

const categories = [
  { name: 'Indie', emoji: '🎸', gradient: 'from-[#FF1744] to-[#F50057]' },
  { name: 'Pop', emoji: '🎤', gradient: 'from-[#E91E63] to-[#9C27B0]' },
  { name: 'Rock', emoji: '🤘', gradient: 'from-[#9C27B0] to-[#673AB7]' },
  { name: 'Hip-Hop', emoji: '🎧', gradient: 'from-[#3F51B5] to-[#2196F3]' },
  { name: 'EDM', emoji: '🔊', gradient: 'from-[#00BCD4] to-[#009688]' },
  { name: 'Punjabi', emoji: '🪕', gradient: 'from-[#4CAF50] to-[#8BC34A]' },
  { name: 'Haryanvi', emoji: '🥁', gradient: 'from-[#CDDC39] to-[#FFC107]' },
  { name: 'Hindi', emoji: '🎵', gradient: 'from-[#FF9800] to-[#FF5722]' },
];

export function ProfileCreationScreen({ onComplete }: ProfileCreationScreenProps) {
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1655977237812-ee6beb137203?w=400');
  const [connected, setConnected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Indie');
  const [loading, setLoading] = useState(false);
  const [userSongs, setUserSongs] = useState<any[]>([]);

  const handleConnectSpotify = async () => {
    try {
      // In production, this would initiate Spotify OAuth flow
      // For now, we'll just set connected to true
      // Backend would handle fetching Spotify top tracks
      setConnected(true);
      toast.success('Connected to Spotify! 🎵');
      
      // TODO: Implement actual Spotify integration
      // For now, require users to have tracks in their profile via backend
      toast.info('Your Spotify tracks will be synced from your account');
    } catch (error) {
      console.error('Spotify connection error:', error);
      toast.error('Failed to connect to Spotify. Please try again.');
      setConnected(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await api.profile.create({
        name: 'User',
        photo: profilePhoto,
        songs: userSongs,
        category: selectedCategory,
      });
      
      toast.success('Profile created! 🎉');
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-5xl text-white mb-3">Set Up Profile</h1>
            <p className="text-xl text-white/80">
              Show off your music taste
            </p>
          </div>

          {/* Profile Photo Upload */}
          <div className="flex justify-center mb-10">
            <motion.div
              className="relative"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/30 shadow-2xl backdrop-blur-xl">
                <ImageWithFallback
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#FF1744]">
                <Camera className="w-6 h-6 text-[#FF1744]" />
              </button>
            </motion.div>
          </div>

          {/* Connect Spotify */}
          {!connected ? (
            <motion.button
              onClick={handleConnectSpotify}
              className="w-full py-5 bg-white text-[#FF1744] rounded-2xl shadow-2xl mb-8 flex items-center justify-center gap-3 text-lg"
              whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Music className="w-6 h-6" />
              <span>Connect Spotify</span>
              <Sparkles className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Success Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 flex items-center gap-3 mb-8 shadow-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white text-lg">Spotify Connected</div>
                  <div className="text-white/70 text-sm">Your top tracks loaded</div>
                </div>
              </motion.div>

              {/* Song Cards */}
              <div className="mb-8">
                <h3 className="text-white text-xl mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Your Top Tracks
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                  {userSongs.length > 0 ? userSongs.map((song, index) => (
                    <motion.div
                      key={song.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SongCard
                        artwork={song.artwork}
                        title={song.title}
                        artist={song.artist}
                        isLocked={song.isLocked}
                        isEditable={song.isEditable}
                        size="medium"
                      />
                    </motion.div>
                  )) : (
                    <div className="text-white/70 text-center w-full py-8">
                      No songs loaded. Try reconnecting to Spotify.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 mb-8">
                <p className="text-sm text-white/90 text-center">
                  🔒 First 2 songs are from your Spotify top tracks
                  <br />
                  ✏️ Customize the rest to match your vibe!
                </p>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <h4 className="text-white text-xl mb-4 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Choose Your Main Genre
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className={`p-4 rounded-2xl transition-all border-2 ${
                        selectedCategory === category.name
                          ? 'bg-white border-white shadow-2xl'
                          : 'bg-white/10 backdrop-blur-xl border-white/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`text-3xl mb-2 ${
                        selectedCategory === category.name ? 'scale-125' : ''
                      } transition-transform`}>
                        {category.emoji}
                      </div>
                      <div className={`text-sm ${
                        selectedCategory === category.name
                          ? 'text-[#FF1744]'
                          : 'text-white'
                      }`}>
                        {category.name}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Save Profile Button */}
              <motion.button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-full py-5 bg-white text-[#FF1744] rounded-2xl shadow-2xl disabled:opacity-50 text-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    <span>Complete Profile</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
