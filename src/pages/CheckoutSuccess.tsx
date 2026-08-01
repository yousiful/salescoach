import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess: React.FC = () => {
  useEffect(() => {
    // You could trigger any post-purchase actions here
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Thank You for Your Purchase!
        </h1>
        
        <p className="text-slate-600 mb-6">
          Your subscription has been activated successfully. You now have full access to all premium features.
        </p>

        <div className="space-y-4">
          <Link
            to="/training"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Start Training
          </Link>
          
          <Link
            to="/dashboard"
            className="block w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;