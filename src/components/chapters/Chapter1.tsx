import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';

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

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const Chapter1: React.FC = () => {
  const { chapter1, decryptChapter1, solveChapter1Question, completeChapter1 } = useGameStore();

  // Timer state: 03:47 = 227 seconds
  const [timerSecs, setTimerSecs] = useState(227);

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
  const [overrideKey, setOverrideKey] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [inputBorderRed, setInputBorderRed] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState('ENTER OVERRIDE KEY...');
  const [extraLogs, setExtraLogs] = useState<{ tag: string; msg: string; color: string }[]>([]);

  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [q3Answer, setQ3Answer] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState('');
  const [isProceedingToCh2, setIsProceedingToCh2] = useState(false);
  const [proceedStep, setProceedStep] = useState(0);

  // ── Effects ───────────────────────────────────────────────────────────────────

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => setTimerSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

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
    if (chapter1.solvedQuestions.length === 3 && !chapter1.evidenceCollected.includes('V')) {
      setTimeout(() => setShowCompletion(true), 1000);
    }
  }, [chapter1.solvedQuestions, chapter1.evidenceCollected]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `00:${m}:${sec}`;
  };

  const handleOverride = () => {
    if (!overrideKey.trim()) {
      setInputBorderRed(true);
      return;
    }
    setInputBorderRed(false);
    if (overrideKey.trim().toUpperCase() === 'ZSSCH') {
      setTransitionText('OVERRIDE ACCEPTED. RE-ROUTING TO ROOT...');
      setIsTransitioning(true);
      setTimeout(() => {
        decryptChapter1();
        setIsTransitioning(false);
      }, 3500);
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const errLog = { tag: '[ERR]', msg: `OVERRIDE KEY "${overrideKey.substring(0, 8)}..." REJECTED`, color: '#ff0000' };
    setLogs(prev => [errLog, ...prev].slice(0, 5));
    setOverrideKey('');
    setInputPlaceholder('WRONG KEY — TRY AGAIN...');
  };

  const handleQ1 = (e: React.FormEvent) => {
    e.preventDefault();
    const a = q1Answer.trim().toLowerCase();
    if (a === '192.168.1.99' || a === '.99' || a === '99') {
      setTransitionText('ARP IMPOSTER VERIFIED. LOADING MAIN TERMINAL...');
      setIsTransitioning(true);
      setTimeout(() => {
        solveChapter1Question('q1', 100);
        setIsTransitioning(false);
      }, 3500);
    }
  };

  const handleQ2 = (e: React.FormEvent) => {
    e.preventDefault();
    const a = q2Answer.trim().toLowerCase();
    const valid = ["default credentials", "open wifi", "guest network", "default password", "no authentication", "open network"];
    if (valid.some(v => a.includes(v))) {
      setTransitionText('VULNERABILITY IDENTIFIED. ACCESSING NEXT NODE...');
      setIsTransitioning(true);
      setTimeout(() => {
        solveChapter1Question('q2', 200);
        setIsTransitioning(false);
      }, 3500);
    }
  };

  const handleQ3 = (e: React.FormEvent) => {
    e.preventDefault();
    const a = q3Answer.trim().toLowerCase();
    const valid = ["colon", "missing colon", "range(1, 256):", "syntax error"];
    if (valid.some(v => a.includes(v))) {
      setTransitionText('BUG IDENTIFIED. DECRYPTING FINAL NODE...');
      setIsTransitioning(true);
      setTimeout(() => {
        solveChapter1Question('q3', 300);
        setIsTransitioning(false);
      }, 3500);
    }
  };



  const handleProceed = () => {
    setIsProceedingToCh2(true);
    completeChapter1();
    
    // Step sequence
    setTimeout(() => setProceedStep(1), 1500); // Analyzing recovered data...
    setTimeout(() => setProceedStep(2), 3000); // Decrypting next incident...
    setTimeout(() => setProceedStep(3), 4500); // Loading Case File 02...
    setTimeout(() => {
      useGameStore.getState().setActiveChapter(2);
    }, 6000);
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
            textShadow: '0 0 10px rgba(255,0,0,0.5)'
          }}>
            PROJECT ZERO DAY
          </div>
        </div>

        {/* Right: label */}
        <div style={{ fontSize: 9, color: '#004400', letterSpacing: 2 }}>
          PROJECT: ZERO-DAY // CLASSIFIED
        </div>
      </div>

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
              color: '#ff0000',
              animation: 'flickerTimer 3s linear infinite',
              lineHeight: 1,
            }}>
              {formatTime(timerSecs)}
            </div>
            <div style={{ fontSize: 9, color: '#004400', letterSpacing: 4, marginTop: 4 }}>
              UNTIL TOTAL ERASURE
            </div>
          </div>

          {/* 3. WARNING MODAL / QUESTIONS */}
          {!chapter1.isDecrypted ? (
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
                  textShadow: '0 0 5px rgba(0,255,65,0.4)'
                }}>
                  [ ENTER OVERRIDE KEY TO HALT DESTRUCTION ]
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

                {/* Input */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  border: `1px solid ${inputBorderRed ? '#ff0000' : '#003a00'}`,
                  background: '#000', padding: '8px 10px',
                  marginBottom: 10,
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ color: '#00ff41', marginRight: 8, fontSize: 12 }}>▶</span>
                  <input
                    type="text"
                    value={overrideKey}
                    onChange={e => { setOverrideKey(e.target.value); setInputBorderRed(false); }}
                    onKeyDown={e => e.key === 'Enter' && handleOverride()}
                    placeholder={inputPlaceholder}
                    style={{
                      ...mono,
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      color: '#00ff41', caretColor: '#00ff41', fontSize: 11,
                    }}
                  />
                </div>

                {attempts > 0 && (
                  <div style={{ fontSize: 8, color: '#ff0000', marginBottom: 8, letterSpacing: 1 }}>
                    ⚠ {attempts} FAILED OVERRIDE ATTEMPT{attempts > 1 ? 'S' : ''} — SYSTEM IS LOGGING
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={handleOverride}
                  style={{
                    ...orbitron,
                    width: '100%', padding: '10px', background: '#ff0000',
                    border: 'none', cursor: 'pointer',
                    fontSize: 10, fontWeight: 700, letterSpacing: 3,
                    color: '#000', position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#cc0000')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#ff0000')}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>[ ABORT ERASURE — ENTER KEY ]</span>
                  <div style={{
                    position: 'absolute', top: 0, bottom: 0,
                    width: '60%', left: '-60%',
                    background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.2), transparent)',
                    animation: 'shimmer 2s infinite',
                  }} />
                </button>
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
              
              {!chapter1.solvedQuestions.includes('q1') ? (
                <>
                  {/* Intro Text */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(0, 255, 65, 0.2)', 
                    borderLeft: '4px solid #00ff41',
                    background: 'linear-gradient(135deg, rgba(0,20,0,0.95) 0%, rgba(0,5,0,0.95) 100%)', 
                    padding: 24, 
                    boxShadow: '0 0 20px rgba(0,255,65,0.1), inset 0 0 30px rgba(0,255,65,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />
                    
                    <div style={{ fontSize: 14, color: '#00ff41', marginBottom: 8, letterSpacing: 1, lineHeight: 1.6, textShadow: '0 0 8px rgba(0,255,65,0.3)' }}>
                      03:00 AM. Every screen on campus goes black. A masked voice: 'We are The Void. You have 3 hours.' The Dean gives you access to the network logs. The breach started somewhere on the campus Wi-Fi during last night's fest. Find the rogue device.
                    </div>
                  </div>

                  {/* Q1 */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(0, 255, 65, 0.2)', 
                    borderLeft: '4px solid #ff0000',
                    background: 'linear-gradient(135deg, rgba(0,20,0,0.95) 0%, rgba(0,5,0,0.95) 100%)', 
                    padding: 24, 
                    boxShadow: '0 0 20px rgba(0,255,65,0.1), inset 0 0 30px rgba(0,255,65,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #ff0000', borderRight: '2px solid #ff0000' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #ff0000', borderRight: '2px solid #ff0000' }} />
                    
                    <div style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 }}>
                      <span style={{ color: '#00ff41' }}>[NETWORK ANALYSIS]</span>{' '}
                      <span style={{ color: '#ff0000', textShadow: '0 0 8px rgba(255,0,0,0.6)' }}>ARP SPOOFING:</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#00cc33', marginBottom: 16, letterSpacing: 1, lineHeight: 1.5 }}>
                      <span style={{ color: '#ff0000', fontWeight: 'bold' }}>START QUESTION.</span> A suspicious <span style={{ color: '#ff0000' }}>ARP log</span> was captured during the fest. Study it and identify which device is the imposter.
                    </div>
                    <pre style={{ ...mono, fontSize: 13, color: '#00ff41', background: 'rgba(0,30,0,0.5)', padding: 16, borderLeft: '2px solid #00ff41', marginBottom: 16, margin: '0 0 16px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
{`[ARP LOG - 22:47:13]
192.168.1.99 → BROADCAST  "Who has 192.168.1.50? Tell 192.168.1.99"
192.168.1.99 → ALL        "192.168.1.50 is at AA:BB:CC:DD:EE:FF"
192.168.1.1  → 192.168.1.50  [Traffic now rerouted]

Device table:
  .1    = Campus router      (known)
  .50   = Dean's laptop      (known)  
  .99   = ???                (unknown device)`}
                    </pre>
                    <form onSubmit={handleQ1} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ color: '#00ff41', fontSize: 16 }}>▶</span>
                      <input value={q1Answer} onChange={e => setQ1Answer(e.target.value)}
                        placeholder="Enter IP or device ID..." style={{ ...mono, flex: 1, background: 'rgba(0,40,0,0.3)', border: '1px solid #005a00', padding: '8px 12px', color: '#00ff41', outline: 'none', fontSize: 15, letterSpacing: 1 }} />
                      <button type="submit" style={{ ...mono, background: '#003a00', border: '1px solid #00ff41', color: '#00ff41', padding: '8px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#005a00')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#003a00')}
                      >SUBMIT</button>
                    </form>
                  </div>
                </>
              ) : !chapter1.solvedQuestions.includes('q2') ? (
                <>
                  {/* MAIN TERMINAL HEADER */}
                  <div style={{ ...orbitron, color: '#00ff41', fontSize: 24, letterSpacing: 4, textAlign: 'center', marginBottom: 8, textShadow: '0 0 10px #00ff41' }}>
                    MAIN TERMINAL ACCESS
                  </div>
                  
                  {/* Q2 */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(0, 255, 65, 0.2)', 
                    borderLeft: '4px solid #00ff41',
                    background: 'linear-gradient(135deg, rgba(0,20,0,0.95) 0%, rgba(0,5,0,0.95) 100%)', 
                    padding: 32, 
                    boxShadow: '0 0 20px rgba(0,255,65,0.1), inset 0 0 30px rgba(0,255,65,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #00ff41', borderRight: '2px solid #00ff41' }} />
                    
                    <div style={{ color: '#00ff41', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 }}>
                      [NETWORK INTELLIGENCE] VULNERABILITY ANALYSIS:
                    </div>
                    <div style={{ fontSize: 14, color: '#00cc33', marginBottom: 16, lineHeight: 1.5 }}>
                      The Void left this message on the hacked projector screen. What network vulnerability does it point to?
                    </div>
                    <pre style={{ ...mono, fontSize: 14, color: '#00ff41', background: 'rgba(0,30,0,0.5)', padding: 16, borderLeft: '2px solid #00ff41', marginBottom: 24, fontStyle: 'italic', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
"We entered through a door that everyone uses
 but nobody ever locks.
 It had a welcome mat, no key required."
                    </pre>
                    <form onSubmit={handleQ2} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ color: '#00ff41', fontSize: 16 }}>▶</span>
                      <input value={q2Answer} onChange={e => setQ2Answer(e.target.value)}
                        placeholder="Enter vulnerability..." style={{ ...mono, flex: 1, background: 'rgba(0,40,0,0.3)', border: '1px solid #005a00', padding: '8px 12px', color: '#00ff41', outline: 'none', fontSize: 15, letterSpacing: 1 }} />
                      <button type="submit" style={{ ...mono, background: '#003a00', border: '1px solid #00ff41', color: '#00ff41', padding: '8px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#005a00')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#003a00')}
                      >SUBMIT</button>
                    </form>
                  </div>
                </>
              ) : !chapter1.solvedQuestions.includes('q3') ? (
                <>
                  <div style={{ ...orbitron, color: '#00ff41', fontSize: 24, letterSpacing: 4, textAlign: 'center', marginBottom: 8, textShadow: '0 0 10px #00ff41' }}>
                    MAIN TERMINAL ACCESS
                  </div>
                  {/* Q3 */}
                  <div style={{ 
                    position: 'relative',
                    border: '1px solid rgba(0, 255, 65, 0.2)', 
                    borderLeft: '4px solid #ff0000',
                    background: 'linear-gradient(135deg, rgba(0,20,0,0.95) 0%, rgba(0,5,0,0.95) 100%)', 
                    padding: 32, 
                    boxShadow: '0 0 20px rgba(0,255,65,0.1), inset 0 0 30px rgba(0,255,65,0.02)' 
                  }}>
                    <div style={{ position: 'absolute', top: -1, right: -1, width: 10, height: 10, borderTop: '2px solid #ff0000', borderRight: '2px solid #ff0000' }} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 10, height: 10, borderBottom: '2px solid #ff0000', borderRight: '2px solid #ff0000' }} />
                    
                    <div style={{ color: '#ff0000', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 }}>
                      [CODE ANALYSIS] SCRIPT DEBUGGING:
                    </div>
                    <div style={{ fontSize: 14, color: '#00cc33', marginBottom: 16, lineHeight: 1.5 }}>
                      Your teammate wrote a Python script to find all devices on the subnet. It crashes before scanning a single IP. Tell us what the bug is.
                    </div>
                    <pre style={{ ...mono, fontSize: 13, color: '#00ff41', background: 'rgba(0,30,0,0.5)', padding: 16, borderLeft: '2px solid #ff0000', marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
{`import socket

def scan_network(subnet):
    devices = []
    for i in range(1, 256)
        ip = subnet + str(i)
        try:
            socket.setdefaulttimeout(0.5)
            socket.gethostbyaddr(ip)
            devices.append(ip)
        except:
            pass
    return devices

print(scan_network("192.168.1."))`}
                    </pre>
                    <form onSubmit={handleQ3} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ color: '#00ff41', fontSize: 16 }}>▶</span>
                      <input value={q3Answer} onChange={e => setQ3Answer(e.target.value)}
                        placeholder="Enter the bug..." style={{ ...mono, flex: 1, background: 'rgba(0,40,0,0.3)', border: '1px solid #005a00', padding: '8px 12px', color: '#00ff41', outline: 'none', fontSize: 15, letterSpacing: 1 }} />
                      <button type="submit" style={{ ...mono, background: '#003a00', border: '1px solid #00ff41', color: '#00ff41', padding: '8px 24px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 2, transition: 'all 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#005a00')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#003a00')}
                      >SUBMIT</button>
                    </form>
                  </div>
                </>
              ) : null}

              {showCompletion && !isProceedingToCh2 && (
                <div style={{ textAlign: 'center', border: '1px solid #00ff41', padding: 24, background: 'rgba(0,20,0,0.95)' }}>
                  <div style={{ ...orbitron, color: '#00ff41', fontSize: 20, letterSpacing: 4, marginBottom: 16 }}>CASE CLOSED — [D] RECOVERED</div>
                  <button onClick={handleProceed}
                    style={{ ...orbitron, background: '#00ff41', color: '#000', border: 'none', padding: '12px 32px', cursor: 'pointer', fontSize: 14, fontWeight: 'bold', letterSpacing: 3 }}>
                    PROCEED TO CH.02
                  </button>
                </div>
              )}

              {isProceedingToCh2 && (
                <div style={{ 
                  textAlign: 'center', border: '1px solid #00ff41', padding: 40, background: 'rgba(0,10,0,0.98)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16
                }}>
                  <div style={{ ...orbitron, color: '#00ff41', fontSize: 24, letterSpacing: 4, animation: 'pulseOp 1s infinite' }}>
                    EVIDENCE FRAGMENT RECOVERED
                  </div>
                  <div style={{ ...orbitron, color: '#00ff41', fontSize: 48, fontWeight: 'bold', textShadow: '0 0 20px #00ff41', margin: '20px 0' }}>
                    [D]
                  </div>
                  <div style={{ color: '#00cc33', fontSize: 12, marginTop: 8, fontStyle: 'italic', letterSpacing: 1 }}>Note: Collect this for future use.</div>
                  
                  <div style={{ ...mono, color: '#00cc33', fontSize: 14, minHeight: 80, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {proceedStep >= 1 && <div>&gt; Analyzing recovered data...</div>}
                    {proceedStep >= 2 && <div>&gt; Decrypting next incident...</div>}
                    {proceedStep >= 3 && <div style={{ color: '#00ff41' }}>&gt; Loading Case File 02...</div>}
                  </div>
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

export default Chapter1;
