import React, { useEffect, useState } from 'react';
import { AlertTriangle, Monitor, EyeOff } from 'lucide-react';

interface AntiCheatOverlayProps {
  isActive: boolean;
}

export const AntiCheatOverlay: React.FC<AntiCheatOverlayProps> = ({ isActive }) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTabWarningVisible, setIsTabWarningVisible] = useState(false);
  const [isFullscreenWarningVisible, setIsFullscreenWarningVisible] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount > 4) {
            setIsTerminated(true);
          } else {
            setIsTabWarningVisible(true);
          }
          return newCount;
        });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenWarningVisible(true);
      } else {
        setIsFullscreenWarningVisible(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initial check just in case they are already not in fullscreen when activated
    if (document.fullscreenEnabled && !document.fullscreenElement) {
        // We delay it slightly so it doesn't trigger immediately on login if fullscreen takes a moment
        setTimeout(() => {
            if (!document.fullscreenElement) {
                setIsFullscreenWarningVisible(true);
            }
        }, 1000);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isActive]);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreenWarningVisible(false);
    } catch (err) {
      console.error("Fullscreen request failed", err);
    }
  };

  if (!isActive) return null;

  if (isTerminated) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black text-red-500 flex flex-col items-center justify-center font-mono p-8">
        <AlertTriangle size={64} className="mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 text-center tracking-widest text-red-500" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8)' }}>
          CONNECTION TERMINATED
        </h1>
        <p className="text-xl mb-8 text-center text-red-400">
          MAXIMUM TAB SWITCHES EXCEEDED. SECURITY PROTOCOL ACTIVATED.
        </p>
        <div className="text-sm text-red-600 animate-pulse border border-red-900 p-4 bg-red-950/30">
          [ ERROR CODE: 0xDEADDEAD_UNAUTHORIZED_ACTIVITY ]
        </div>
      </div>
    );
  }

  if (isFullscreenWarningVisible) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md text-red-500 flex flex-col items-center justify-center font-mono p-8 border-[8px] border-red-900">
        <Monitor size={64} className="mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold mb-4 text-center tracking-widest text-red-500">
          FULLSCREEN EXIT DETECTED
        </h1>
        <p className="text-lg mb-8 text-center text-red-400 max-w-lg">
          You have exited the secure fullscreen environment. You must return to fullscreen to continue the mission.
        </p>
        <button
          onClick={requestFullscreen}
          className="px-8 py-4 bg-red-900/40 border-2 border-red-500 text-red-500 font-bold tracking-widest hover:bg-red-500 hover:text-black transition-all"
        >
          [ RE-ESTABLISH SECURE CONNECTION ]
        </button>
      </div>
    );
  }

  if (isTabWarningVisible) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md text-[#ffaa00] flex flex-col items-center justify-center font-mono p-8 border-[8px] border-[#ffaa00]/30">
        <EyeOff size={64} className="mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold mb-4 text-center tracking-widest text-[#ffaa00]">
          UNAUTHORIZED TAB SWITCH DETECTED
        </h1>
        <p className="text-lg mb-8 text-center text-[#ffaa00]/80 max-w-lg">
          Switching tabs compromises the mission integrity. 
          <br /><br />
          <span className="font-bold text-red-400 text-xl">WARNING: {tabSwitchCount} / 4 VIOLATIONS</span>
        </p>
        <button
          onClick={() => setIsTabWarningVisible(false)}
          className="px-8 py-4 bg-[#ffaa00]/10 border-2 border-[#ffaa00] text-[#ffaa00] font-bold tracking-widest hover:bg-[#ffaa00] hover:text-black transition-all"
        >
          [ ACKNOWLEDGE WARNING ]
        </button>
      </div>
    );
  }

  return null;
};
