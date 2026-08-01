import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import toast from 'react-hot-toast';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'training' | 'roleplay' | 'streak' | 'score' | 'special';
  requirement: {
    type: 'modules_completed' | 'roleplay_sessions' | 'average_score' | 'streak_days' | 'total_points' | 'special';
    value: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface GameStats {
  totalPoints: number;
  level: number;
  experiencePoints: number;
  experienceToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  perfectScores: number;
  achievements: Achievement[];
  badges: Badge[];
  dailyGoalProgress: number;
  weeklyGoalProgress: number;
}

interface GameContextType {
  gameStats: GameStats;
  addPoints: (points: number, reason: string) => void;
  checkAchievements: () => void;
  earnBadge: (badgeId: string) => void;
  getPlayerRank: () => string;
  getDailyGoal: () => { target: number; current: number; completed: boolean };
  getWeeklyGoal: () => { target: number; current: number; completed: boolean };
  showLevelUpAnimation: boolean;
  showAchievementAnimation: Achievement | null;
  dismissLevelUp: () => void;
  dismissAchievement: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first training module',
    icon: '🎯',
    points: 100,
    unlocked: false,
    category: 'training',
    requirement: { type: 'modules_completed', value: 1 }
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Complete 3 training modules',
    icon: '📚',
    points: 300,
    unlocked: false,
    category: 'training',
    requirement: { type: 'modules_completed', value: 3 }
  },
  {
    id: 'master_learner',
    title: 'Master Learner',
    description: 'Complete all training modules',
    icon: '🎓',
    points: 500,
    unlocked: false,
    category: 'training',
    requirement: { type: 'modules_completed', value: 4 }
  },
  {
    id: 'practice_makes_perfect',
    title: 'Practice Makes Perfect',
    description: 'Complete 5 role-play sessions',
    icon: '🎭',
    points: 250,
    unlocked: false,
    category: 'roleplay',
    requirement: { type: 'roleplay_sessions', value: 5 }
  },
  {
    id: 'role_play_champion',
    title: 'Role-Play Champion',
    description: 'Complete 20 role-play sessions',
    icon: '🏆',
    points: 750,
    unlocked: false,
    category: 'roleplay',
    requirement: { type: 'roleplay_sessions', value: 20 }
  },
  {
    id: 'high_achiever',
    title: 'High Achiever',
    description: 'Maintain an average score of 85% or higher',
    icon: '⭐',
    points: 400,
    unlocked: false,
    category: 'score',
    requirement: { type: 'average_score', value: 85 }
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieve a perfect score of 100%',
    icon: '💎',
    points: 600,
    unlocked: false,
    category: 'score',
    requirement: { type: 'special', value: 100 }
  },
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    points: 350,
    unlocked: false,
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 }
  },
  {
    id: 'dedication_master',
    title: 'Dedication Master',
    description: 'Maintain a 30-day learning streak',
    icon: '🌟',
    points: 1000,
    unlocked: false,
    category: 'streak',
    requirement: { type: 'streak_days', value: 30 }
  },
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Earn 1000 total points',
    icon: '💰',
    points: 200,
    unlocked: false,
    category: 'special',
    requirement: { type: 'total_points', value: 1000 }
  }
];

const INITIAL_BADGES: Badge[] = [
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a session before 9 AM',
    icon: '🌅',
    color: 'bg-yellow-500',
    earned: false
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    color: 'bg-purple-500',
    earned: false
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Complete sessions on both Saturday and Sunday',
    icon: '⚔️',
    color: 'bg-red-500',
    earned: false
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a module in under 15 minutes',
    icon: '⚡',
    color: 'bg-blue-500',
    earned: false
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Improve your score by 20 points in consecutive sessions',
    icon: '📈',
    color: 'bg-green-500',
    earned: false
  }
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { userProgress } = useAppContext();
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    level: 1,
    experiencePoints: 0,
    experienceToNextLevel: 1000,
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    perfectScores: 0,
    achievements: INITIAL_ACHIEVEMENTS,
    badges: INITIAL_BADGES,
    dailyGoalProgress: 0,
    weeklyGoalProgress: 0
  });

  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [showAchievementAnimation, setShowAchievementAnimation] = useState<Achievement | null>(null);

  // Calculate level from total points
  const calculateLevel = (points: number): { level: number; experiencePoints: number; experienceToNextLevel: number } => {
    const level = Math.floor(points / 1000) + 1;
    const experiencePoints = points % 1000;
    const experienceToNextLevel = 1000 - experiencePoints;
    return { level, experiencePoints, experienceToNextLevel };
  };

  const addPoints = (points: number, reason: string) => {
    setGameStats(prev => {
      const newTotalPoints = prev.totalPoints + points;
      const { level, experiencePoints, experienceToNextLevel } = calculateLevel(newTotalPoints);
      
      // Check for level up
      if (level > prev.level) {
        setShowLevelUpAnimation(true);
        toast.success(`🎉 Level Up! You're now level ${level}!`, { duration: 4000 });
      }

      toast.success(`+${points} points for ${reason}!`, { 
        icon: '⭐',
        duration: 2000 
      });

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level,
        experiencePoints,
        experienceToNextLevel
      };
    });
  };

  const checkAchievements = () => {
    // Early return if userProgress is not available
    if (!userProgress) return;

    setGameStats(prev => {
      const updatedAchievements = prev.achievements.map(achievement => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;

        switch (achievement.requirement.type) {
          case 'modules_completed':
            shouldUnlock = (userProgress.completedModules || []).length >= achievement.requirement.value;
            break;
          case 'roleplay_sessions':
            shouldUnlock = (userProgress.rolePlaySessions || 0) >= achievement.requirement.value;
            break;
          case 'average_score':
            shouldUnlock = (userProgress.averageScore || 0) >= achievement.requirement.value;
            break;
          case 'streak_days':
            shouldUnlock = (userProgress.learningStreak || 0) >= achievement.requirement.value;
            break;
          case 'total_points':
            shouldUnlock = prev.totalPoints >= achievement.requirement.value;
            break;
          case 'special':
            // Handle special achievements (like perfect scores)
            if (achievement.id === 'perfectionist') {
              shouldUnlock = prev.perfectScores > 0;
            }
            break;
        }

        if (shouldUnlock) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
          
          // Show achievement animation
          setShowAchievementAnimation(unlockedAchievement);
          
          // Add points for achievement
          setTimeout(() => {
            addPoints(achievement.points, `unlocking "${achievement.title}"`);
          }, 1000);

          toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, { duration: 4000 });
          
          return unlockedAchievement;
        }

        return achievement;
      });

      return {
        ...prev,
        achievements: updatedAchievements
      };
    });
  };

  const earnBadge = (badgeId: string) => {
    setGameStats(prev => {
      const updatedBadges = prev.badges.map(badge => {
        if (badge.id === badgeId && !badge.earned) {
          toast.success(`🎖️ Badge Earned: ${badge.name}!`, { duration: 3000 });
          return {
            ...badge,
            earned: true,
            earnedAt: new Date()
          };
        }
        return badge;
      });

      return {
        ...prev,
        badges: updatedBadges
      };
    });
  };

  const getPlayerRank = (): string => {
    const level = gameStats.level;
    if (level >= 20) return 'Sales Master';
    if (level >= 15) return 'Senior Closer';
    if (level >= 10) return 'Expert Negotiator';
    if (level >= 7) return 'Skilled Persuader';
    if (level >= 5) return 'Rising Star';
    if (level >= 3) return 'Apprentice';
    return 'Rookie';
  };

  const getDailyGoal = () => {
    const target = 3; // 3 activities per day
    const current = gameStats.dailyGoalProgress;
    return {
      target,
      current,
      completed: current >= target
    };
  };

  const getWeeklyGoal = () => {
    const target = 15; // 15 activities per week
    const current = gameStats.weeklyGoalProgress;
    return {
      target,
      current,
      completed: current >= target
    };
  };

  const dismissLevelUp = () => {
    setShowLevelUpAnimation(false);
  };

  const dismissAchievement = () => {
    setShowAchievementAnimation(null);
  };

  // Update game stats based on user progress
  useEffect(() => {
    if (!userProgress) return;

    setGameStats(prev => ({
      ...prev,
      currentStreak: userProgress.learningStreak || 0,
      longestStreak: Math.max(prev.longestStreak, userProgress.learningStreak || 0),
      totalSessions: userProgress.rolePlaySessions || 0
    }));

    // Check achievements when user progress changes
    checkAchievements();
  }, [userProgress]);

  // Track perfect scores
  useEffect(() => {
    if (!userProgress) return;

    if ((userProgress.averageScore || 0) === 100) {
      setGameStats(prev => ({
        ...prev,
        perfectScores: prev.perfectScores + 1
      }));
    }
  }, [userProgress?.averageScore]);

  const contextValue = {
    gameStats,
    addPoints,
    checkAchievements,
    earnBadge,
    getPlayerRank,
    getDailyGoal,
    getWeeklyGoal,
    showLevelUpAnimation,
    showAchievementAnimation,
    dismissLevelUp,
    dismissAchievement
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}