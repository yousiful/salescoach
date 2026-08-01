import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const AchievementAnimation: React.FC = () => {
  const { showAchievementAnimation, dismissAchievement } = useGame();

  useEffect(() => {
    if (showAchievementAnimation) {
      const timer = setTimeout(() => {
        dismissAchievement();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAchievementAnimation, dismissAchievement]);

  if (!showAchievementAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-2xl max-w-sm mx-4 relative"
        >
          <button
            onClick={dismissAchievement}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-4xl"
            >
              {showAchievementAnimation.icon}
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Award size={20} className="text-yellow-300" />
                <span className="font-bold text-sm">ACHIEVEMENT UNLOCKED</span>
              </div>
              <h3 className="font-bold text-lg">{showAchievementAnimation.title}</h3>
              <p className="text-sm opacity-90">{showAchievementAnimation.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-yellow-300 font-bold">+{showAchievementAnimation.points}</span>
                <span className="text-xs opacity-75">points</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementAnimation;