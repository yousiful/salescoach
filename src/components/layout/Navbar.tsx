import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, FileText, Mic, BarChart, Menu, X, Trophy, Star } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { gameStats } = useGame();

  const navigation = [
    { name: 'Training Hub', href: '/training', icon: <GraduationCap size={18} /> },
    { name: 'Script Generator', href: '/script-generator', icon: <FileText size={18} /> },
    { name: 'Role Play', href: '/role-play', icon: <Mic size={18} /> },
    { name: 'Dashboard', href: '/dashboard', icon: <BarChart size={18} /> },
    { name: 'Game', href: '/game', icon: <Trophy size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap size={28} className="text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-900">AI Sales Coach</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Game Stats in Navbar */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-slate-200">
              <div className="flex items-center space-x-1">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-sm font-bold text-slate-700">Lv.{gameStats.level}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-blue-500" />
                <span className="text-sm font-bold text-slate-700">{gameStats.totalPoints}</span>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Game Stats */}
            <div className="px-4 py-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="text-sm font-bold text-slate-700">Level {gameStats.level}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-blue-500" />
                  <span className="text-sm font-bold text-slate-700">{gameStats.totalPoints} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;