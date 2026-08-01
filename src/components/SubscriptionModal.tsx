import React from 'react';
import { X, Check, Clock } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const { handleSubscribe, handleSkipPayment, canSkipPayment, getSkipsRemaining } = useAppContext();
  
  if (!isOpen) return null;

  const handleSubscribeClick = () => {
    if (onSubscribe) {
      onSubscribe();
    } else {
      handleSubscribe();
    }
  };

  const handleSkipClick = () => {
    handleSkipPayment();
    onClose();
  };

  const skipsRemaining = getSkipsRemaining();
  const canSkip = canSkipPayment();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Continue Your Sales Journey
            </h2>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-slate-600">
              You've used your 20 minutes of free access. Ready to unlock unlimited training and take your sales skills to the next level?
            </p>
          </div>

          {canSkip && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={20} className="text-blue-600" />
                <span className="font-medium text-blue-800">Skip Option Available</span>
              </div>
              <p className="text-blue-700 text-sm">
                You can skip payment {skipsRemaining} more time{skipsRemaining !== 1 ? 's' : ''} and continue with another 20 minutes of free access.
              </p>
            </div>
          )}

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-green-800 mb-2">Unlimited Access Includes:</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-green-700">
                <Check size={16} className="mr-2" />
                Unlimited Training Modules
              </li>
              <li className="flex items-center text-green-700">
                <Check size={16} className="mr-2" />
                Unlimited Role-Play Sessions
              </li>
              <li className="flex items-center text-green-700">
                <Check size={16} className="mr-2" />
                Advanced AI Analysis
              </li>
              <li className="flex items-center text-green-700">
                <Check size={16} className="mr-2" />
                Personalized Coaching
              </li>
              <li className="flex items-center text-green-700">
                <Check size={16} className="mr-2" />
                Script Generator
              </li>
              <li className="flex items-center text-green-700">
                <Check size={16} className="mr-2" />
                Performance Dashboard
              </li>
            </ul>
          </div>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-slate-900 mb-2">$9/month</p>
            <p className="text-sm text-slate-500">Cancel anytime</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSubscribeClick}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Subscribe Now
            </button>

            {canSkip && (
              <button
                onClick={handleSkipClick}
                className="w-full py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors"
              >
                Skip for Now ({skipsRemaining} skip{skipsRemaining !== 1 ? 's' : ''} left)
              </button>
            )}

            {!canSkip && (
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-800 text-sm font-medium">
                  No more skips available. Subscribe to continue using the platform.
                </p>
              </div>
            )}
          </div>

          <p className="text-xs text-center text-slate-500 mt-4">
            30% of your subscription goes to cancer research
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;