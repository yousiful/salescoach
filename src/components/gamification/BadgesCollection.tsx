import React from 'react';
import { Award, Calendar, Clock, Zap, TrendingUp } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const BadgesCollection: React.FC = () => {
  const { gameStats, earnBadge } = useGame();
  const earnedBadges = gameStats.badges.filter(badge => badge.earned);

  // Check for badge conditions (this would normally be done in the game context)
  const checkBadgeConditions = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Early Bird badge
    if (hour < 9) {
      earnBadge('early_bird');
    }
    
    // Night Owl badge
    if (hour >= 22) {
      earnBadge('night_owl');
    }
    
    // Weekend Warrior badge
    const day = now.getDay();
    if (day === 0 || day === 6) { // Sunday or Saturday
      earnBadge('weekend_warrior');
    }
  };

  React.useEffect(() => {
    checkBadgeConditions();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Award size={24} className="text-purple-500" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Badge Collection</h3>
            <p className="text-sm text-slate-600">
              {earnedBadges.length} of {gameStats.badges.length} badges earned
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gameStats.badges.map(badge => (
          <div
            key={badge.id}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              badge.earned
                ? 'border-purple-200 bg-purple-50'
                : 'border-slate-200 bg-slate-50 opacity-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-2 ${
              !badge.earned ? 'grayscale' : ''
            }`}>
              <span className="text-white text-xl">{badge.icon}</span>
            </div>
            
            <h4 className={`font-bold text-sm mb-1 ${
              badge.earned ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {badge.name}
            </h4>
            
            <p className={`text-xs ${
              badge.earned ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {badge.description}
            </p>
            
            {badge.earned && badge.earnedAt && (
              <p className="text-xs text-purple-600 mt-2 font-medium">
                Earned {badge.earnedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {earnedBadges.length === 0 && (
        <div className="text-center py-8">
          <Award size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-2">No badges earned yet</p>
          <p className="text-sm text-slate-400">Complete activities to start earning badges!</p>
        </div>
      )}
    </div>
  );
};

export default BadgesCollection;