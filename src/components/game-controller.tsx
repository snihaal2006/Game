import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import LoginPage from './ui/gaming-login';
import MatrixRain from './ui/matrix-code';
import GatewayPuzzleModal from './ui/gateway-puzzle';
import VideoPlayer from './ui/video-player';
import QuestionView from './ui/question-view';

const GameController = () => {
  const currentPhase = useGameStore((state) => state.currentPhase);
  const setPhase = useGameStore((state) => state.setPhase);

  // Handle the Matrix loading delay
  useEffect(() => {
    if (currentPhase === 'LOADING') {
      const timer = setTimeout(() => {
        setPhase('GATEWAY'); // After loading, show the gateway puzzle
      }, 4000); // 4 seconds of Matrix rain
      return () => clearTimeout(timer);
    }
  }, [currentPhase, setPhase]);

  const handleLogin = (teamName: string, teamSecret: string, remember: boolean) => {
    // Basic login logic. In the real app, we'd verify with Firebase here
    useGameStore.getState().setTeam('team-id-123', teamName);
  };

  // Render the appropriate screen based on phase
  return (
    <div className="min-h-screen bg-black text-white relative">
      
      {/* 1. Login Phase */}
      {currentPhase === 'LOGIN' && (
        <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
          <LoginPage.VideoBackground videoUrl="https://videos.pexels.com/video-files/8128311/8128311-uhd_2560_1440_25fps.mp4" />
          <div className="relative z-20 w-full max-w-md animate-fadeIn">
            <LoginPage.LoginForm onSubmit={handleLogin} />
          </div>
        </div>
      )}

      {/* 2. Loading Phase (Matrix Rain) */}
      {currentPhase === 'LOADING' && (
        <div className="relative bg-black min-h-screen w-full flex items-center justify-center">
          <MatrixRain 
            fontSize={18}
            color="#a855f7" 
            characters="01ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            fadeOpacity={0.05}
            speed={1.5}
          />
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-pulse text-center">
              System Initialization
            </h1>
            <p className="text-purple-400/80 mt-4 text-center tracking-widest font-mono text-sm animate-pulse">
              ESTABLISHING SECURE CONNECTION...
            </p>
          </div>
        </div>
      )}

      {/* 3. Gateway Puzzle Phase (Shows background matrix + modal) */}
      {currentPhase === 'GATEWAY' && (
        <div className="relative bg-black min-h-screen w-full">
          <MatrixRain fontSize={14} color="#a855f7" fadeOpacity={0.1} speed={1} />
          <GatewayPuzzleModal />
        </div>
      )}

      {/* 4. Video Phase */}
      {currentPhase === 'VIDEO' && (
        <VideoPlayer />
      )}

      {/* 5. Questions Phase */}
      {currentPhase === 'QUESTIONS' && (
        <QuestionView />
      )}

      {/* 6. Score/Completion Phase */}
      {currentPhase === 'SCORE_SCREEN' && (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            CHAPTER COMPLETE
          </h1>
          <p className="text-xl text-white/60">
            Score: {useGameStore((state) => state.score)}
          </p>
          <button
            onClick={() => useGameStore.getState().completeChapter()}
            className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition-colors"
          >
            PROCEED TO NEXT SECTOR
          </button>
        </div>
      )}

    </div>
  );
};

export default GameController;
