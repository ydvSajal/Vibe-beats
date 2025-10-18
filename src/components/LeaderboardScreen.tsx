import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trophy, Crown, Medal, Star, TrendingUp, Sparkles, Heart, MessageCircle, ChevronRight, Zap, Award, Flame, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicProfileView } from './PublicProfileView';
import { Badge } from './ui/badge';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface LeaderboardUser {
  id: string;
  name: string;
  photo: string;
  rightSwipes: number;
  category: string;
  rank: number;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Arjun Kumar',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    rightSwipes: 432,
    category: 'Hip-Hop',
    rank: 1,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rightSwipes: 398,
    category: 'Indie',
    rank: 2,
  },
  {
    id: '3',
    name: 'Rahul Singh',
    photo: 'https://images.unsplash.com/photo-1577434818789-bffe036a0024?w=400',
    rightSwipes: 375,
    category: 'Rock',
    rank: 3,
  },
  {
    id: '4',
    name: 'Ananya Patel',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    rightSwipes: 324,
    category: 'Pop',
    rank: 4,
  },
  {
    id: '5',
    name: 'Vikram Shah',
    photo: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400',
    rightSwipes: 289,
    category: 'EDM',
    rank: 5,
  },
  {
    id: '6',
    name: 'Simran Kaur',
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    rightSwipes: 267,
    category: 'Punjabi',
    rank: 6,
  },
  {
    id: '7',
    name: 'Rohit Choudhary',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    rightSwipes: 245,
    category: 'Haryanvi',
    rank: 7,
  },
  {
    id: '8',
    name: 'Neha Verma',
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    rightSwipes: 221,
    category: 'Hindi',
    rank: 8,
  },
];

const categories = ['All', 'Indie', 'Rock', 'Pop', 'Hip-Hop', 'EDM', 'Jazz', 'Punjabi', 'Haryanvi', 'Hindi'];

export function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showProfileView, setShowProfileView] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCategory]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await api.leaderboard.get(selectedCategory === 'All' ? undefined : selectedCategory);
      
      if (response.leaderboard && response.leaderboard.length > 0) {
        const formattedData = response.leaderboard.map((user: any) => ({
          id: user.id,
          name: user.name,
          photo: user.photo || 'https://images.unsplash.com/photo-1655977237812-ee6beb137203?w=400',
          rightSwipes: user.stats?.rightSwipes || 0,
          category: user.stats?.category || 'Pop',
          rank: user.stats?.rank || 0,
        }));
        setLeaderboard(formattedData);
      } else {
        setLeaderboard(mockLeaderboard);
      }
    } catch (error) {
      // Demo mode - use mock data
      console.log('Using demo leaderboard');
      setLeaderboard(mockLeaderboard);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-[#FFD700] via-[#FFA500] to-[#FF8C00]';
      case 2:
        return 'from-[#E8E8E8] via-[#C0C0C0] to-[#A8A8A8]';
      case 3:
        return 'from-[#CD7F32] via-[#B8860B] to-[#8B4513]';
      default:
        return 'from-[#FF1744] to-[#FF6B9D]';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return Crown;
      case 2:
        return Medal;
      case 3:
        return Medal;
      default:
        return Star;
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '👑';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  };

  // Convert LeaderboardUser to PublicProfile format
  const convertToPublicProfile = (user: LeaderboardUser) => ({
    id: user.id,
    name: user.name,
    age: 20,
    photo: user.photo,
    email: undefined,
    category: user.category,
    bio: `Music lover and ${user.category} enthusiast at Bennett University`,
    songs: [
      { id: '1', title: 'Favorite Song 1', artist: 'Artist 1', album: 'Album 1', artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200' },
      { id: '2', title: 'Favorite Song 2', artist: 'Artist 2', album: 'Album 2', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
      { id: '3', title: 'Favorite Song 3', artist: 'Artist 3', album: 'Album 3', artwork: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200' },
      { id: '4', title: 'Favorite Song 4', artist: 'Artist 4', album: 'Album 4', artwork: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=200' },
      { id: '5', title: 'Favorite Song 5', artist: 'Artist 5', album: 'Album 5', artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200' },
      { id: '6', title: 'Favorite Song 6', artist: 'Artist 6', album: 'Album 6', artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200' },
      { id: '7', title: 'Favorite Song 7', artist: 'Artist 7', album: 'Album 7', artwork: 'https://images.unsplash.com/photo-1415886541506-6efc5e4b1786?w=200' },
      { id: '8', title: 'Favorite Song 8', artist: 'Artist 8', album: 'Album 8', artwork: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200' },
      { id: '9', title: 'Favorite Song 9', artist: 'Artist 9', album: 'Album 9', artwork: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=200' },
      { id: '10', title: 'Favorite Song 10', artist: 'Artist 10', album: 'Album 10', artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200' },
    ],
    stats: {
      rank: user.rank,
      rightSwipes: user.rightSwipes,
      matches: Math.floor(user.rightSwipes * 0.3)
    },
    matchScore: undefined
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pb-32 overflow-hidden">
      {/* Public Profile Modal */}
      {selectedProfile && (
        <PublicProfileView
          profile={convertToPublicProfile(selectedProfile)}
          isOpen={showProfileView}
          onClose={() => {
            setShowProfileView(false);
            setSelectedProfile(null);
          }}
          showActions={false}
        />
      )}

      {/* Static Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute top-60 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl text-white tracking-tight flex items-center gap-3">
                <span>🏆</span>
                Leaderboard
              </h1>
              <p className="text-lg text-white/70 mt-1">Top music lovers at Bennett</p>
            </div>
            
            {/* Trophy Badge */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-2xl flex items-center justify-center shadow-2xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Search Bar - Glassmorphic */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl focus:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all text-white placeholder:text-white/50"
            />
          </div>
        </motion.div>

        {/* Category Filters - Horizontal Scroll */}
        <motion.div
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-5 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain'
          }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              disabled={loading}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all disabled:opacity-50 ${
                selectedCategory === category
                  ? 'bg-white text-[#FF1744] shadow-xl'
                  : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
              }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: selectedCategory === category ? 1 : 1.05 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {loading && (
          <div className="text-center py-16">
            <motion.div 
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {!loading && (
          <div className="space-y-3">
            {/* Top 3 - Premium Cards */}
            {filteredLeaderboard.slice(0, 3).map((user, index) => {
              const Icon = getRankIcon(user.rank);
              const gradient = getRankGradient(user.rank);
              const emoji = getRankEmoji(user.rank);
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-pointer"
                >
                  {/* Glow effect for rank 1 */}
                  {user.rank === 1 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/30 to-[#FFA500]/30 rounded-3xl blur-2xl animate-pulse" />
                  )}
                  
                  <div className="relative bg-white/15 backdrop-blur-2xl rounded-3xl p-5 border border-white/30 overflow-hidden shadow-2xl">
                    {/* Rank Badge - Top Right */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg text-2xl`}>
                        {emoji}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Large Rank Number */}
                      <div className="relative flex-shrink-0">
                        <div className={`text-6xl bg-gradient-to-br ${gradient} bg-clip-text text-transparent opacity-40`}>
                          {user.rank}
                        </div>
                      </div>

                      {/* Profile Photo with Gradient Ring */}
                      <div className="relative flex-shrink-0">
                        {/* Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-xl opacity-50`} />
                        
                        {/* Photo Container */}
                        <div className={`relative w-20 h-20 p-[3px] bg-gradient-to-br ${gradient} rounded-full shadow-xl`}>
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/30">
                            <ImageWithFallback
                              src={user.photo}
                              alt={user.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        
                        {/* Online Indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white shadow-lg" />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl text-white truncate">{user.name}</h3>
                          
                          {/* Info Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProfile(user);
                              setShowProfileView(true);
                            }}
                            className="w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Info className="w-3.5 h-3.5 text-white" />
                          </motion.button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                            <span className="text-xs text-white">{user.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-white/80">
                          <Heart className="w-4 h-4 fill-white/80" />
                          <span className="text-sm">{user.rightSwipes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Rest of Leaderboard - Compact Cards */}
            {filteredLeaderboard.slice(3).map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.02 }}
                className="bg-white/10 backdrop-blur-2xl rounded-2xl p-4 border border-white/20 shadow-lg flex items-center gap-4 group"
              >
                {/* Rank Number */}
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white">{user.rank}</span>
                </div>

                {/* Photo */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
                  <ImageWithFallback
                    src={user.photo}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white truncate">{user.name}</h4>
                  <p className="text-xs text-white/60">{user.category}</p>
                </div>

                {/* Likes */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 py-2 rounded-full border border-white/20">
                    <Heart className="w-4 h-4 text-white fill-white" />
                    <span className="text-sm text-white">{user.rightSwipes}</span>
                  </div>
                  
                  {/* Info Button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfile(user);
                      setShowProfileView(true);
                    }}
                    className="w-8 h-8 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Info className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
