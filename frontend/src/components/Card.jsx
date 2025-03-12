import React from 'react'
import { useTheme } from '../contexts/ThemeContext';

const Card = ({ children, className = "" }) => {
    const { darkMode } = useTheme();
    return (
      <div className={`rounded-xl shadow-lg overflow-hidden mt-10 ${darkMode ? "bg-gray-800" : "bg-white"} ${className}`}>
        {children}
      </div>
    );
  };

export default Card
