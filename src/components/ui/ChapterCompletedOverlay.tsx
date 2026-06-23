import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const ChapterCompletedOverlay = () => {

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto font-mono">
      <div className="max-w-2xl w-full p-8 border border-[#00ff41]/30 bg-black/80 shadow-[0_0_30px_rgba(0,255,65,0.15)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#00ff41]/20 flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-[#00ff41] tracking-widest uppercase mb-4 text-center">
          Chapter Completed Successfully
        </h1>
        
        <p className="text-[#00ff41]/80 tracking-widest text-sm mb-12 text-center">
          WAITING FOR THE NEXT ROUND TO BEGIN...
        </p>

      </div>
    </div>
  );
};
