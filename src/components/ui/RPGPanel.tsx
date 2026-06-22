import React from 'react';

interface RPGPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const RPGPanel: React.FC<RPGPanelProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Outer Glow */}
      <div className="absolute -inset-[1px] bg-gradient-to-b from-purple-400 to-purple-800 rounded-lg blur-[2px] opacity-70"></div>
      
      {/* Main Border */}
      <div className="absolute inset-0 border border-purple-400 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)] pointer-events-none"></div>
      
      {/* Corner Accents (Top Left, Top Right, Bottom Left, Bottom Right) */}
      <div className="absolute -top-[3px] -left-[3px] w-2 h-2 bg-purple-200 shadow-[0_0_8px_rgba(233,213,255,1)] rotate-45"></div>
      <div className="absolute -top-[3px] -right-[3px] w-2 h-2 bg-purple-200 shadow-[0_0_8px_rgba(233,213,255,1)] rotate-45"></div>
      <div className="absolute -bottom-[3px] -left-[3px] w-2 h-2 bg-purple-200 shadow-[0_0_8px_rgba(233,213,255,1)] rotate-45"></div>
      <div className="absolute -bottom-[3px] -right-[3px] w-2 h-2 bg-purple-200 shadow-[0_0_8px_rgba(233,213,255,1)] rotate-45"></div>

      {/* Inner Container */}
      <div className="relative bg-black/60 backdrop-blur-md rounded-lg w-full h-full p-4 overflow-hidden border border-purple-900/50">
        {/* Subtle inner top highlight */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50"></div>
        
        {title && (
          <div className="mb-4 pb-2 border-b border-purple-500/30 flex items-center justify-center relative">
            <h3 className="text-purple-100 font-bold tracking-widest uppercase text-sm drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">
              {title}
            </h3>
            {/* Decorative title nodes */}
            <div className="absolute left-0 w-1.5 h-1.5 bg-purple-400 rotate-45"></div>
            <div className="absolute right-0 w-1.5 h-1.5 bg-purple-400 rotate-45"></div>
          </div>
        )}
        
        <div className="relative z-10 text-purple-50">
          {children}
        </div>
      </div>
    </div>
  );
};
