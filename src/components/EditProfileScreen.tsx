import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Camera, Trash2, Save, Music2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

interface EditProfileScreenProps {
  onBack: () => void;
}

export function EditProfileScreen({ onBack }: EditProfileScreenProps) {
  const [name, setName] = useState('You');
  const [bio, setBio] = useState('Music lover | Indie enthusiast | Always looking for concert buddies 🎵');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1655977237812-ee6beb137203?w=400');
  const [genre, setGenre] = useState('Indie');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully! 🎉');
      setTimeout(() => onBack(), 500);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const genres = ['Indie', 'Hip-Hop', 'Pop', 'Rock', 'Electronic', 'R&B', 'Jazz', 'EDM', 'Punjabi', 'Haryanvi', 'Hindi'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 pb-32 overflow-hidden">
      {/* Static Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
      </div>

      {/* Header - Glassmorphic */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-2xl border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-lg"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <h1 className="text-xl text-white">Edit Profile</h1>
          <div className="w-11" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 relative z-10">
        {/* Profile Photo Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border border-white/30 shadow-2xl">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-white/40 rounded-full blur-xl" />
              
              {/* Photo Container */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                <ImageWithFallback
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Camera Button */}
              <motion.button
                className="absolute bottom-0 right-0 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-xl border-3 border-[#FF1744]"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, rotate: 15 }}
              >
                <Camera className="w-5 h-5 text-[#FF1744]" />
              </motion.button>

              {/* Delete Button */}
              <motion.button
                className="absolute top-0 right-0 w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </motion.button>
            </div>
            
            <p className="text-center text-sm text-white/70">
              Tap camera icon to change photo
            </p>
          </div>
        </motion.div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 shadow-lg"
          >
            <label className="block text-sm text-white/90 mb-2">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </motion.div>

          {/* Bio Field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 shadow-lg"
          >
            <label className="block text-sm text-white/90 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[100px] resize-none"
              maxLength={150}
            />
            <p className="text-xs text-white/60 mt-2">
              {bio.length}/150 characters
            </p>
          </motion.div>

          {/* Email Field (Read-only) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 shadow-lg"
          >
            <label className="block text-sm text-white/90 mb-2">
              Email
            </label>
            <input
              value="yourname@bennett.edu.in"
              disabled
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white/60"
            />
            <p className="text-xs text-white/50 mt-2">
              Email cannot be changed
            </p>
          </motion.div>

          {/* Genre Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/15 backdrop-blur-2xl rounded-2xl p-5 border border-white/30 shadow-lg"
          >
            <label className="block text-sm text-white/90 mb-3 flex items-center gap-2">
              <Music2 className="w-4 h-4" />
              Favorite Genre
            </label>
            <select 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/40 appearance-none cursor-pointer"
            >
              {genres.map((g) => (
                <option key={g} value={g} className="bg-[#FF1744] text-white">
                  {g}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full py-4 bg-white text-[#FF1744] rounded-2xl shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2 group"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
          >
            {saving ? (
              <motion.div 
                className="w-5 h-5 border-2 border-[#FF1744] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
