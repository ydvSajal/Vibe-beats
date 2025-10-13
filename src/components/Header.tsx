import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
}

export function Header({ onBack, title }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
        {onBack && (
          <motion.button
            onClick={onBack}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-[#222222]" />
          </motion.button>
        )}
        {title && <h3 className="text-[#222222] flex-1">{title}</h3>}
      </div>
    </div>
  );
}
