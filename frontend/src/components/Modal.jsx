import React from 'react'
import { useTheme } from '../contexts/ThemeContext';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { darkMode } = useTheme(); 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative w-full max-w-md rounded-lg shadow-xl transition-all ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal
