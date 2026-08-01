import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const LevelUpAnimation: React.FC = () => {
  const { showLevelUpAnimation, gameStats, dismissLevelUp } = useGame();

  useEffect(() => {
    if (showLevelUpAnimation) {
      const timer = setTimeout(() => {
        dismissLevelUp();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUpAnimation, dismissLevelUp]);

  return (
    <AnimatePresence>
      {showLevelUpAnimation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={dismissLevelUp}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Trophy size={64} className="text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-2">LEVEL UP!</h2>
            <p className="text-xl text-yellow-100 mb-4">
              You've reached Level {gameStats.level}!
            </p>
            
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star size={24} className="text-yellow-200 fill-current" />
                </motion.div>
              ))}
            </div>
            
            <p className="text-white text-sm opacity-90">
              Keep up the great work! New challenges await.
            </p>
            
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-4"
            >
              <Zap size={32} className="text-yellow-200 mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpAnimation;