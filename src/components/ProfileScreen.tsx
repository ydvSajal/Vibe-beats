import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit2, Settings, Music2, LogOut, Heart, Star, Users, Trophy, ChevronRight, Sparkles, TrendingUp, Camera, Play, Headphones, Award, Flame, Zap, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DarkModeToggle } from './DarkModeToggle';
import { EditProfileScreen } from './EditProfileScreen';
import { InviteFriendsScreen } from './InviteFriendsScreen';
import { AccountSettingsScreen } from './AccountSettingsScreen';
import { PrivacySafetyScreen } from './PrivacySafetyScreen';
import { api, clearAuthToken } from '../utils/api';
import { clearCurrentUserId } from '../utils/mockAuth';
import { toast } from 'sonner@2.0.3';

const myProfile = {
  name: 'You',
  photo: 'https://images.unsplash.com/photo-1655977237812-ee6beb137203?w=400',
  stats: {
    rank: 12,
    rightSwipes: 156,
    category: 'Indie',
  },
  topSongs: [
    {
      id: 1,
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      isLocked: true,
    },
    {
      id: 2,
      artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      title: 'Levitating',
      artist: 'Dua Lipa',
      isLocked: true,
    },
    {
      id: 3,
      artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
    },
    {
      id: 4,
      artwork: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300',
      title: 'Peaches',
      artist: 'Justin Bieber',
    },
    {
      id: 5,
      artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
    },
    {
      id: 6,
      artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300',
      title: 'drivers license',
      artist: 'Olivia Rodrigo',
    },
  ],
};

type SubScreen = 'main' | 'edit' | 'invite' | 'settings' | 'privacy';

export function ProfileScreen() {
  const [profile, setProfile] = useState(myProfile);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<SubScreen>('main');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.auth.getMe();
      if (response.user) {
        setProfile({
          name: response.user.name || 'You',
          photo: response.user.photo || myProfile.photo,
          stats: {
            rank: response.user.stats?.rank || 0,
            rightSwipes: response.user.stats?.rightSwipes || 0,
            category: response.user.stats?.category || 'Indie',
          },
          topSongs: response.user.songs || myProfile.topSongs,
        });
      }
    } catch (error) {
      // Demo mode - use default profile
      console.log('Using demo profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAuthToken();
      clearCurrentUserId();
      toast.success('Logged out successfully');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // Render sub-screens
  if (activeScreen === 'edit') {
    return <EditProfileScreen onBack={() => setActiveScreen('main')} />;
  }
  if (activeScreen === 'invite') {
    return <InviteFriendsScreen onBack={() => setActiveScreen('main')} />;
  }
  if (activeScreen === 'settings') {
    return <AccountSettingsScreen onBack={() => setActiveScreen('main')} />;
  }
  if (activeScreen === 'privacy') {
    return <PrivacySafetyScreen onBack={() => setActiveScreen('main')} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center pb-24">
        <motion.div 
          className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const mainStats = [
    { icon: Trophy, label: 'Rank', value: `#${profile.stats.rank || '—'}`, gradient: 'from-[#FFD700] to-[#FFA500]', emoji: '🏆' },
    { icon: Heart, label: 'Likes', value: profile.stats.rightSwipes, gradient: 'from-[#FF1744] to-[#FF6B9D]', emoji: '💕' },
    { icon: Flame, label: 'Streak', value: '7 days', gradient: 'from-[#FF6B00] to-[#FF1744]', emoji: '🔥' },
    { icon: Music2, label: 'Genre', value: profile.stats.category, gradient: 'from-[#A855F7] to-[#EC4899]', emoji: '🎵' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pb-32 overflow-hidden">
      {/* Header Section with Modern Glass Card */}
      <div className="relative overflow-hidden">
        {/* Static Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-0 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-md mx-auto px-4 pt-6 relative z-10">
          {/* Top Bar - Settings & Logout */}
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl text-white tracking-tight">Profile</h1>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <motion.button
                onClick={() => setActiveScreen('settings')}
                className="w-11 h-11 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 shadow-xl"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-5 h-5 text-white" />
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="w-11 h-11 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 shadow-xl"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <LogOut className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* Profile Card - Glassmorphic Design */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 shadow-2xl overflow-hidden mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Profile Header with Photo */}
            <div className="relative p-8 pb-6">
              {/* Profile Photo */}
              <div className="flex items-start gap-5 mb-6">
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-white/40 rounded-full blur-xl" />
                  
                  {/* Photo Container */}
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                    <ImageWithFallback
                      src={profile.photo}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Premium Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                    className="absolute -bottom-1 -right-1"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-lg border-3 border-white">
                      <Sparkles className="w-4 h-4 text-white fill-white" />
                    </div>
                  </motion.div>

                  {/* Edit Button */}
                  <motion.button
                    onClick={() => setActiveScreen('edit')}
                    className="absolute -top-2 -right-2"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-white/50">
                      <Camera className="w-5 h-5 text-[#FF1744]" />
                    </div>
                  </motion.button>
                </motion.div>

                {/* Name & Info */}
                <div className="flex-1 pt-2">
                  <motion.h2 
                    className="text-3xl text-white mb-1 tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {profile.name}
                  </motion.h2>
                  <motion.p 
                    className="text-white/80 text-sm mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    @bennett.edu.in
                  </motion.p>
                  
                  {/* Status Badge */}
                  <motion.div 
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span className="text-xs text-white">Top {profile.stats.rank}% User</span>
                  </motion.div>
                </div>
              </div>

              {/* Stats Grid - 4 Column */}
              <div className="grid grid-cols-4 gap-3">
                {mainStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.03 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-3 border border-white/20 text-center cursor-pointer group"
                  >
                    <div className="text-2xl mb-1">{stat.emoji}</div>
                    <div className="text-xl text-white mb-0.5">{stat.value}</div>
                    <div className="text-[10px] text-white/70">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Edit Profile Button */}
              <motion.button
                onClick={() => setActiveScreen('edit')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full mt-5 py-3.5 bg-white rounded-2xl flex items-center justify-center gap-2 shadow-xl group"
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
              >
                <Edit2 className="w-4 h-4 text-[#FF1744] group-hover:rotate-12 transition-transform" />
                <span className="text-[#FF1744]">Edit Profile</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Top Songs Section - Modern Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-white">Your Top Songs</h3>
                  <p className="text-xs text-white/60">{profile.topSongs.length} tracks</p>
                </div>
              </div>
              <motion.button 
                onClick={() => setActiveScreen('edit')}
                className="text-sm text-white/90 flex items-center gap-1 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-full border border-white/20"
                whileHover={{ gap: '0.375rem' }}
                whileTap={{ scale: 0.95 }}
              >
                Edit <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Songs Grid - 3 Columns */}
            <div className="grid grid-cols-3 gap-3">
              {profile.topSongs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.03 }}
                  className="relative group cursor-pointer"
                >
                  {/* Song Card */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
                    <ImageWithFallback
                      src={song.artwork}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    {/* Premium Lock Badge */}
                    {song.isLocked && (
                      <div className="absolute top-2 right-2 w-7 h-7 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    )}

                    {/* Track Number */}
                    <div className="absolute top-2 left-2 w-6 h-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white text-xs">{index + 1}</span>
                    </div>

                    {/* Play Button - Shows on Hover */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center border-2 border-white/50 shadow-2xl">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </motion.div>

                    {/* Song Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-[10px] truncate leading-tight mb-0.5">{song.title}</p>
                      <p className="text-white/70 text-[9px] truncate">{song.artist}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Settings Menu Cards */}
          <motion.div 
            className="space-y-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { icon: Users, label: 'Invite Friends', subtitle: 'Share the vibe', gradient: 'from-[#06B6D4] to-[#3B82F6]', screen: 'invite' as SubScreen, emoji: '🎉' },
              { icon: Award, label: 'Account Settings', subtitle: 'Manage your account', gradient: 'from-[#8B5CF6] to-[#EC4899]', screen: 'settings' as SubScreen, emoji: '⚙️' },
              { icon: Heart, label: 'Privacy & Safety', subtitle: 'Control your experience', gradient: 'from-[#FF1744] to-[#FF6B9D]', screen: 'privacy' as SubScreen, emoji: '🔒' },
            ].map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.label}
                  onClick={() => setActiveScreen(option.screen)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + index * 0.03 }}
                  className="w-full bg-white/10 backdrop-blur-2xl rounded-2xl p-4 flex items-center justify-between border border-white/20 shadow-lg group"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon with Gradient */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${option.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-xl">{option.emoji}</span>
                    </div>
                    <div className="text-left">
                      <div className="text-white">{option.label}</div>
                      <div className="text-xs text-white/60">{option.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </motion.button>
              );
            })}
          </motion.div>

          {/* App Version Footer */}
          <motion.div
            className="text-center pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-xs text-white/50">VibeMatch v1.0.0</p>
            <p className="text-[10px] text-white/40 mt-1">Made with 💕 for Bennett University</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
