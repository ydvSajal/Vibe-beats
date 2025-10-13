import { motion } from 'motion/react';
import { Play, Lock, Edit2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SongCardProps {
  artwork: string;
  title: string;
  artist: string;
  isLocked?: boolean;
  isEditable?: boolean;
  onPlay?: () => void;
  onEdit?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function SongCard({
  artwork,
  title,
  artist,
  isLocked = false,
  isEditable = false,
  onPlay,
  onEdit,
  size = 'medium',
}: SongCardProps) {
  const sizeClasses = {
    small: 'w-32',
    medium: 'w-40',
    large: 'w-48',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} flex-shrink-0`}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square mb-2 group">
        <ImageWithFallback
          src={artwork}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay icons */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
        
        {isEditable && (
          <motion.button
            onClick={onEdit}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
            whileTap={{ scale: 0.9 }}
          >
            <Edit2 className="w-4 h-4 text-[#A855F7]" />
          </motion.button>
        )}
        
        {/* Play button */}
        {!isLocked && onPlay && (
          <motion.button
            onClick={onPlay}
            className="absolute bottom-2 right-2 bg-gradient-to-r from-[#6BCB77] to-[#4D96FF] rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            whileTap={{ scale: 0.9 }}
          >
            <Play className="w-4 h-4 text-white fill-white" />
          </motion.button>
        )}
      </div>
      
      <h4 className="text-[#222222] truncate mb-1">{title}</h4>
      <p className="text-[#555555] text-sm truncate">{artist}</p>
    </motion.div>
  );
}
