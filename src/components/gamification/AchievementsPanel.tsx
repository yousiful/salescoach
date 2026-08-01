import React, { useState } from 'react';
import { Trophy, Lock, Star, Filter } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Achievement } from '../../contexts/GameContext';

const AchievementsPanel: React.FC = () => {
  const { gameStats } = useGame();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredAchievements = gameStats.achievements.filter(achievement => {
    const statusMatch = filter === 'all' || 
                       (filter === 'unlocked' && achievement.unlocked) ||
                       (filter === 'locked' && !achievement.unlocked);
    
    const categoryMatch = categoryFilter === 'all' || achievement.category === categoryFilter;
    
    return statusMatch && categoryMatch;
  });

  const categories = ['all', 'training', 'roleplay', 'streak', 'score', 'special'];
  const unlockedCount = gameStats.achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy size={24} className="text-yellow-500" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Achievements</h3>
            <p className="text-sm text-slate-600">
              {unlockedCount} of {gameStats.achievements.length} unlocked
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-yellow-600">{unlockedCount}</p>
          <p className="text-xs text-slate-500">Earned</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filter by status:</span>
        </div>
        <div className="flex space-x-2">
          {['all', 'unlocked', 'locked'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                categoryFilter === category
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8">
          <Trophy size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No achievements match your current filters.</p>
        </div>
      )}
    </div>
  );
};

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
  return (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      achievement.unlocked
        ? 'border-yellow-200 bg-yellow-50'
        : 'border-slate-200 bg-slate-50 opacity-75'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
          {achievement.unlocked ? achievement.icon : <Lock size={24} className="text-slate-400" />}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`font-bold ${
              achievement.unlocked ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {achievement.title}
            </h4>
            {achievement.unlocked && (
              <Star size={16} className="text-yellow-500 fill-current" />
            )}
          </div>
          
          <p className={`text-sm mb-2 ${
            achievement.unlocked ? 'text-slate-700' : 'text-slate-500'
          }`}>
            {achievement.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              achievement.unlocked
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {achievement.category}
            </span>
            
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-500" />
              <span className={`text-sm font-bold ${
                achievement.unlocked ? 'text-yellow-600' : 'text-slate-500'
              }`}>
                {achievement.points}
              </span>
            </div>
          </div>
          
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-slate-500 mt-2">
              Unlocked {achievement.unlockedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel;