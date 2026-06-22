import React, { useEffect, useRef, useState } from 'react';

// Declare global YT interface
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface IntroVideoProps {
  onEnd: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndRef = useRef(onEnd);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep the ref updated with the latest callback
  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    // Initialize player when API is ready
    const initPlayer = () => {
      playerRef.current = new window.YT.Player('yt-player-container', {
        videoId: 'knBVlkJhwc4',
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: (event: any) => {
            // event.data: 1 = playing, 0 = ended
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 0) {
              onEndRef.current();
            }
          },
        },
      });
    };

    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    >
      {/* Iframe wrapper slightly oversized so YouTube logo/progress bar is clipped */}
      <div
        style={{
          position: 'absolute',
          // extend 80px beyond all edges to clip YouTube UI elements
          top: -80,
          left: -80,
          right: -80,
          bottom: -80,
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 0.5s ease-in',
        }}
      >
        <div id="yt-player-container" style={{ width: '100%', height: '100%', display: 'block', border: 'none' }} />
      </div>

      {/* Transparent overlay blocks click-to-pause on the video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          cursor: 'default',
        }}
      />

      {/* Skip button above the overlay */}
      <button
        onClick={onEnd}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          zIndex: 20,
          background: 'rgba(0,0,0,0.7)',
          border: '1px solid #00ff41',
          color: '#00ff41',
          fontFamily: 'monospace',
          fontSize: 13,
          letterSpacing: 2,
          padding: '8px 20px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#00ff41';
          e.currentTarget.style.color = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
          e.currentTarget.style.color = '#00ff41';
        }}
      >
        [ SKIP TRANSMISSION ]
      </button>
    </div>
  );
};

export default IntroVideo;
