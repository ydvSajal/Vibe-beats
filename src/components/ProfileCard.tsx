import { motion, useTransform } from 'motion/react';
import { Music, MapPin, GraduationCap, Heart, Sparkles, Play, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PublicProfileView } from './PublicProfileView';
import { useState } from 'react';

interface Song {
  id: number;
  artwork: string;
  title: string;
  artist: string;
  isLocked?: boolean;
  isEditable?: boolean;
}

interface Profile {
  id: string;
  name: string;
  age?: number;
  photo: string;
  bio?: string;
  distance?: string;
  school?: string;
  songs: Song[];
  category?: string;
  matchScore?: number;
}

interface ProfileCardProps {
  profile: Profile;
  onSwipe?: (direction: 'left' | 'right') => void;
  dragX?: any;
  dragY?: any;
}

export function ProfileCard({ profile, onSwipe, dragX, dragY }: ProfileCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Create rotation based on drag
  const rotate = dragX ? useTransform(dragX, [-200, 0, 200], [-15, 0, 15]) : 0;
  
  // Create opacity for swipe indicators
  const likeOpacity = dragX ? useTransform(dragX, [0, 100], [0, 1]) : 0;
  const nopeOpacity = dragX ? useTransform(dragX, [-100, 0], [1, 0]) : 0;

  // Convert profile to PublicProfile format
  const publicProfile = {
    id: profile.id,
    name: profile.name,
    age: profile.age || 20,
    photo: profile.photo,
    email: undefined,
    category: profile.category || 'Indie',
    bio: profile.bio,
    songs: profile.songs.map(song => ({
      id: song.id.toString(),
      title: song.title,
      artist: song.artist,
      album: song.title,
      artwork: song.artwork
    })),
    stats: {
      rank: 0,
      rightSwipes: 0,
      matches: 0
    },
    matchScore: profile.matchScore
  };

  return (
    <>
      {/* Public Profile Modal */}
      <PublicProfileView
        profile={publicProfile}
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        onLike={() => onSwipe?.('right')}
        onPass={() => onSwipe?.('left')}
        showActions={true}
      />
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 150) {
          onSwipe?.('right');
        } else if (info.offset.x < -150) {
          onSwipe?.('left');
        }
      }}
      style={{ 
        x: dragX, 
        y: dragY,
        rotate: rotate
      }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div className="relative h-full w-full rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/20">
        {/* Main Image - TikTok Style */}
        <div className="absolute inset-0 bg-black">
          <ImageWithFallback
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          
          {/* Modern Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-50% to-black/90" />
          
          {/* Animated gradient accent */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#FF1744]/20 via-transparent to-[#9C27B0]/20"
            animate={{ 
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Top Section - Category Badge & Info */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20">
          <div className="flex items-start justify-between">
            {/* Category Pill - Modern Design */}
            <motion.div
              className="bg-white/10 backdrop-blur-2xl rounded-full px-5 py-2.5 flex items-center gap-2 border border-white/20 shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <Music className="w-4 h-4 text-white" />
              <span className="text-white">{profile.category || 'Indie'}</span>
            </motion.div>

            {/* Info Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(!showInfo);
              }}
              className="w-11 h-11 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/20 shadow-xl"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <Info className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Section - Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Name and Age - Bold Typography */}
            <div className="flex items-end gap-3 mb-4">
              <motion.h2 
                className="text-5xl text-white drop-shadow-2xl tracking-tight"
                style={{ 
                  textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {profile.name}
              </motion.h2>
              {profile.age && (
                <span className="text-4xl text-white/90 drop-shadow-2xl pb-1">
                  {profile.age}
                </span>
              )}
            </div>

            {/* Location Tags - Pill Style */}
            <div className="flex flex-wrap gap-2 mb-5">
              {profile.school && (
                <motion.div 
                  className="bg-white/15 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-2 border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">{profile.school}</span>
                </motion.div>
              )}
              {profile.distance && (
                <motion.div 
                  className="bg-white/15 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-2 border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">{profile.distance}</span>
                </motion.div>
              )}
            </div>

            {/* Music Preview Section - Horizontal Scroll */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-white" />
                <span className="text-white">Top Tracks</span>
                <span className="text-white/60 text-sm">({profile.songs.length})</span>
              </div>
              
              {/* Horizontal Scrollable Song Grid */}
              <div 
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6"
                style={{ 
                  touchAction: 'pan-x',
                  overscrollBehaviorX: 'contain'
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {profile.songs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex-shrink-0 w-32 group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                      {/* Album Art */}
                      <ImageWithFallback
                        src={song.artwork}
                        alt={song.title}
                        className="w-32 h-32 object-cover"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </motion.div>
                      
                      {/* Song Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="text-white text-sm truncate mb-0.5" style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                          {song.title}
                        </div>
                        <div className="text-white/80 text-xs truncate" style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                          {song.artist}
                        </div>
                      </div>

                      {/* Track Number Badge */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                        <span className="text-white text-xs">{index + 1}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Swipe Indicators - Modern Style */}
        {dragX && (
          <>
            {/* LIKE Indicator */}
            <motion.div
              className="absolute top-1/4 right-12 pointer-events-none"
              style={{ opacity: likeOpacity }}
            >
              <motion.div
                className="bg-gradient-to-br from-[#10B981] to-[#34D399] px-8 py-4 rounded-3xl rotate-12 shadow-2xl border-4 border-white"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [12, 15, 12]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-white fill-white" />
                  <span className="text-3xl text-white" style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>LIKE</span>
                </div>
              </motion.div>
            </motion.div>

            {/* NOPE Indicator */}
            <motion.div
              className="absolute top-1/4 left-12 pointer-events-none"
              style={{ opacity: nopeOpacity }}
            >
              <motion.div
                className="bg-gradient-to-br from-[#FF1744] to-[#F50057] px-8 py-4 rounded-3xl -rotate-12 shadow-2xl border-4 border-white"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [-12, -15, -12]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <span className="text-3xl text-white" style={{
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>NOPE</span>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
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
      </div>
    </motion.div>
    </>
  );
}
