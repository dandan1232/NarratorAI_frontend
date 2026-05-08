import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { RevealedFact } from '../types';

interface CollectionToastProps {
  fact: RevealedFact | null;
  onDismiss: () => void;
}

const CATEGORY_LABELS: Record<RevealedFact['category'], string> = {
  identity: '身份',
  preference: '喜好',
  innerWorld: '心事',
  habit: '习惯',
};

const CATEGORY_COLORS: Record<RevealedFact['category'], string> = {
  identity: 'bg-blue-100 text-blue-600',
  preference: 'bg-green-100 text-green-600',
  innerWorld: 'bg-purple-100 text-purple-600',
  habit: 'bg-orange-100 text-orange-600',
};

export function CollectionToast({ fact, onDismiss }: CollectionToastProps) {
  return (
    <AnimatePresence>
      {fact && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          onClick={onDismiss}
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg rounded-2xl px-5 py-3 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40">
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800 dark:text-gray-100">新发现！</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[fact.category]}`}>
                    {CATEGORY_LABELS[fact.category]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{fact.content}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
