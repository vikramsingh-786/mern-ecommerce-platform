import React from 'react'
import { useTheme } from '../contexts/ThemeContext';

const Input = ({ icon, className = "", ...props }) => {
  const { darkMode } = useTheme(); 
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg border transition-colors ${
          darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } ${icon ? 'pl-10' : ''} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input
