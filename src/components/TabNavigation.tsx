import { motion } from 'motion/react';
import { Flame, Trophy, MessageCircle, User } from 'lucide-react';

type TabState = 'pool' | 'leaderboard' | 'inbox' | 'profile';

interface TabNavigationProps {
  activeTab: TabState;
  onTabChange: (tab: TabState) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { 
      id: 'pool' as TabState, 
      icon: Flame, 
      label: 'Discover',
      color: '#FF1744',
      gradient: 'from-[#FF1744] to-[#F50057]'
    },
    { 
      id: 'leaderboard' as TabState, 
      icon: Trophy, 
      label: 'Rankings',
      color: '#FBBF24',
      gradient: 'from-[#FBBF24] to-[#F59E0B]'
    },
    { 
      id: 'inbox' as TabState, 
      icon: MessageCircle, 
      label: 'Messages',
      color: '#2196F3',
      gradient: 'from-[#2196F3] to-[#00BCD4]'
    },
    { 
      id: 'profile' as TabState, 
      icon: User, 
      label: 'Profile',
      color: '#9C27B0',
      gradient: 'from-[#9C27B0] to-[#E91E63]'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-t border-gray-200/50 dark:border-gray-800/50" />
      
      {/* Active indicator background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 h-1 bg-gradient-to-r"
          initial={false}
          animate={{
            left: `${tabs.findIndex(t => t.id === activeTab) * 25}%`,
            width: '25%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            background: tabs.find(t => t.id === activeTab)?.color || '#FF1744'
          }}
        />
      </div>

      {/* Tab buttons */}
      <nav className="relative flex items-center justify-around px-2 py-3 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative group"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} opacity-10 rounded-2xl`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon container */}
              <div className="relative">
                <motion.div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${tab.gradient} shadow-lg`
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                  }`}
                  animate={isActive ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    strokeWidth={2.5}
                  />
                </motion.div>

                {/* Pulse effect when active */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tab.gradient} opacity-30`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs transition-all ${
                  isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                style={isActive ? { 
                  background: `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                } : {}}
              >
                {tab.label}
              </span>

              {/* Notification badge (example) */}
              {tab.id === 'inbox' && (
                <motion.div
                  className="absolute top-1 right-2 w-2 h-2 bg-[#FF1744] rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}
