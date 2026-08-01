import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useGame } from '../contexts/GameContext';
import { Settings, Play, RotateCcw, Database, Clock, User, BarChart, Trophy, Star, SkipBack as Skip } from 'lucide-react';

const TestingPanel: React.FC = () => {
  const { 
    userProgress, 
    simulateUsage, 
    resetProgress, 
    generateTestData,
    addRolePlaySession,
    updateProgress,
    handleSkipPayment,
    canSkipPayment,
    getSkipsRemaining
  } = useAppContext();
  
  const { addPoints, checkAchievements, earnBadge, gameStats } = useGame();
  
  const [isOpen, setIsOpen] = useState(false);
  const [usageMinutes, setUsageMinutes] = useState(0);

  // Only show in development or test mode
  const shouldShow = process.env.NODE_ENV === 'development' || 
                   window.location.search.includes('test=true') ||
                   window.location.hostname === 'localhost';

  if (!shouldShow) return null;

  const handleSimulateUsage = () => {
    simulateUsage(usageMinutes);
  };

  const handleAddRolePlay = async () => {
    const randomScore = Math.floor(Math.random() * 40) + 60; // 60-100
    await addRolePlaySession(randomScore);
    
    // Add points for role-play
    const points = randomScore >= 90 ? 150 : randomScore >= 80 ? 100 : 75;
    addPoints(points, `test role-play (${randomScore}%)`);
    checkAchievements();
  };

  const handleCompleteModule = async () => {
    const modules = ['closing-fundamentals', 'nepq-methodology', 'objection-handling', 'advanced-closing'];
    const availableModules = modules.filter(m => !userProgress.completedModules.includes(m));
    if (availableModules.length > 0) {
      await updateProgress(availableModules[0]);
      
      // Add points for module completion
      const modulePoints = [200, 300, 350, 400];
      const moduleIndex = modules.indexOf(availableModules[0]);
      addPoints(modulePoints[moduleIndex] || 200, `completing test module`);
      checkAchievements();
    }
  };

  const handleAddPoints = () => {
    addPoints(100, 'test points');
  };

  const handleEarnBadge = () => {
    const availableBadges = gameStats.badges.filter(b => !b.earned);
    if (availableBadges.length > 0) {
      earnBadge(availableBadges[0].id);
    }
  };

  const handleTestSkip = () => {
    if (canSkipPayment()) {
      handleSkipPayment();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="AI Testing Panel"
      >
        <Settings size={20} />
      </button>

      {/* Testing Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-4 w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">AI Testing Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>

          {/* Current State */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2 flex items-center">
              <User size={16} className="mr-2" />
              Current State
            </h4>
            <div className="text-sm space-y-1">
              <div>Usage: {userProgress.usage_minutes || 0}/20 minutes</div>
              <div>Modules: {userProgress.completedModules?.length || 0}/4</div>
              <div>Role-plays: {userProgress.rolePlaySessions || 0}</div>
              <div>Avg Score: {userProgress.averageScore || 0}%</div>
              <div>Status: {userProgress.subscription_status || 'trial'}</div>
              <div>Skips: {userProgress.skip_count || 0}/3 used</div>
              <div>Can Skip: {canSkipPayment() ? 'Yes' : 'No'}</div>
              <div>Skips Left: {getSkipsRemaining()}</div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2 flex items-center">
              <Trophy size={16} className="mr-2" />
              Game Stats
            </h4>
            <div className="text-sm space-y-1">
              <div>Level: {gameStats.level}</div>
              <div>Points: {gameStats.totalPoints}</div>
              <div>XP: {gameStats.experiencePoints}/1000</div>
              <div>Achievements: {gameStats.achievements.filter(a => a.unlocked).length}/{gameStats.achievements.length}</div>
              <div>Badges: {gameStats.badges.filter(b => b.earned).length}/{gameStats.badges.length}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Simulate Usage (minutes)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={usageMinutes}
                  onChange={(e) => setUsageMinutes(parseInt(e.target.value) || 0)}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                  min="0"
                  max="30"
                />
                <button
                  onClick={handleSimulateUsage}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center"
                >
                  <Clock size={14} className="mr-1" />
                  Set
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddRolePlay}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center"
              >
                <Play size={14} className="mr-1" />
                Add Role-play
              </button>
              
              <button
                onClick={handleCompleteModule}
                className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center justify-center"
              >
                <BarChart size={14} className="mr-1" />
                Complete Module
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddPoints}
                className="px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 flex items-center justify-center"
              >
                <Star size={14} className="mr-1" />
                +100 Points
              </button>
              
              <button
                onClick={handleEarnBadge}
                className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center justify-center"
              >
                <Trophy size={14} className="mr-1" />
                Earn Badge
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTestSkip}
                disabled={!canSkipPayment()}
                className={`px-3 py-2 text-white rounded text-sm flex items-center justify-center ${
                  canSkipPayment() 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <Skip size={14} className="mr-1" />
                Test Skip
              </button>
              
              <button
                onClick={generateTestData}
                className="px-3 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 flex items-center justify-center"
              >
                <Database size={14} className="mr-1" />
                Generate Data
              </button>
            </div>

            <button
              onClick={resetProgress}
              className="w-full px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center justify-center"
            >
              <RotateCcw size={14} className="mr-1" />
              Reset All
            </button>
          </div>

          {/* Quick Usage Presets */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <h4 className="font-medium text-slate-700 mb-2 text-sm">Quick Usage Presets</h4>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => simulateUsage(5)}
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
              >
                5 min
              </button>
              <button
                onClick={() => simulateUsage(15)}
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
              >
                15 min
              </button>
              <button
                onClick={() => simulateUsage(25)}
                className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
              >
                25 min
              </button>
            </div>
          </div>

          {/* Skip Testing */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <h4 className="font-medium text-slate-700 mb-2 text-sm">Skip Testing</h4>
            <div className="grid grid-cols-4 gap-1">
              {[0, 1, 2, 3].map(skipCount => (
                <button
                  key={skipCount}
                  onClick={() => {
                    const newProgress = { ...userProgress, skip_count: skipCount };
                    // This would normally update via context, but for testing we'll simulate
                    console.log(`Setting skip count to ${skipCount}`);
                  }}
                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300"
                >
                  {skipCount} skips
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestingPanel;