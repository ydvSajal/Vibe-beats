import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music2, ArrowLeft, Mail, User, Sparkles, Check, Flame } from 'lucide-react';
import { OTPInput } from './OTPInput';
import { api, setAuthToken } from '../utils/api';
import { setCurrentUserId } from '../utils/mockAuth';
import { toast } from 'sonner';

interface OnboardingScreenProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function OnboardingScreen({ onComplete, onBack }: OnboardingScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [loading, setLoading] = useState(false);

  // REGISTER HANDLERS
  const handleEmailSubmit = async () => {
    if (!email.includes('@bennett.edu.in')) {
      toast.error('Please use your @bennett.edu.in email');
      return;
    }
    
    setShowNameInput(true);
  };

  const handleNameSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.signup(email, name);
      
      if (response.success) {
        const mockToken = `demo_${response.userId}`;
        setAuthToken(mockToken);
        setCurrentUserId(response.userId);
        
        toast.success('Account created! Verify your email...');
        setShowOTP(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN HANDLER
  const handleLogin = async () => {
    if (!email.includes('@bennett.edu.in')) {
      toast.error('Please use your @bennett.edu.in email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.login(email);
      
      if (response.success) {
        const mockToken = `demo_${response.userId}`;
        setAuthToken(mockToken);
        setCurrentUserId(response.userId);
        
        toast.success('Logged in successfully! 🎉');
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    setLoading(true);
    try {
      const response = await api.auth.verifyOTP(email, otp);
      
      if (response.success) {
        toast.success('Email verified! 🎉');
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF1744] via-[#FF6B9D] to-[#FFC1E3] dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 overflow-hidden">
      {/* Animated Background */}
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
        {/* Header */}
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

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center"
                >
                  {/* Logo */}
                  <motion.div
                    className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Flame className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Tab Buttons */}
                  <div className="flex gap-3 mb-10 bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
                    <motion.button
                      onClick={() => {
                        setMode('register');
                        setEmail('');
                        setName('');
                        setShowNameInput(false);
                      }}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        mode === 'register'
                          ? 'bg-white text-[#FF1744] shadow-lg'
                          : 'text-white/80 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setMode('login');
                        setEmail('');
                        setName('');
                        setShowNameInput(false);
                      }}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        mode === 'login'
                          ? 'bg-white text-[#FF1744] shadow-lg'
                          : 'text-white/80 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.button>
                  </div>

                  {/* REGISTER MODE */}
                  {mode === 'register' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Title */}
                      <div>
                        <h1 className="text-5xl text-white mb-3">
                          Create Account
                        </h1>
                        <p className="text-xl text-white/80">
                          Join Bennett's music community
                        </p>
                      </div>

                      {/* Email Input */}
                      {!showNameInput ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
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
                              onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                            />
                          </div>

                          <motion.button
                            onClick={handleEmailSubmit}
                            disabled={!email || loading}
                            className="w-full py-5 bg-white text-[#FF1744] rounded-2xl text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {loading ? (
                              <div className="w-6 h-6 border-3 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <span>Continue</span>
                                <Sparkles className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>

                          <p className="text-white/60 text-sm">
                            Use your Bennett University email address
                          </p>
                        </motion.div>
                      ) : (
                        /* Name Input */
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          {/* Email Confirmation */}
                          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-white/60 text-xs">Email</div>
                              <div className="text-white text-sm truncate">{email}</div>
                            </div>
                            <button
                              onClick={() => {
                                setShowNameInput(false);
                                setEmail('');
                              }}
                              className="text-white/60 hover:text-white text-sm"
                            >
                              Edit
                            </button>
                          </div>

                          <div className="relative">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                              <User className="w-5 h-5 text-white/60" />
                            </div>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full pl-14 pr-6 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-white/30"
                              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                              autoFocus
                            />
                          </div>

                          <motion.button
                            onClick={handleNameSubmit}
                            disabled={!name.trim() || loading}
                            className="w-full py-5 bg-white text-[#FF1744] rounded-2xl text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {loading ? (
                              <div className="w-6 h-6 border-3 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <span>Send Verification Code</span>
                                <Sparkles className="w-5 h-5" />
                              </>
                            )}
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    /* LOGIN MODE */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Title */}
                      <div>
                        <h1 className="text-5xl text-white mb-3">
                          Welcome Back
                        </h1>
                        <p className="text-xl text-white/80">
                          Sign in to your account
                        </p>
                      </div>

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
                          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                      </div>

                      <motion.button
                        onClick={handleLogin}
                        disabled={!email || loading}
                        className="w-full py-5 bg-white text-[#FF1744] rounded-2xl text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-3 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Login</span>
                            <Sparkles className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>

                      <p className="text-white/60 text-sm">
                        Use your Bennett University email address
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* OTP Verification */
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
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mail className="w-12 h-12 text-white" />
                  </motion.div>

                  <h1 className="text-4xl text-white mb-3">
                    Check Your Email
                  </h1>
                  <p className="text-lg text-white/80 mb-8">
                    We sent a code to<br />
                    <span className="text-white">{email}</span>
                  </p>

                  <OTPInput
                    length={6}
                    onComplete={handleOTPComplete}
                  />

                  <motion.button
                    onClick={() => setShowOTP(false)}
                    className="mt-6 text-white/80 hover:text-white underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Use different email
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
