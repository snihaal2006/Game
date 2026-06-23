import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ChapterCompletedOverlay } from '../ui/ChapterCompletedOverlay';

// ─── MATRIX RAIN CANVAS ────────────────────────────────────────────────────────
const MatrixCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const CHARS = '01010110DEADKILLVOID01NULL10BREACH01ZERO10';
    const COL_W = 14;
    let cols: number[] = [];
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numCols = Math.floor(canvas.width / COL_W);
      cols = Array.from({ length: numCols }, () => Math.floor(Math.random() * canvas.height / 14));
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.065)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px monospace';

      cols.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const r = Math.random();
        if (r < 0.03) ctx.fillStyle = '#ff0000';
        else if (r < 0.15) ctx.fillStyle = '#00ff41';
        else if (r < 0.40) ctx.fillStyle = '#005500';
        else ctx.fillStyle = '#002200';

        ctx.fillText(char, i * COL_W, y * 14);

        if (y * 14 > canvas.height && Math.random() > 0.975) {
          cols[i] = 0;
        } else {
          cols[i] = y + (Math.random() * 0.6 + 0.3);
        }
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
};

// ─── SKULL FRAMES ──────────────────────────────────────────────────────────────
// Skull template: # = filled (becomes 0/1), space = empty (stays empty)
// This defines the SHAPE - characters are replaced with random binary each frame
const SKULL_SHAPE = `
           ############
         ################
        ##################
       ####################
      ######################
      ######################
      ######################
      ####   ######   ####
      ###     ####     ###
      ###     ####     ###
      ####   ######   ####
      ######################
      ######################
      ## ## ## ## ## ## ##
       ####################
        ##################
          ##############
      #      ########      #
     ###    ##########    ###
    #####  ############  #####
   ####### ############ #######
  #########  ########  #########
   ####### ############ #######
    #####  ############  #####
     ###    ##########    ###
      #      ########      #
`.trim();

const generateSkullFrame = () => {
  return SKULL_SHAPE.replace(/#/g, () => (Math.random() > 0.5 ? '0' : '1'));
};



// ─── FILE DATA ─────────────────────────────────────────────────────────────────
const FILES = [
  { name: 'sys_kernel.db', start: 14 },
  { name: 'user_data.enc', start: 48 },
  { name: 'secrets.vault', start: 81 },
  { name: 'network.cfg',   start: 36 },
  { name: 'backup_01.zip', start: 93 },
  { name: 'root_access.key', start: 62 },
  { name: 'passwd.db',     start: 25 },
  { name: 'firewall.rules', start: 57 },
  { name: 'logs_2024.tar', start: 89 },
  { name: 'certs_all.pem', start: 43 },
];

// ─── LOG MESSAGES ──────────────────────────────────────────────────────────────
const LOG_MSGS = [
  { tag: '[ERR]', msg: 'PARTITION WIPE /home DESTROYED',        color: '#ff0000' },
  { tag: '[SYS]', msg: 'ARP SPOOF ACTIVE ON LAN',               color: '#00ff41' },
  { tag: '[INFO]', msg: 'SECTOR 0x2F44 OVERWRITTEN',            color: '#003300' },
  { tag: '[ERR]', msg: 'DECRYPT ATTEMPT — WRONG KEY',           color: '#ff0000' },
  { tag: '[SYS]', msg: 'JWT TOKEN FORGED — ACCESS GAINED',      color: '#00ff41' },
  { tag: '[INFO]', msg: '/etc/shadow CORRUPTED',                 color: '#003300' },
  { tag: '[ERR]', msg: 'DATABASE TABLES DROPPED',               color: '#ff0000' },
  { tag: '[SYS]', msg: 'EXFIL STREAM OPEN — PORT 4444',         color: '#00ff41' },
  { tag: '[ERR]', msg: 'SSH KEYS REVOKED',                      color: '#ff0000' },
  { tag: '[SYS]', msg: 'ZERO-DAY EXPLOIT DEPLOYED',             color: '#00ff41' },
];

// ─── FLOATING EMAILS ─────────────────────────────────────────────────────────
const FLOATING_SUBJECTS = [
  "URGENT",
  "VERIFY ACCOUNT",
  "PASSWORD RESET",
  "ACTION REQUIRED",
  "SUSPICIOUS LOGIN",
  "UPDATE CREDENTIALS"
];

const Q1_EMAIL_LINES = [
  "From: admin@skcet.ac.in",
  "Reply-To: harvester99@protonmail.com",
  "X-Originating-IP: 45.33.32.156",
  "Received: from mail.totally-legit-uni.xyz",
  "DKIM-Signature: FAIL",
  "SPF: FAIL",
  "Subject: URGENT — Verify your credentials now"
];

const FloatingEmails: React.FC = () => {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
      {FLOATING_SUBJECTS.map((sub, i) => (
        <div key={i} style={{
          position: 'absolute',
          color: 'rgba(255, 170, 0, 0.1)',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: Math.random() * 20 + 24 + 'px',
          left: Math.random() * 80 + 10 + '%',
          animation: `floatUpFade ${Math.random() * 15 + 10}s linear infinite`,
          animationDelay: `-${Math.random() * 15}s`,
          whiteSpace: 'nowrap'
        }}>
          {sub}
        </div>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const Chapter2: React.FC = () => {
  const { chapter2, decryptChapter2, solveChapter2Question, completeChapter2, globalState } = useGameStore();

  // Timer state
  const [timerSecs, setTimerSecs] = useState(0);

  // Skull text (generated from SKULL_SHAPE template)
  const [skullText, setSkullText] = useState(() => generateSkullFrame());

  // File bars
  const [bars, setBars] = useState(FILES.map(f => f.start));

  // Stats
  const [fileCount, setFileCount] = useState(2847);
  const [erasurePct, setErasurePct] = useState(73);
  const [rate, setRate] = useState(847);

  // Logs
  const [logs, setLogs] = useState<{ tag: string; msg: string; color: string }[]>([
    LOG_MSGS[0], LOG_MSGS[1], LOG_MSGS[2], LOG_MSGS[3], LOG_MSGS[4],
  ]);
  const logIdxRef = useRef(5);

  // Modal / unlock
  const [decodeAnswer, setDecodeAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [inputBorderRed, setInputBorderRed] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState('ENTER DECODED WORD...');

  // Post-unlock question state
  const [q2Answer, setQ2Answer] = useState('');
  const [q3Answer, setQ3Answer] = useState('');
  const [introRead, setIntroRead] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState('');
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [gatewayTimer, setGatewayTimer] = useState(10);

  // ── Effects ───────────────────────────────────────────────────────────────────

  // Gateway 10s Timer with Beep
  useEffect(() => {
    if (chapter2.isDecrypted) return;
    
    const t = setInterval(() => {
      setGatewayTimer(prev => {
        if (prev <= 1) {
          setAttempts(a => a + 1);
          setLogs(l => [{ tag: '[SYS]', msg: 'GATEWAY TIMEOUT. CONNECTION FAILED.', color: '#ff0000' }, ...l].slice(0, 5));
          return 10;
        }
        
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.value = prev <= 4 ? 1200 : 800;
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
          }
        } catch (e) {}
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(t);
  }, [chapter2.isDecrypted]);

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      if (globalState.round_status === 'paused') return;
      if (!globalState.round_end_time) {
        setTimerSecs(0);
        return;
      }
      const end = new Date(globalState.round_end_time).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimerSecs(diff);
    };

    updateTimer();
    const t = setInterval(updateTimer, 1000);
    return () => clearInterval(t);
  }, [globalState.round_end_time, globalState.round_status]);

  // Skull binary flicker
  useEffect(() => {
    const t = setInterval(() => setSkullText(generateSkullFrame()), 150);
    return () => clearInterval(t);
  }, []);

  // File bars
  useEffect(() => {
    const timers = FILES.map((_, idx) =>
      setInterval(() => {
        setBars(prev => {
          const next = [...prev];
          if (next[idx] < 100) {
            next[idx] = Math.min(100, next[idx] + Math.random() * 2.5 + 0.4);
          }
          return next;
        });
      }, 700 + idx * 80)
    );
    return () => timers.forEach(clearInterval);
  }, []);

  // Global stats ticker
  useEffect(() => {
    const t = setInterval(() => {
      setFileCount(c => c + Math.floor(Math.random() * 130) + 60);
      setErasurePct(p => Math.min(99, p + Math.random() * 0.35));
      setRate(Math.floor(Math.random() * 300) + 700);
    }, 950);
    return () => clearInterval(t);
  }, []);

  // Log injector
  useEffect(() => {
    const t = setInterval(() => {
      const entry = LOG_MSGS[logIdxRef.current % LOG_MSGS.length];
      logIdxRef.current += 1;
      setLogs(prev => [entry, ...prev].slice(0, 5));
    }, 1600);
    return () => clearInterval(t);
  }, []);

  // Chapter completion
  useEffect(() => {
    if (chapter2.solvedQuestions.length === 3 && !chapter2.evidenceCollected.includes('I')) {
      setTimeout(() => setShowCompletion(true), 1000);
    }
  }, [chapter2.solvedQuestions, chapter2.evidenceCollected]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDecodeSubmit = () => {
    if (!decodeAnswer.trim()) {
      setInputBorderRed(true);
      return;
    }
    setInputBorderRed(false);
    if (decodeAnswer.trim().toUpperCase() === 'SKCET') {
      setTransitionText('DECODE ACCEPTED. RE-ROUTING TO ROOT...');
      setIsTransitioning(true);
      setTimeout(() => {
        decryptChapter2();
        setIsTransitioning(false);
      }, 3500);
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const errLog = { tag: '[ERR]', msg: `DECODE "${decodeAnswer.substring(0, 8)}..." REJECTED`, color: '#ff0000' };
    setLogs(prev => [errLog, ...prev].slice(0, 5));
    setDecodeAnswer('');
    setInputPlaceholder('WRONG WORD — TRY AGAIN...');
  };

  const handleQ1 = (url: string) => {
    if (url === 'https://skcet.ac.in') {
      setTransitionText('SECURE CONNECTION ESTABLISHED. ACCESSING NEXT NODE...');
      setIsTransitioning(true);
      setTimeout(() => {
        solveChapter2Question('q1', 100);
        setIsTransitioning(false);
      }, 3500);
    } else {
      setAttempts(a => a + 1);
      const errLog = { tag: '[ERR]', msg: `CONNECTION REJECTED: INSECURE OR INVALID ORIGIN`, color: '#ff0000' };
      setLogs(prev => [errLog, ...prev].slice(0, 5));
    }
  };

  const handleQ2 = (e: React.FormEvent) => {
    e.preventDefault();
    const a = q2Answer.trim().toLowerCase();
    if (a === "zero" || a === "zero day" || a === "zeroday") {
      setTransitionText('IMAGE DECODED. ACCESSING NEXT NODE...');
      setIsTransitioning(true);
      setTimeout(() => {
        solveChapter2Question('q2', 200);
        setIsTransitioning(false);
      }, 3500);
    }
  };

  const handleQ3 = (e: React.FormEvent) => {
    e.preventDefault();
    const a = q3Answer.trim();
    if (a === "5") {
      setTransitionText('DEBUG SUCCESSFUL. DECRYPTING FINAL NODE...');
      setIsTransitioning(true);
      setTimeout(() => {
        solveChapter2Question('q3', 300);
        setIsTransitioning(false);
      }, 3500);
    }
  };



  const allLogs = [...logs];

  // ─── STYLES ──────────────────────────────────────────────────────────────────
  const orbitron = { fontFamily: "'Orbitron', sans-serif" };
  const mono = { fontFamily: "'Share Tech Mono', monospace" };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      ...mono,
      position: 'fixed', inset: 0,
      background: '#000',
      minHeight: 640,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 1,
    }}>

      {/* ── MATRIX CANVAS ──────────────────────────────────────────────────── */}
      <MatrixCanvas />

      {/* ── CHAPTER COMPLETED OVERLAY ──────────────────────────────────────── */}
      {chapter2.evidenceCollected.includes('O') && <ChapterCompletedOverlay />}

      {/* ── FLOATING EMAILS ────────────────────────────────────────────────── */}
      <FloatingEmails />

      {/* ── CANVAS OVERLAYS ────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent 2px, rgba(0,0,0,0.06) 2px 4px)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.9) 100%)',
      }} />

      {/* ── FULL SCREEN TRANSITION ───────────────────────────────────────── */}
      {isTransitioning ? (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
        }}>
          <div style={{
            maxWidth: 600, width: '100%',
            background: 'rgba(0,10,0,0.85)',
            border: '2px solid #00ff41',
            padding: 50,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            boxShadow: '0 0 50px rgba(0,255,65,0.4), inset 0 0 30px rgba(0,255,65,0.2)',
            backdropFilter: 'blur(4px)',
          }}>
            <div style={{ ...orbitron, fontSize: 32, color: '#00ff41', letterSpacing: 6, textShadow: '0 0 15px #00ff41' }}>
              PROCESSING REQUEST...
            </div>
            <div style={{ marginTop: 24, fontSize: 16, color: '#00cc33', letterSpacing: 3, textAlign: 'center', textTransform: 'uppercase' }}>
              {transitionText}
            </div>
            <div style={{ marginTop: 40, width: '100%', height: 6, background: '#002200', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 0,
                background: '#00ff41',
                boxShadow: '0 0 15px #00ff41',
                animation: 'loadProgress 3.5s cubic-bezier(0.1, 0.7, 0.1, 1) forwards'
              }} />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── TOPBAR ─────────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: 'rgba(0,0,0,0.92)',
        borderBottom: '1px solid #003a00',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 16px',
        flexShrink: 0,
      }}>
        {/* Left dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#001a00' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#001a00' }} />
        </div>

        {/* Center: Title */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <div style={{
            ...orbitron,
            fontSize: 24, fontWeight: 900,
            color: '#ff0000',
            letterSpacing: 6,
          }}>
            CASE 02 : THE PHISH
          </div>
        </div>

        {/* Right: label */}
        <div style={{ fontSize: 9, color: '#004400', letterSpacing: 2 }}>
          PROJECT: ZERO-DAY // CLASSIFIED
        </div>
      </div>

      {/* ── TOP RIGHT NOTIFICATION ─────────────────────────────────────────── */}
      {chapter2.isDecrypted && (
        <div 
          onClick={() => setIsEmailOpen(true)}
          style={{
            position: 'absolute', top: 50, right: 20, zIndex: 100,
            background: 'rgba(255,170,0,0.1)', border: '1px solid #ffaa00',
            padding: '8px 16px', cursor: 'pointer',
            animation: 'pulseOp 1.5s infinite',
            boxShadow: '0 0 15px rgba(255,170,0,0.2)'
          }}
        >
          <div style={{ ...orbitron, fontSize: 12, color: '#ffaa00', fontWeight: 'bold', letterSpacing: 2 }}>
            [ 1 SUSPICIOUS EMAIL ]
          </div>
        </div>
      )}

      {/* ── EMAIL POPUP ────────────────────────────────────────────────────── */}
      {isEmailOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: 600, width: '100%',
            background: 'rgba(20,10,0,0.95)', border: '1px solid #ffaa00',
            padding: 32, position: 'relative'
          }}>
            <button 
              onClick={() => setIsEmailOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#ffaa00', fontSize: 24, cursor: 'pointer' }}
            >×</button>
            <div style={{ ...orbitron, fontSize: 20, color: '#ffaa00', marginBottom: 24 }}>SUSPICIOUS EMAIL</div>
            <pre style={{ ...mono, fontSize: 14, color: '#ffaa00', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
{`From: admin@skcet.ac.in
Reply-To: security-team@verify-campus.xyz

Subject: URGENT - Verify Account Immediately

Dear Faculty,

Due to emergency maintenance, all staff must verify credentials before midnight.
Failure to comply will result in account suspension.

Verify Here:
https://skcet-portal-login.xyz`}
            </pre>
          </div>
        </div>
      )}

      {/* ── ALERT TICKER ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        background: '#050d05',
        borderTop: '1px solid #003a00', borderBottom: '1px solid #003a00',
        padding: '5px 0', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{
          whiteSpace: 'nowrap',
          animation: 'tickerScroll 22s linear infinite',
          color: '#00ff41', fontSize: 10, letterSpacing: 2,
          display: 'inline-block',
        }}>
          &nbsp;&nbsp;&nbsp;&nbsp;[CRITICAL] DATA ERASURE IN PROGRESS — 73% OF FILES DESTROYED — BACKUP SYSTEMS OFFLINE — ENCRYPTION KEYS COMPROMISED — NETWORK ISOLATION FAILED — ALL PARTITIONS AFFECTED — RECOVERY IMPOSSIBLE AFTER ZERO HOUR — ENTER OVERRIDE KEY NOW &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[CRITICAL] DATA ERASURE IN PROGRESS — 73% OF FILES DESTROYED — BACKUP SYSTEMS OFFLINE — ENCRYPTION KEYS COMPROMISED — NETWORK ISOLATION FAILED — ALL PARTITIONS AFFECTED — RECOVERY IMPOSSIBLE AFTER ZERO HOUR — ENTER OVERRIDE KEY NOW
        </div>
      </div>

      {/* ── MAIN ROW ───────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flex: 1, overflow: 'hidden',
      }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div style={{
          width: 220, flexShrink: 0,
          background: 'rgba(0,5,0,0.88)',
          borderRight: '1px solid #001a00',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            fontSize: 10, color: '#004400', letterSpacing: 3,
            borderBottom: '1px solid #001a00',
            padding: '10px 12px 8px',
          }}>// ERASING NOW</div>
          <div style={{
                  fontSize: 10, color: '#004400', letterSpacing: 2, textAlign: 'center', marginTop: 12,
                  animation: 'pulseOp 2s infinite',
                }}>
                  [ CLUE: DECRYPT: 26-19-19-03-08 (A=1) ]
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
            {FILES.map((f, i) => {
              const pct = bars[i];
              const done = pct >= 100;
              return (
                <div key={f.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderLeft: '2px solid #ff0000',
                  padding: '7px 10px',
                  marginBottom: 2,
                }}>
                  <div style={{
                    fontSize: 11, color: '#ff3333',
                    animation: 'glitchFile 0.5s infinite',
                    maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    flex: 1,
                  }}>{f.name}</div>
                  <div style={{
                    width: 52, height: 5,
                    background: '#001a00', marginLeft: 6, flexShrink: 0,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: `${Math.min(100, pct)}%`,
                      background: done ? '#1a0000' : '#00ff41',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CENTER COLUMN ───────────────────────────────────────────────── */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, padding: '12px 8px', overflow: 'hidden',
        }}>

          {/* 1. BINARY SKULL IMAGE */}
          <div style={{ position: 'relative', width: 220, height: 220, flexShrink: 0, marginTop: 40 }}>
            {/* Green glow behind the image */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle, rgba(0,255,65,0.15) 0%, transparent 70%)',
              animation: 'skullPulse 2s ease-in-out infinite',
              borderRadius: '50%',
            }} />
            <img
              src="/hacker_skull.png"
              alt="Hacker Skull"
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                animation: 'skullPulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 18px #00ff41) drop-shadow(0 0 40px rgba(0,255,65,0.4))',
                userSelect: 'none',
              }}
            />
          </div>

          {/* 2. TIMER */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              ...orbitron,
              fontSize: 48, fontWeight: 900,
              color: (!chapter2.isDecrypted && gatewayTimer <= 3) ? '#ff0000' : '#ffaa00',
              animation: (!chapter2.isDecrypted && gatewayTimer <= 3) ? 'flickerTimer 0.5s linear infinite' : 'flickerTimer 3s linear infinite',
              lineHeight: 1,
            }}>
              {!chapter2.isDecrypted ? `00:00:${gatewayTimer.toString().padStart(2, '0')}` : formatTime(timerSecs)}
            </div>
            <div style={{ fontSize: 9, color: '#554400', letterSpacing: 4, marginTop: 4 }}>
              UNTIL TOTAL ERASURE
            </div>
          </div>

          {/* 3. WARNING MODAL / QUESTIONS */}
          {!chapter2.isDecrypted ? (
            <div style={{
              maxWidth: 420, width: '100%',
              background: 'rgba(0,8,0,0.97)',
              border: '1px solid #003a00',
              position: 'relative',
              boxShadow: '0 0 40px rgba(255,0,0,0.08)',
            }}>
              {/* Top red line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#ff0000' }} />
              {/* Bottom green line */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: '#00ff41' }} />

              {/* Modal header */}
              <div style={{
                background: '#020d02',
                borderBottom: '1px solid #001a00',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff0000', animation: 'dotPulseRed 0.9s ease-in-out infinite' }} />
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#004400', animation: 'dotPulseGreen 1.3s ease-in-out infinite' }} />
                  <span style={{ fontSize: 9, color: '#005500', letterSpacing: 2 }}>ROOT://ERASURE_DAEMON — ACTIVE</span>
                </div>
                <span style={{ fontSize: 9, color: '#002200' }}>[ CANNOT CLOSE ]</span>
              </div>

              {/* Modal body */}
              <div style={{ padding: 18 }}>
                <div style={{
                  ...orbitron,
                  fontSize: 13, fontWeight: 700,
                  color: '#ff0000', letterSpacing: 3,
                  animation: 'flickerTimer 3s linear infinite',
                  marginBottom: 8,
                }}>
                  YOUR DATA IS BEING ERASED
                </div>
                <div style={{
                  fontSize: 11,
                  color: '#00ff41',
                  letterSpacing: 2,
                  marginBottom: 16,
                  textShadow: '0 0 5px rgba(0,255,65,0.4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>[ IDENTIFY SECURE GATEWAY TO HALT DESTRUCTION ]</span>
                  <span style={{ 
                    color: gatewayTimer <= 3 ? '#ff0000' : '#ffaa00', 
                    fontWeight: 'bold',
                    fontSize: 14,
                    animation: gatewayTimer <= 3 ? 'flickerTimer 0.5s infinite' : 'none'
                  }}>
                    T-{gatewayTimer}s
                  </span>
                </div>

                {/* Progress row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 8 }}>
                  <span style={{ color: '#005500' }}>ERASURE PROGRESS</span>
                  <span style={{ color: '#ff0000', animation: 'flickerTimer 3s linear infinite' }}>{Math.floor(erasurePct)}%</span>
                </div>
                <div style={{
                  height: 5, background: '#001a00', marginBottom: 14, position: 'relative', overflow: 'hidden',
                }}>
                  {/* Ghost green layer */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,65,0.2)' }} />
                  {/* Red fill */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${erasurePct}%`,
                    background: '#ff0000',
                    transition: 'width 1s',
                  }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  <div style={{ color: '#ffaa00', fontSize: 13, marginBottom: 8, letterSpacing: 1 }}>
                    [ DATA FRAGMENT RECOVERY ]<br/>
                    CONVERT BINARY TO DECIMAL TO WORD
                  </div>
                  <div style={{ ...orbitron, fontSize: 18, color: '#00ff41', letterSpacing: 4, textAlign: 'center', margin: '16px 0', textShadow: '0 0 10px #00ff41' }}>
                    01010011 01001011<br/>01000011 01000101 01010100
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: '#00ff41' }}>&gt;</span>
                    <input 
                      autoFocus
                      placeholder={inputPlaceholder}
                      value={decodeAnswer}
                      onChange={e => setDecodeAnswer(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleDecodeSubmit()}
                      style={{
                        ...mono,
                        flex: 1,
                        background: 'rgba(0,20,0,0.5)',
                        border: `1px solid ${inputBorderRed ? '#ff0000' : '#00ff41'}`,
                        color: '#00ff41',
                        padding: '8px 12px',
                        outline: 'none',
                        fontSize: 14,
                        letterSpacing: 2,
                        textTransform: 'uppercase'
                      }}
                    />
                    <button onClick={handleDecodeSubmit}
                      style={{ ...mono, background: '#003300', border: '1px solid #00ff41', color: '#00ff41', padding: '8px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2 }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#005500')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#003300')}
                    >DECODE</button>
                  </div>
                </div>

                {attempts > 0 && (
                  <div style={{ fontSize: 8, color: '#ff0000', marginBottom: 8, letterSpacing: 1 }}>
                    ⚠ {attempts} INSECURE CONNECTION ATTEMPT{attempts > 1 ? 'S' : ''} — SYSTEM IS LOGGING
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div style={{
                background: '#010801', borderTop: '1px solid #001a00',
                display: 'flex', justifyContent: 'space-around',
                padding: '7px 12px', fontSize: 8,
              }}>
                <div>
                  <div style={{ color: '#00ff41', animation: 'dotPulseGreen 1.3s infinite' }}>ERASING: {rate}/SEC</div>
                  <div style={{ color: '#003300' }}>RATE</div>
                </div>
                <div>
                  <div style={{ color: '#003300' }}>NODE: 0x4F2A</div>
                  <div style={{ color: '#003300' }}>NODE</div>
                </div>
                <div>
                  <div style={{ color: '#003300' }}>DEPTH: ROOT</div>
                  <div style={{ color: '#003300' }}>LEVEL</div>
                </div>
              </div>
            </div>
          ) : (
            // POST-UNLOCK QUESTIONS
            <div style={{ maxWidth: 640, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {!introRead ? (
                <>
                  {/* Intro Text */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(255, 170, 0, 0.2)', 
                    borderLeft: '4px solid #ffaa00',
                    background: 'linear-gradient(135deg, rgba(20,10,0,0.95) 0%, rgba(5,2,0,0.95) 100%)', 
                    padding: 24, 
                    boxShadow: '0 0 20px rgba(255,170,0,0.1), inset 0 0 30px rgba(255,170,0,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #ffaa00', borderRight: '2px solid #ffaa00' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #ffaa00', borderRight: '2px solid #ffaa00' }} />
                    
                    <div style={{ fontSize: 12, color: '#ffaa00', marginBottom: 8, letterSpacing: 1, fontWeight: 'bold' }}>
                      TIME : 03:24 AM<br/>
                      STATUS : ACTIVE INCIDENT<br/>
                      THREAT LEVEL : HIGH
                    </div>
                    <div style={{ fontSize: 13, color: '#00ff41', letterSpacing: 1, lineHeight: 1.6, textShadow: '0 0 8px rgba(0,255,65,0.3)' }}>
                      The investigation reveals that stolen credentials are being used across campus systems.<br/>
                      The team discovers a phishing campaign targeting students and faculty.<br/>
                      The attackers are attempting to harvest login credentials before launching the next stage of the attack.<br/>
                    </div>
                    
                    <button onClick={() => setIntroRead(true)} style={{ ...mono, background: '#3a2a00', border: '1px solid #ffaa00', color: '#ffaa00', padding: '12px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, transition: 'all 0.2s', marginTop: 24, width: '100%' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#5a3a00')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#3a2a00')}
                    >
                      [ BEGIN TRACE ]
                    </button>
                  </div>
                </>
              ) : !chapter2.solvedQuestions.includes('q1') ? (
                <>

                  {/* Q1 */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(255, 170, 0, 0.2)', 
                    borderLeft: '4px solid #ffaa00',
                    background: 'linear-gradient(135deg, rgba(20,10,0,0.95) 0%, rgba(5,2,0,0.95) 100%)', 
                    padding: 32, 
                    boxShadow: '0 0 20px rgba(255,170,0,0.1), inset 0 0 30px rgba(255,170,0,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #ffaa00', borderRight: '2px solid #ffaa00' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #ffaa00', borderRight: '2px solid #ffaa00' }} />
                    
                    <div style={{ color: '#ffaa00', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 }}>
                      [SECURE GATEWAY ROUTING]:
                    </div>
                    <div style={{ fontSize: 14, color: '#00cc33', marginBottom: 16, lineHeight: 1.5 }}>
                      Identify the correct secure gateway to halt the remaining destructive processes.
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                      {['https://skcet.ac.in', 'http://skcet.ac.in', 'skcet.xyz'].map((url) => (
                        <button
                          key={url}
                          onClick={() => handleQ1(url)}
                          style={{
                            ...mono,
                            padding: '12px 16px',
                            background: '#3a2a00',
                            border: '1px solid #ffaa00',
                            color: '#ffaa00',
                            cursor: 'pointer',
                            fontSize: 14,
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            letterSpacing: 1
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = '#5a3a00';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(255,170,0,0.2)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = '#3a2a00';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span style={{ color: '#ffaa00', marginRight: 12 }}>▶</span>
                          {url}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : !chapter2.solvedQuestions.includes('q2') ? (
                <>
                  <div style={{ ...orbitron, color: '#bd00ff', fontSize: 24, letterSpacing: 4, textAlign: 'center', marginBottom: 8, textShadow: '0 0 10px #bd00ff' }}>
                    BINARY TRANSMISSION
                  </div>
                  {/* Q2 */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(189, 0, 255, 0.2)', 
                    borderLeft: '4px solid #bd00ff',
                    background: 'linear-gradient(135deg, rgba(10,0,20,0.95) 0%, rgba(2,0,5,0.95) 100%)', 
                    padding: 32, 
                    boxShadow: '0 0 20px rgba(189,0,255,0.1), inset 0 0 30px rgba(189,0,255,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #bd00ff', borderRight: '2px solid #bd00ff' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #bd00ff', borderRight: '2px solid #bd00ff' }} />
                    
                    <div style={{ color: '#bd00ff', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 }}>
                      [NON-TECHNICAL] PIXEL ART RECOVERY:
                    </div>
                    <div style={{ fontSize: 14, color: '#00e5ff', marginBottom: 16, lineHeight: 1.5 }}>
                      The Void left this binary transmission. Identify the hidden word.
                    </div>
                    <div style={{ ...mono, fontSize: 12, color: '#bd00ff', background: 'rgba(20,0,30,0.5)', padding: 16, borderLeft: '2px solid #bd00ff', marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.2, textAlign: 'center', letterSpacing: 4 }}>
{`
11111 01110 11110 01110  11110 01110 10001
00001 10000 10001 10001  10001 10001 10001
00010 10000 10001 10001  10001 10001 10001
00100 11111 11110 10001  10001 11111 01010
01000 10000 10100 10001  10001 10001 00100
10000 10000 10010 10001  10001 10001 00100
11111 11111 10001 01110  11110 10001 00100
`}
                    </div>
                    <form onSubmit={handleQ2} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ color: '#bd00ff', fontSize: 16 }}>▶</span>
                      <input value={q2Answer} onChange={e => setQ2Answer(e.target.value)}
                        placeholder="Enter hidden word..." style={{ ...mono, flex: 1, background: 'rgba(30,0,40,0.3)', border: '1px solid #bd00ff', padding: '8px 12px', color: '#bd00ff', outline: 'none', fontSize: 15, letterSpacing: 1 }} />
                      <button type="submit" style={{ ...mono, background: '#2a003a', border: '1px solid #bd00ff', color: '#bd00ff', padding: '8px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#3a005a')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#2a003a')}
                      >SUBMIT</button>
                    </form>
                  </div>
                </>
              ) : !chapter2.solvedQuestions.includes('q3') ? (
                <>
                  <div style={{ ...orbitron, color: '#bd00ff', fontSize: 24, letterSpacing: 4, textAlign: 'center', marginBottom: 8, textShadow: '0 0 10px #bd00ff' }}>
                    DEBUG CHALLENGE
                  </div>
                  {/* Q3 */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(189, 0, 255, 0.2)', 
                    borderLeft: '4px solid #bd00ff',
                    background: 'linear-gradient(135deg, rgba(10,0,20,0.95) 0%, rgba(2,0,5,0.95) 100%)', 
                    padding: 32, 
                    boxShadow: '0 0 20px rgba(189,0,255,0.1), inset 0 0 30px rgba(189,0,255,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #bd00ff', borderRight: '2px solid #bd00ff' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #bd00ff', borderRight: '2px solid #bd00ff' }} />
                    
                    <div style={{ color: '#bd00ff', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 }}>
                      [DEBUG] PREDICT THE OUTPUT:
                    </div>
                    <pre style={{ ...mono, fontSize: 14, color: '#bd00ff', background: 'rgba(20,0,30,0.5)', padding: 16, borderLeft: '2px solid #bd00ff', marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
{`int count = 0;
for(int i=0; i<10; i++){
    if(i%2 != 0){
        count++;
    }
}
System.out.println(count);`}
                    </pre>
                    <form onSubmit={handleQ3} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ color: '#bd00ff', fontSize: 16 }}>▶</span>
                      <input value={q3Answer} onChange={e => setQ3Answer(e.target.value)}
                        placeholder="Enter output..." style={{ ...mono, flex: 1, background: 'rgba(30,0,40,0.3)', border: '1px solid #bd00ff', padding: '8px 12px', color: '#bd00ff', outline: 'none', fontSize: 15, letterSpacing: 1 }} />
                      <button type="submit" style={{ ...mono, background: '#2a003a', border: '1px solid #bd00ff', color: '#bd00ff', padding: '8px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#3a005a')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#2a003a')}
                      >SUBMIT</button>
                    </form>
                  </div>
                </>
              ) : null}

              {showCompletion && (
                <div style={{ textAlign: 'center', border: '1px solid #bd00ff', padding: 24, background: 'rgba(10,0,20,0.95)' }}>
                  <div style={{ ...orbitron, color: '#bd00ff', fontSize: 20, letterSpacing: 4, marginBottom: 16 }}>CASE FILE CLOSED</div>
                  <div style={{ ...mono, color: '#00e5ff', fontSize: 14, marginBottom: 8 }}>&gt; GATEWAY SECURED</div>
                  <div style={{ ...mono, color: '#00e5ff', fontSize: 14, marginBottom: 8 }}>&gt; HIDDEN TRANSMISSION DECODED</div>
                  <div style={{ ...mono, color: '#00e5ff', fontSize: 14, marginBottom: 16 }}>&gt; DEBUG SUCCESSFUL</div>
                  <div style={{ ...orbitron, color: '#00e5ff', fontSize: 18, letterSpacing: 2, marginBottom: 8, animation: 'pulseOp 1s infinite' }}>EVIDENCE FRAGMENT RECOVERED</div>
                  <div style={{ ...orbitron, color: '#00e5ff', fontSize: 48, fontWeight: 'bold', textShadow: '0 0 20px #00e5ff', margin: '16px 0' }}>
                    [O]
                  </div>
                  <div style={{ color: '#00e5ff', fontSize: 12, marginBottom: 24, fontStyle: 'italic', letterSpacing: 1 }}>Note: Collect this for future use.</div>
                  <button onClick={() => { setShowCompletion(false); completeChapter2(); }} 
                    style={{ ...orbitron, background: '#bd00ff', color: '#000', border: 'none', padding: '12px 32px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 3 }}>
                    UNLOCK CH.03
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. LIVE LOG STRIP */}
          <div style={{ width: '100%', maxWidth: 420 }}>
            {allLogs.map((l, i) => (
              <div key={i} style={{ ...mono, fontSize: 9, color: l.color, letterSpacing: 1, padding: '1px 0', opacity: 1 - i * 0.15 }}>
                {l.tag} {l.msg}
              </div>
            ))}
          </div>

        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        <div style={{
          width: 145, flexShrink: 0,
          background: 'rgba(0,5,0,0.88)',
          borderLeft: '1px solid #001a00',
          display: 'flex', flexDirection: 'column',
        }}>
          {[
            { val: `${Math.floor(erasurePct)}%`, color: '#ff0000', flicker: true, label: 'ERASED' },
            { val: '0', color: '#00ff41', flicker: false, label: 'BACKUPS LEFT' },
            { val: `${rate}`, color: '#ff0000', flicker: true, label: 'FILES/SEC' },
            { val: 'ROOT', color: '#00ff41', flicker: false, label: 'ACCESS LEVEL' },
            { val: 'DEAD', color: '#ff0000', flicker: true, label: 'BACKUP STATUS' },
            { val: 'CH.01', color: '#00ff41', flicker: false, label: 'ACTIVE CHAPTER' },
            { val: `${attempts}/3`, color: '#ff0000', flicker: false, label: 'ATTEMPTS' },
          ].map((s, i) => (
            <div key={i} style={{
              borderBottom: '1px solid #010901',
              padding: '9px 12px',
            }}>
              <div style={{
                ...orbitron,
                fontSize: 16, fontWeight: 700,
                color: s.color,
                animation: s.flicker ? 'flickerTimer 3s linear infinite' : 'none',
              }}>{s.val}</div>
              <div style={{ fontSize: 8, color: '#003300', letterSpacing: 2, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
      </>
      )}

      {/* ── KEYFRAMES ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes flickerTimer {
          0%   { opacity: 1; }
          93%  { opacity: 1; }
          93.5%{ opacity: 0.3; }
          94%  { opacity: 1; }
          97%  { opacity: 1; }
          97.5%{ opacity: 0.5; }
          98%  { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glitchFile {
          0%   { transform: translateX(0); }
          25%  { transform: translateX(-1px); }
          50%  { transform: translateX(1px); }
          75%  { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }
        @keyframes skullPulse {
          0%   { color: #00ff41; opacity: 1; }
          50%  { color: #ff0000; opacity: 0.6; }
          100% { color: #00ff41; opacity: 1; }
        }
        @keyframes dotPulseRed {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #ff0000; }
          50%       { opacity: 0.3; box-shadow: none; }
        }
        @keyframes dotPulseGreen {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 1; box-shadow: 0 0 6px #00ff41; }
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 200%; }
        }
        input::placeholder { color: #002200; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #003300; }
      `}</style>

    </div>
  );
};

export default Chapter2;
