import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import TrialBanner from './components/TrialBanner';
import ActivityNotifications from './components/ActivityNotifications';
import TestingPanel from './components/TestingPanel';
import LevelUpAnimation from './components/gamification/LevelUpAnimation';
import AchievementAnimation from './components/gamification/AchievementAnimation';
import HomePage from './pages/HomePage';
import TrainingHub from './pages/TrainingHub';
import ScriptGenerator from './pages/ScriptGenerator';
import RolePlaySimulator from './pages/RolePlaySimulator';
import Dashboard from './pages/Dashboard';
import GameDashboard from './pages/GameDashboard';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import { AppProvider } from './contexts/AppContext';
import { GameProvider } from './contexts/GameContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AppProvider>
      <GameProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <TrialBanner />
            <main className="flex-grow relative">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route 
                  path="/training" 
                  element={
                    <PrivateRoute>
                      <TrainingHub />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/script-generator" 
                  element={
                    <PrivateRoute>
                      <ScriptGenerator />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/role-play" 
                  element={
                    <PrivateRoute>
                      <RolePlaySimulator />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/game" 
                  element={
                    <PrivateRoute>
                      <GameDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              </Routes>
            </main>
            <ActivityNotifications />
            <Footer />
            <TestingPanel />
            <LevelUpAnimation />
            <AchievementAnimation />
            <Toaster position="bottom-right" />
          </div>
        </Router>
      </GameProvider>
    </AppProvider>
  );
}

export default App