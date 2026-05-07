import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

interface AchievementToastProps {
  achievement: { name: string; icon: string; reward: number } | null;
  onDismiss: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          onClick={onDismiss}
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">{achievement.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm font-bold">成就解锁！</span>
              </div>
              <div className="text-sm opacity-90">{achievement.name}</div>
            </div>
            <div className="ml-2 text-sm font-bold opacity-80">
              +{achievement.reward}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
