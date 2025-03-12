import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext';

const Dropdown = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { darkMode } = useTheme();
  
    return (
      <div className="relative">
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-20 py-1 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              {children}
            </div>
          </>
        )}
      </div>
    );
  };

export default Dropdown
