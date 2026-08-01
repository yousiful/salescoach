import React from 'react';
import { Trophy, Star, Flame, Target, Award } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import ProgressBar from './ProgressBar';

const GameStatsWidget: React.FC = () => {
  const { gameStats, getPlayerRank, getDailyGoal, getWeeklyGoal } = useGame();
  const dailyGoal = getDailyGoal();
  const weeklyGoal = getWeeklyGoal();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Your Progress</h3>
        <div className="flex items-center space-x-2">
          <Trophy size={20} className="text-yellow-500" />
          <span className="font-bold text-slate-900">Level {gameStats.level}</span>
        </div>
      </div>

      {/* Player Rank */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">Current Rank</p>
            <p className="text-xl font-bold text-blue-800">{getPlayerRank()}</p>
          </div>
          <Award size={32} className="text-blue-600" />
        </div>
      </div>

      {/* Experience Progress */}
      <div className="mb-6">
        <ProgressBar
          current={gameStats.experiencePoints}
          max={1000}
          label="Experience to Next Level"
          color="bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Star size={20} className="text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{gameStats.totalPoints}</p>
          <p className="text-xs text-slate-600">Total Points</p>
        </div>
        
        <div className="text-center p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Flame size={20} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{gameStats.currentStreak}</p>
          <p className="text-xs text-slate-600">Day Streak</p>
        </div>
      </div>

      {/* Daily Goal */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Target size={16} className="text-green-500" />
          <span className="text-sm font-medium text-slate-700">Daily Goal</span>
          {dailyGoal.completed && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Complete</span>}
        </div>
        <ProgressBar
          current={dailyGoal.current}
          max={dailyGoal.target}
          color="bg-green-500"
          showPercentage={false}
        />
      </div>

      {/* Weekly Goal */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Target size={16} className="text-purple-500" />
          <span className="text-sm font-medium text-slate-700">Weekly Goal</span>
          {weeklyGoal.completed && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">✓ Complete</span>}
        </div>
        <ProgressBar
          current={weeklyGoal.current}
          max={weeklyGoal.target}
          color="bg-purple-500"
          showPercentage={false}
        />
      </div>
    </div>
  );
};

export default GameStatsWidget;