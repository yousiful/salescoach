import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-slate-600 text-sm">
              &copy; {new Date().getFullYear()} SalesAI Coach. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center text-sm text-slate-500">
            <span className="flex items-center">
              Made with <Heart size={14} className="mx-1 text-red-500" /> for sales professionals
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;