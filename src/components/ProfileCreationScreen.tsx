import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Music, Sparkles, Check, Flame } from 'lucide-react';
import { SongCard } from './SongCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase/client';

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
  const [loadingSpotify, setLoadingSpotify] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Removed auto-load Spotify on mount to prevent breaking the app

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not found. Please log in again.');
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setProfilePhoto(publicUrl);
      toast.success('Profile photo uploaded! 📸');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleConnectSpotify = async () => {
    try {
      setLoadingSpotify(true);
      
      // Lazy load Spotify module only when needed
      const spotifyModule = await import('../utils/spotify');
      
      if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID) {
        toast.error('Spotify Client ID not configured. Contact admin.');
        return;
      }
      
      // Initiate Spotify OAuth flow
      spotifyModule.initiateSpotifyAuth();
    } catch (error) {
      console.error('Spotify connection error:', error);
      toast.error('Failed to connect to Spotify. Please try again.');
      setLoadingSpotify(false);
    }
  };

  const handleSaveProfile = async () => {
    const userName = localStorage.getItem('userName') || 'User';
    const userId = localStorage.getItem('userId');
    
    if (!userName) {
      toast.error('User name not found. Please go through signup again.');
      return;
    }

    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    setLoading(true);
    try {
      // Prepare profile data
      const profileData: any = {
        name: userName,
        photo: profilePhoto,
        musical_genre: selectedCategory,
      };

      // Add Spotify songs if connected (future enhancement)
      // For now, we'll save without top_songs unless Spotify is connected
      
      const response = await api.profile.update(profileData);
      
      if (response.success) {
        // Update localStorage with profile data
        localStorage.setItem('userPhoto', profilePhoto);
        localStorage.setItem('userGenre', selectedCategory);
        
        toast.success('Profile created! 🎉');
        setTimeout(() => {
          onComplete();
        }, 500);
      } else {
        toast.error(response.error || 'Failed to create profile');
      }
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <motion.div
              className="relative cursor-pointer"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleImageClick}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 border-4 border-white/30 shadow-2xl backdrop-blur-xl">
                {uploadingImage ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#FF1744]/20">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ImageWithFallback
                    src={profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
                className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-[#FF1744] hover:scale-110 transition-transform"
              >
                <Camera className="w-6 h-6 text-[#FF1744]" />
              </button>
            </motion.div>
          </div>

          {/* Connect Spotify */}
          <motion.button
            onClick={handleConnectSpotify}
            disabled={loadingSpotify}
            className="w-full py-5 bg-white text-[#FF1744] rounded-2xl shadow-2xl mb-8 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Music className="w-6 h-6" />
            <span>{connected ? 'Spotify Connected ✓' : 'Connect Spotify (Optional)'}</span>
            <Sparkles className="w-5 h-5" />
          </motion.button>

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
                  transition={{ delay: index * 0.05 }}
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
      </div>
    </div>
  );
}
