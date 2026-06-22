import React, { useEffect, useState } from 'react';
import IntroVideo from './ui/IntroVideo';
import MatrixRain from './ui/matrix-code';
import { useGameStore } from '../store/gameStore';
import Chapter1 from './chapters/Chapter1';
import Chapter2 from './chapters/Chapter2';
import Chapter3 from './chapters/Chapter3';
import Chapter4 from './chapters/Chapter4';
import Chapter5 from './chapters/Chapter5';
import LoginPage from './ui/gaming-login';
import { DataWipeBackground } from './ui/DataWipeBackground';
import { BinarySkull } from './ui/BinarySkull';

import { TransmissionPopup } from './ui/TransmissionPopup';

const ProjectZeroDay = () => {
  const { activeChapter, unlockedChapters, timeRemaining, decrementTime, score, setActiveChapter, teamName, setTeam } = useGameStore();

  useEffect(() => {
    if (!teamName) return;
    const timer = setInterval(() => {
      decrementTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementTime, teamName]);

  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showMatrixLoading, setShowMatrixLoading] = useState(false);

  useEffect(() => {
    if (showMatrixLoading) {
      const timer = setTimeout(() => setShowMatrixLoading(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMatrixLoading]);

  const handleLogin = (name: string, secret: string, remember: boolean) => {
    setTeam('team-' + Date.now(), name);
    setShowIntroVideo(true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!teamName) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 bg-black overflow-hidden font-mono selection:bg-[#00ff41] selection:text-black">
        <LoginPage.VideoBackground videoUrl="https://youtu.be/binRgF2kBG0" />
        <div className="relative z-20 w-full max-w-md animate-fadeIn">
          <LoginPage.LoginForm onSubmit={handleLogin} />
        </div>
      </div>
    );
  }

  const chapters = [
    { id: 1, name: 'BREACH' },
    { id: 2, name: 'PHISH' },
    { id: 3, name: 'GHOST' },
    { id: 4, name: 'BOMB' },
    { id: 5, name: 'FINAL' }
  ];

  if (showIntroVideo) {
    return (
      <IntroVideo 
        onEnd={() => {
          setShowIntroVideo(false);
          setShowMatrixLoading(true);
        }} 
      />
    );
  }

  if (showMatrixLoading) {
    return (
      <div className="relative bg-black min-h-screen w-full flex items-center justify-center font-mono">
        <MatrixRain 
          fontSize={18}
          color="#00ff41" 
          characters="01ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          fadeOpacity={0.05}
          speed={1.5}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[#ff0000] text-sm tracking-[0.3em] mb-4 animate-pulse">WARNING: UNAUTHORIZED ACCESS DETECTED</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#00ff41] animate-pulse text-center" style={{ textShadow: '0 0 15px rgba(0, 255, 65, 0.5)' }}>
            System Initialization
          </h1>
          <p className="text-[#00ff41]/80 mt-6 text-center tracking-widest font-mono text-sm animate-pulse border border-[#00ff41]/30 bg-black/50 px-6 py-2">
            ESTABLISHING SECURE CONNECTION...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono overflow-hidden flex flex-col relative selection:bg-[#00ff41] selection:text-black">
      {/* Background Effects */}
      <DataWipeBackground />
      {activeChapter === 1 && <TransmissionPopup />}
      {/* Chapter 1 takes over full screen */}
      {activeChapter === 1 && <Chapter1 />}
      {activeChapter === 2 && <Chapter2 />}
      {activeChapter === 3 && <Chapter3 />}
      {activeChapter === 4 && <Chapter4 />}
      {activeChapter === 5 && <Chapter5 />}
    </div>
  );
};

export default ProjectZeroDay;
