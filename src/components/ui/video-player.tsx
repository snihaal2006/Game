import React from 'react';
import ReactPlayer from 'react-player';
import { useGameStore } from '../../store/gameStore';
import { chaptersData } from '../../data/chapters';
import { SkipForward } from 'lucide-react';

const VideoPlayer = () => {
  const currentChapter = useGameStore((state) => state.currentChapter);
  const setPhase = useGameStore((state) => state.setPhase);
  
  const chapterData = chaptersData[currentChapter];
  if (!chapterData) return null;

  const handleVideoEnded = () => {
    // Video ended, transition to Questions
    setPhase('QUESTIONS');
  };

  const handleSkip = () => {
    setPhase('QUESTIONS');
  };

  return (
    <div className="fixed inset-0 bg-black z-40 flex items-center justify-center animate-fadeIn">
      {/* We use a container that forces a 16:9 aspect ratio */}
      <div className="relative w-full h-full max-w-[100vw] max-h-[100vh]">
        <ReactPlayer
          url={chapterData.videoUrl}
          playing={true}
          controls={false}
          width="100%"
          height="100%"
          onEnded={handleVideoEnded}
          config={{
            youtube: {
              // @ts-ignore
              playerVars: { 
                showinfo: 0, 
                modestbranding: 1, 
                rel: 0,
                disablekb: 1 
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        
        {/* Skip button for debugging/impatient users */}
        <button 
          onClick={handleSkip}
          className="absolute bottom-8 right-8 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white px-4 py-2 rounded-lg backdrop-blur-md transition-colors flex items-center space-x-2"
        >
          <span>Skip Cutscene</span>
          <SkipForward size={16} />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
