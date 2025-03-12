import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const { darkMode } = useTheme();
  const variants = {
    primary: `bg-blue-500 hover:bg-blue-600 text-white ${darkMode ? 'hover:bg-blue-700' : ''}`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-900 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : ''}`,
    ghost: `hover:bg-gray-100 text-gray-600 ${darkMode ? 'hover:bg-gray-700 text-white' : ''}`,
    danger: `bg-red-500 hover:bg-red-600 text-white ${darkMode ? 'hover:bg-red-700' : ''}`,
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;