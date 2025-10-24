import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Sparkles, Check } from 'lucide-react';
import { OTPInput } from './OTPInput';
import { api, setAuthToken } from '../utils/api';
import { toast } from 'sonner';

interface OnboardingScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function OnboardingScreen({ onComplete, onBack }: OnboardingScreenProps) {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.includes('@bennett.edu.in')) {
      toast.error('Please use your @bennett.edu.in email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.login(email);
      
      if (response.success) {
        toast.success('OTP sent to your email! Check your inbox.');
        setShowOTP(true);
      } else {
        toast.error(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    try {
      const response = await api.auth.verifyOTP(email, otp);
      
      if (response.success) {
        const authToken = response.session?.access_token || `auth_${response.user?.id}_${Date.now()}`;
        setAuthToken(authToken);
        localStorage.setItem('userId', response.user?.id || '');
        localStorage.setItem('userName', response.user?.name || '');
        localStorage.setItem('userEmail', email);
        
        const hasCompletedOnboarding = response.user?.musical_genre;
        
        if (hasCompletedOnboarding) {
          toast.success('Welcome back! 🎉');
        } else {
          toast.success('OTP verified! Complete your profile.');
        }
        
        onComplete();
      } else {
        toast.error(response.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 overflow-hidden">
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

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="p-6">
          {onBack && (
            <motion.button
              onClick={onBack}
              className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-xl"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>

                  <div className="mb-10">
                    <h1 className="text-5xl text-white mb-3">
                      Welcome Back
                    </h1>
                    <p className="text-xl text-white/80">
                      Login with your Bennett email
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Mail className="w-5 h-5 text-white/60" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.name@bennett.edu.in"
                        className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-white/30"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                      />
                    </div>

                    <motion.button
                      onClick={handleSendOTP}
                      disabled={!email || loading}
                      className="w-full py-5 bg-white text-[#FF1744] rounded-2xl text-lg font-semibold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-white/60 text-sm">
                      We'll send a verification code to your email
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30"
                    animate={{ 
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Check className="w-12 h-12 text-white" />
                  </motion.div>

                  <div className="mb-10">
                    <h1 className="text-4xl text-white mb-3">
                      Verify Your Email
                    </h1>
                    <p className="text-lg text-white/80 mb-2">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="text-white font-semibold">{email}</p>
                  </div>

                  <div className="mb-8">
                    <OTPInput onComplete={handleVerifyOTP} length={6} />
                  </div>

                  <button
                    onClick={() => {
                      setShowOTP(false);
                      handleSendOTP();
                    }}
                    className="text-white/80 hover:text-white text-sm"
                  >
                    Didn't receive code? <span className="underline">Resend</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
