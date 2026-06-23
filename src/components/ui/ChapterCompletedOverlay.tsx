import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const ChapterCompletedOverlay = () => {
  const { globalState } = useGameStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      if (globalState.round_status === 'paused') return;
      if (!globalState.round_end_time) return;
      const end = new Date(globalState.round_end_time).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [globalState.round_end_time, globalState.round_status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md pointer-events-auto font-mono">
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

        <div className="text-center">
          <div className="text-5xl md:text-7xl font-bold text-[#00ff41] animate-pulse drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
            {formatTime(timeLeft)}
          </div>
          <div className="text-[#004400] text-xs tracking-[0.4em] mt-4 uppercase">
            Time Remaining
          </div>
        </div>
      </div>
    </div>
  );
};
