import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ArrowLeft, ArrowRight, Check, Music, User, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface CompleteOnboardingProps {
  onComplete: () => void;
  userName: string;
  userEmail: string;
}

const genres = [
  { name: 'Indie', emoji: '🎸', color: 'from-[#FF1744] to-[#F50057]' },
  { name: 'Pop', emoji: '🎤', color: 'from-[#E91E63] to-[#9C27B0]' },
  { name: 'Rock', emoji: '🤘', color: 'from-[#9C27B0] to-[#673AB7]' },
  { name: 'Hip-Hop', emoji: '🎧', color: 'from-[#3F51B5] to-[#2196F3]' },
  { name: 'EDM', emoji: '🔊', color: 'from-[#00BCD4] to-[#009688]' },
  { name: 'Punjabi', emoji: '🪕', color: 'from-[#4CAF50] to-[#8BC34A]' },
  { name: 'Hindi', emoji: '🎵', color: 'from-[#FF9800] to-[#FF5722]' },
];

export function CompleteOnboarding({ onComplete, userName, userEmail }: CompleteOnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(userName || '');
  const [photo, setPhoto] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [bio, setBio] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Photo selected! ✨');
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length < 3) {
        setSelectedGenres([...selectedGenres, genre]);
      } else {
        toast.error('You can select up to 3 genres');
      }
    }
  };

  const handleComplete = async () => {
    if (selectedGenres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }

    setLoading(true);
    try {
      // Upload photo to Supabase Storage (if photoFile exists)
      let photoUrl = photo;
      if (photoFile) {
        // TODO: Implement actual upload to Supabase Storage
        // For now, use the base64 data URL
        photoUrl = photo;
      }

      // Update user profile
      await api.profile.update({
        name,
        photo: photoUrl,
        bio,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        musical_genre: selectedGenres.join(', '),
      });

      toast.success('Profile completed! 🎉');
      setTimeout(() => onComplete(), 500);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim().length > 0;
      case 2: return photo.length > 0;
      case 3: return bio.trim().length > 0;
      case 4: return age && gender;
      case 5: return selectedGenres.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-white/20 z-50">
        <motion.div
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10 max-w-md mx-auto p-6 pt-16">
        <AnimatePresence mode="wait">
          {/* Step 1: Confirm Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">What's your name?</h2>
                <p className="text-white/70">Let others know who you are</p>
              </div>

              <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border border-white/30">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white text-lg placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                  autoFocus
                />
              </div>

              <motion.button
                onClick={() => setStep(2)}
                disabled={!canProceed()}
                className="w-full py-4 bg-white text-[#FF1744] rounded-2xl font-semibold shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
              >
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Upload Photo */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Add your photo</h2>
                <p className="text-white/70">Show your best side!</p>
              </div>

              <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-8 border border-white/30">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-48 h-48 mx-auto cursor-pointer group"
                >
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white/30"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full rounded-full border-4 border-dashed border-white/30 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-white mx-auto mb-2" />
                        <p className="text-white/70 text-sm">Tap to upload</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-semibold border border-white/30 flex items-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setStep(3)}
                  disabled={!canProceed()}
                  className="flex-1 py-4 bg-white text-[#FF1744] rounded-2xl font-semibold shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Bio */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Tell us about yourself</h2>
                <p className="text-white/70">Share your vibe with others</p>
              </div>

              <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border border-white/30">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Music lover | Always discovering new tracks..."
                  className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 min-h-[150px] resize-none"
                  maxLength={150}
                  autoFocus
                />
                <p className="text-white/60 text-sm mt-2">{bio.length}/150 characters</p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-semibold border border-white/30 flex items-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setStep(4)}
                  disabled={!canProceed()}
                  className="flex-1 py-4 bg-white text-[#FF1744] rounded-2xl font-semibold shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Age & Gender */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Basic info</h2>
                <p className="text-white/70">Help us personalize your experience</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border border-white/30">
                  <label className="text-white/90 mb-2 block">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="18"
                    min="18"
                    max="100"
                    className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>

                <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border border-white/30">
                  <label className="text-white/90 mb-2 block">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          gender === g
                            ? 'bg-white text-[#FF1744] shadow-lg'
                            : 'bg-white/20 text-white border border-white/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setStep(3)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-semibold border border-white/30 flex items-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setStep(5)}
                  disabled={!canProceed()}
                  className="flex-1 py-4 bg-white text-[#FF1744] rounded-2xl font-semibold shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Music Genres */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Pick your vibe</h2>
                <p className="text-white/70">Select up to 3 favorite genres</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {genres.map((genre) => (
                  <motion.button
                    key={genre.name}
                    onClick={() => handleGenreToggle(genre.name)}
                    className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all ${
                      selectedGenres.includes(genre.name)
                        ? 'ring-4 ring-white shadow-2xl'
                        : 'ring-2 ring-white/30'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80`} />
                    <div className="relative z-10">
                      <div className="text-4xl mb-2">{genre.emoji}</div>
                      <div className="text-white font-bold">{genre.name}</div>
                    </div>
                    {selectedGenres.includes(genre.name) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#FF1744]" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setStep(4)}
                  className="px-6 py-4 bg-white/20 backdrop-blur-xl text-white rounded-2xl font-semibold border border-white/30 flex items-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={handleComplete}
                  disabled={loading || !canProceed()}
                  className="flex-1 py-4 bg-white text-[#FF1744] rounded-2xl font-semibold shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-[#FF1744] border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>Complete <Check className="w-5 h-5" /></>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i + 1 === step
                  ? 'w-8 bg-white'
                  : i + 1 < step
                  ? 'w-2 bg-white'
                  : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
