import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const CheckoutCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Checkout Cancelled
        </h1>
        
        <p className="text-slate-600 mb-6">
          Your purchase was not completed. If you have any questions or concerns, please don't hesitate to contact us.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Return Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancel;