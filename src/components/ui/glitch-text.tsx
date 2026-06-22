import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 -ml-[2px] text-red-500 opacity-70 animate-glitch-1 z-0 mix-blend-screen"
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 ml-[2px] text-blue-500 opacity-70 animate-glitch-2 z-0 mix-blend-screen"
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
};
