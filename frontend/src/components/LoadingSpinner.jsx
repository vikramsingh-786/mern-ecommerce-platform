import React from "react";

export const LoadingSpinner = ({ size = "default", className = "" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          animate-spin
          rounded-full
          border-blue-600
          border-t-transparent
          border-l-transparent
          shadow-lg
        `}
      />
      <div
        className={`
          ${sizeClasses[size]}
          absolute
          top-0
          animate-pulse
          rounded-full
          border-2
          border-blue-400/20
        `}
      />
    </div>
  );
};

export const PageLoader = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px] z-50">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 dark:text-gray-300 animate-pulse font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
};
