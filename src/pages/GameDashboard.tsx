import React from 'react';
import { Trophy, Star, Target, Award, TrendingUp, Calendar } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import GameStatsWidget from '../components/gamification/GameStatsWidget';
import AchievementsPanel from '../components/gamification/AchievementsPanel';
import BadgesCollection from '../components/gamification/BadgesCollection';
import ProgressBar from '../components/gamification/ProgressBar';

const GameDashboard: React.FC = () => {
  const { gameStats, getPlayerRank, getDailyGoal, getWeeklyGoal } = useGame();
  const dailyGoal = getDailyGoal();
  const weeklyGoal = getWeeklyGoal();

  const recentAchievements = gameStats.achievements
    .filter(a => a.unlocked)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Game Dashboard</h1>
        <p className="text-lg text-slate-600">
          Track your progress, achievements, and compete with yourself to become a sales master.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Current Level</p>
              <p className="text-3xl font-bold">{gameStats.level}</p>
              <p className="text-blue-100 text-xs">{getPlayerRank()}</p>
            </div>
            <Trophy size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Total Points</p>
              <p className="text-3xl font-bold">{gameStats.totalPoints.toLocaleString()}</p>
              <p className="text-yellow-100 text-xs">Lifetime earned</p>
            </div>
            <Star size={32} className="text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Current Streak</p>
              <p className="text-3xl font-bold">{gameStats.currentStreak}</p>
              <p className="text-green-100 text-xs">days in a row</p>
            </div>
            <TrendingUp size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Achievements</p>
              <p className="text-3xl font-bold">
                {gameStats.achievements.filter(a => a.unlocked).length}
              </p>
              <p className="text-purple-100 text-xs">unlocked</p>
            </div>
            <Award size={32} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target size={24} className="text-green-500" />
            <div>
              <h3 className="font-bold text-slate-900">Daily Goal</h3>
              <p className="text-sm text-slate-600">Complete 3 activities today</p>
            </div>
            {dailyGoal.completed && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                ✓ Complete
              </span>
            )}
          </div>
          <ProgressBar
            current={dailyGoal.current}
            max={dailyGoal.target}
            color="bg-green-500"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar size={24} className="text-purple-500" />
            <div>
              <h3 className="font-bold text-slate-900">Weekly Goal</h3>
              <p className="text-sm text-slate-600">Complete 15 activities this week</p>
            </div>
            {weeklyGoal.completed && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                ✓ Complete
              </span>
            )}
          </div>
          <ProgressBar
            current={weeklyGoal.current}
            max={weeklyGoal.target}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map(achievement => (
              <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900">{achievement.title}</h4>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                    <p className="text-xs text-yellow-600 font-medium">+{achievement.points} points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <GameStatsWidget />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <AchievementsPanel />
          <BadgesCollection />
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;