import React from 'react';
import { Clock, X, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const TrialBanner: React.FC = () => {
  const { 
    userProgress, 
    isUsageLimitReached, 
    getRemainingUsageTime, 
    handleSubscribe,
    getSkipsRemaining,
    canSkipPayment
  } = useAppContext();
  
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible || userProgress.subscription_status === 'active') {
    return null;
  }

  const remainingMinutes = getRemainingUsageTime();
  const usageLimitReached = isUsageLimitReached();
  const skipsRemaining = getSkipsRemaining();
  const canSkip = canSkipPayment();
  
  return (
    <div className={`p-3 ${usageLimitReached ? 'bg-red-50' : 'bg-blue-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            {usageLimitReached ? (
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            ) : (
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
            )}
            <p className={`font-medium ${usageLimitReached ? 'text-red-800' : 'text-blue-800'}`}>
              {usageLimitReached ? (
                canSkip ? (
                  `Your 20-minute trial has ended. Subscribe or skip (${skipsRemaining} skips left)`
                ) : (
                  'Your trial and all skips have been used. Subscribe to continue!'
                )
              ) : (
                `${remainingMinutes} minutes remaining in your trial`
              )}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubscribe}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
            >
              Subscribe Now - $9/month
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className={`p-1 rounded-md ${
                usageLimitReached 
                  ? 'hover:bg-red-100 text-red-400' 
                  : 'hover:bg-blue-100 text-blue-400'
              }`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;