import React from 'react';
import { FiCoffee } from 'react-icons/fi';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-orange-50">
      <div className="text-center">
        <div className="relative">
          <FiCoffee className="text-6xl text-primary-500 animate-pulse" />
          <div className="absolute -inset-4">
            <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="mt-8 text-gray-600 font-medium">Brewing your coffee experience...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;