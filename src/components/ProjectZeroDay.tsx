import React, { useEffect, useState, useRef } from 'react';
import IntroVideo, { IntroVideoRef } from './ui/IntroVideo';
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
import { AntiCheatOverlay } from './ui/AntiCheatOverlay';

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
  const [introVideoFinished, setIntroVideoFinished] = useState(false);
  const introVideoRef = useRef<IntroVideoRef>(null);

  useEffect(() => {
    if (showMatrixLoading) {
      const timer = setTimeout(() => setShowMatrixLoading(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showMatrixLoading]);

  const handleInitialSubmit = () => {
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
    if (introVideoRef.current) {
      introVideoRef.current.play();
    }
  };

  const handleLogin = async (name: string, secret: string, remember: boolean) => {
    const { supabase } = await import('../lib/supabase');
    
    try {
      // Check if team exists
      const { data: existingTeam, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .eq('team_name', name)
        .maybeSingle();

      let teamId = '';

      if (fetchError) {
        throw new Error('Database connection failed');
      }

      if (existingTeam) {
        // Verify password
        if (existingTeam.password !== secret) {
          throw new Error('Invalid team secret (password mismatch)');
        }
        teamId = existingTeam.id;

        // Restore game state
        useGameStore.setState({
          score: existingTeam.score,
          timeRemaining: existingTeam.time_remaining,
          activeChapter: existingTeam.active_chapter,
          unlockedChapters: existingTeam.unlocked_chapters,
          chapter1: existingTeam.chapter1 || useGameStore.getState().chapter1,
          chapter2: existingTeam.chapter2 || useGameStore.getState().chapter2,
          chapter3: existingTeam.chapter3 || useGameStore.getState().chapter3,
          chapter4: existingTeam.chapter4 || useGameStore.getState().chapter4,
          chapter5: existingTeam.chapter5 || useGameStore.getState().chapter5,
        });
      } else {
        // Team does not exist, create a new one seamlessly
        const { data: newTeam, error: insertError } = await supabase
          .from('teams')
          .insert([{
            team_name: name,
            password: secret,
            score: 0,
            time_remaining: 10800,
            active_chapter: 1,
            unlocked_chapters: [1]
          }])
          .select()
          .single();

        if (insertError) throw new Error('Failed to create team profile');
        teamId = newTeam.id;
      }
      
      setTeam(teamId, name);
      if (existingTeam) {
        setIntroVideoFinished(true);
        setShowMatrixLoading(true);
      } else {
        setShowIntroVideo(true);
      }
    } catch (err: any) {
      throw new Error(err.message || 'Authentication failed');
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff41] font-mono overflow-hidden flex flex-col relative selection:bg-[#00ff41] selection:text-black">
      
      {/* Anti-Cheat System */}
      <AntiCheatOverlay isActive={!!teamName} />

      {/* Intro Video always mounted to initialize iframe, visually revealed when showIntroVideo is true */}
      {!introVideoFinished && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: showIntroVideo ? 50 : -10,
          opacity: showIntroVideo ? 1 : 0,
          pointerEvents: showIntroVideo ? 'auto' : 'none',
          transition: 'opacity 0.5s ease-in'
        }}>
          <IntroVideo 
            ref={introVideoRef}
            onEnd={() => {
              setShowIntroVideo(false);
              setIntroVideoFinished(true);
              setShowMatrixLoading(true);
            }} 
          />
        </div>
      )}

      {/* Login Screen */}
      {!teamName && (
        <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 bg-black overflow-hidden font-mono selection:bg-[#00ff41] selection:text-black z-10">
          <LoginPage.VideoBackground videoUrl="https://youtu.be/binRgF2kBG0" />
          <div className="relative z-20 w-full max-w-md animate-fadeIn">
            <LoginPage.LoginForm onSubmit={handleLogin} onInitialSubmit={handleInitialSubmit} />
          </div>
        </div>
      )}

      {/* Matrix Loading Screen */}
      {teamName && !showIntroVideo && !introVideoFinished && showMatrixLoading && (
        <div className="relative bg-black min-h-screen w-full flex items-center justify-center font-mono z-40">
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
      )}

      {/* Game Content */}
      {teamName && introVideoFinished && !showMatrixLoading && (
        <>
          <DataWipeBackground />
          {activeChapter === 1 && <TransmissionPopup />}
          {activeChapter === 1 && <Chapter1 />}
          {activeChapter === 2 && <Chapter2 />}
          {activeChapter === 3 && <Chapter3 />}
          {activeChapter === 4 && <Chapter4 />}
          {activeChapter === 5 && <Chapter5 />}
        </>
      )}
    </div>
  );
};

export default ProjectZeroDay;
