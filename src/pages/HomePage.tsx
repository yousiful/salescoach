import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, FileText, Mic, TrendingUp, ChevronRight } from 'lucide-react';
import FeatureCard from '../components/ui/FeatureCard';

const HomePage: React.FC = () => {
  const [coins, setCoins] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCoin = {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 100,
        id: Date.now(),
      };
      setCoins(prev => [...prev, newCoin]);

      setTimeout(() => {
        setCoins(prev => prev.filter(coin => coin.id !== newCoin.id));
      }, 2000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: 'Interactive Training',
      description: 'Master closing techniques and objection handling with our comprehensive training modules.',
      icon: <Brain size={24} className="text-kenji-green-600" />,
      link: '/training'
    },
    {
      title: 'Script Generator',
      description: 'Create powerful sales scripts using proven methodologies and best practices.',
      icon: <FileText size={24} className="text-kenji-yellow-600" />,
      link: '/script-generator'
    },
    {
      title: 'AI Role-Play',
      description: 'Practice with our AI prospects that challenge you with realistic objections.',
      icon: <Mic size={24} className="text-kenji-pink-600" />,
      link: '/role-play'
    },
    {
      title: 'Performance Tracking',
      description: 'Track your progress and identify areas for improvement in your sales approach.',
      icon: <TrendingUp size={24} className="text-kenji-blue-600" />,
      link: '/dashboard'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kenji-blue-900 to-kenji-blue-700 text-white relative overflow-hidden min-h-[600px]">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Dollar Signs */}
          {coins.map(coin => (
            <div
              key={coin.id}
              className="absolute text-2xl text-kenji-yellow-400 font-bold animate-flyingCoin"
              style={{
                left: coin.x,
                top: coin.y
              }}
            >
              $
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="md:w-2/3 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Master the Art of Closing with AI
            </h1>
            <p className="text-xl text-kenji-blue-100 mb-8">
              Train, practice, and perfect your sales skills with our AI-powered coach using proven methodologies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/training"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-kenji-blue-900 bg-white hover:bg-kenji-blue-50 transition-colors"
              >
                Start Training
                <ChevronRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/role-play"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-kenji-blue-800 transition-colors"
              >
                Try Role Play
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Supercharge Your Sales Skills</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you master proven sales methodologies and transform your sales approach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-kenji-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-kenji-blue-900 mb-4">Ready to Transform Your Sales Approach?</h2>
          <p className="text-lg text-slate-700 mb-8 max-w-3xl mx-auto">
            Start training today and see immediate improvements in your closing rates and customer interactions.
          </p>
          <Link
            to="/training"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-kenji-blue-800 hover:bg-kenji-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;