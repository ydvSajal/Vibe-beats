import { motion } from 'motion/react';
import { Music2, Heart, MessageCircle, Trophy, Sparkles, ArrowRight, Users, Play, Zap, Flame, Star, TrendingUp, Award, CheckCircle2, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { setAuthToken } from '../utils/api';
import { setCurrentUserId } from '../utils/mockAuth';
import { toast } from 'sonner@2.0.3';

interface LandingPageProps {
  onGetStarted: () => void;
  onDemoLogin?: () => void;
}

export function LandingPage({ onGetStarted, onDemoLogin }: LandingPageProps) {
  const handleDemoLogin = () => {
    // Set demo user credentials
    const demoToken = 'demo-token-' + Date.now();
    const demoUserId = 'demo-user-' + Math.random().toString(36).substr(2, 9);
    
    setAuthToken(demoToken);
    setCurrentUserId(demoUserId);
    
    // Store demo user profile
    localStorage.setItem('demoUser', JSON.stringify({
      name: 'Demo User',
      email: 'demo@bennett.edu.in',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      stats: {
        rank: 25,
        rightSwipes: 87,
        category: 'Pop',
      },
    }));
    
    toast.success('Welcome to TuneMatch! 🎉');
    
    // Navigate to main app
    if (onDemoLogin) {
      setTimeout(() => {
        onDemoLogin();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black overflow-hidden relative">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FF1744] via-[#9C27B0] to-[#2196F3] opacity-80"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '400% 400%',
          }}
        />
        
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-30" />
        
        {/* Floating Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-[#FF1744] rounded-full blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#9C27B0] rounded-full blur-3xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#2196F3] rounded-full blur-3xl opacity-20"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-6xl w-full">
            {/* Brand Badge */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="px-6 py-2 bg-white/10 backdrop-blur-2xl rounded-full border border-white/20 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                <span className="text-white text-sm">Bennett University Exclusive</span>
              </div>
            </motion.div>

            {/* Main Headline - Ultra Bold */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-7xl md:text-9xl text-white mb-6 tracking-tighter leading-none">
                <span className="block">date your</span>
                <span className="block bg-gradient-to-r from-[#FF1744] via-[#F50057] to-[#FF1744] bg-clip-text text-transparent">
                  music twin
                </span>
              </h1>
              
              <motion.p
                className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                swipe on people who actually vibe with your spotify wrapped 🎵
              </motion.p>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={onGetStarted}
                className="w-full sm:w-auto group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1744] to-[#F50057]" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative px-12 py-5 flex items-center justify-center gap-3">
                  <span className="text-white text-xl">start swiping</span>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              <motion.button
                onClick={handleDemoLogin}
                className="w-full sm:w-auto px-12 py-5 bg-white/10 backdrop-blur-xl text-white rounded-xl text-xl border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                <span>see demo</span>
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-[#FF1744] to-[#9C27B0]" />
                  ))}
                </div>
                <span className="text-sm">2,500+ students vibing</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF1744]" />
                <span className="text-sm">15K+ matches made</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#FBBF24] fill-[#FBBF24]" />
                <span className="text-sm">4.9/5 rating</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section - TikTok Style Cards */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl text-white mb-4 tracking-tight">
              why you'll be <span className="text-[#FF1744]">obsessed</span>
            </h2>
            <p className="text-xl text-white/60">no cap fr fr</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                emoji: '🔥',
                title: 'spotify wrapped matching',
                description: 'find people who actually get your music taste (not just "i listen to everything")',
                gradient: 'from-[#FF1744] to-[#F50057]',
                stat: '85% match rate',
              },
              {
                emoji: '💬',
                title: 'slide into DMs smoothly',
                description: 'no awkward "hey" openers when you already know you both love the same artists',
                gradient: 'from-[#2196F3] to-[#00BCD4]',
                stat: '10K+ convos daily',
              },
              {
                emoji: '🏆',
                title: 'flex your music clout',
                description: 'climb the leaderboard and prove your taste is immaculate',
                gradient: 'from-[#FBBF24] to-[#F59E0B]',
                stat: 'Top 100 rankings',
              },
              {
                emoji: '🎵',
                title: 'discover new bangers',
                description: 'your matches become your new playlist curators',
                gradient: 'from-[#9C27B0] to-[#E91E63]',
                stat: '50K+ songs shared',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -8 }}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="text-6xl mb-4">{feature.emoji}</div>
                  <h3 className="text-2xl text-white mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${feature.gradient} rounded-full text-sm text-white`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{feature.stat}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works - Minimalist */}
        <div className="max-w-5xl mx-auto px-4 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl text-white mb-4 tracking-tight">
              literally <span className="text-[#FF1744]">3 steps</span>
            </h2>
            <p className="text-xl text-white/60">easier than making a spotify playlist</p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'link your spotify',
                description: 'we peek at your top tracks (don\'t worry, your embarrassing 3am listens stay private)',
                icon: Music2,
              },
              {
                step: '02',
                title: 'swipe on vibes',
                description: 'left if they think nickelback slaps, right if they have immaculate taste',
                icon: Heart,
              },
              {
                step: '03',
                title: 'vibe check ✓',
                description: 'match with someone, swap playlists, maybe fall in love idk',
                icon: Sparkles,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF1744] to-[#F50057] rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 pt-2">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-sm text-white/40">{step.step}</span>
                    <h3 className="text-2xl text-white">{step.title}</h3>
                  </div>
                  <p className="text-lg text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
                <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-white/60 transition-colors mt-6" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials - Gen Z Style */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl text-white mb-4 tracking-tight">
              don't just take our <span className="text-[#FF1744]">word</span>
            </h2>
            <p className="text-xl text-white/60">real students, real vibes</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'arjun',
                year: '2nd year',
                text: 'found someone who loves tame impala as much as me. we\'re going to their concert together 💀',
                rating: 5,
              },
              {
                name: 'priya',
                year: '3rd year',
                text: 'best app for music nerds. my matches actually know who king gizzard is lmao',
                rating: 5,
              },
              {
                name: 'rahul',
                year: '1st year',
                text: 'made 10+ friends who vibe with indie. way better than random DMs',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-white/80 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF1744] to-[#9C27B0] rounded-full" />
                  <div>
                    <div className="text-white text-sm">{testimonial.name}</div>
                    <div className="text-white/40 text-xs">{testimonial.year}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA - Bold */}
        <div className="max-w-4xl mx-auto px-4 py-20">
          <motion.div
            className="relative overflow-hidden bg-gradient-to-r from-[#FF1744] to-[#F50057] rounded-3xl p-12 md:p-16"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative text-center">
              <h2 className="text-5xl md:text-6xl text-white mb-6 tracking-tight">
                ready to stop being single?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                2,500+ bennett students already found their music soulmate
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-12 py-5 bg-white text-[#FF1744] rounded-xl text-xl shadow-2xl flex items-center justify-center gap-3 group"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>let's goooo</span>
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </motion.button>
                
                <motion.button
                  onClick={handleDemoLogin}
                  className="w-full sm:w-auto px-12 py-5 bg-white/20 backdrop-blur-xl text-white rounded-xl text-xl border border-white/30 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5" />
                  <span>try demo first</span>
                </motion.button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>100% free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>no credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>bennett only</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto px-4 py-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF1744] to-[#9C27B0] rounded-xl flex items-center justify-center">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xl">TuneMatch</span>
            </div>
            
            <div className="flex items-center gap-6 text-white/60 text-sm">
              <a href="#" className="hover:text-white transition-colors">privacy</a>
              <a href="#" className="hover:text-white transition-colors">terms</a>
              <a href="#" className="hover:text-white transition-colors">support</a>
            </div>
            
            <div className="text-white/40 text-sm">
              made with 💜 at bennett university
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
