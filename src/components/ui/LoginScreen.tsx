import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { supabase } from '../../lib/supabase';

export const LoginScreen: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setTeam = useGameStore(state => state.setTeam);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !password) {
      setError('Team name and password are required');
      return;
    }
    
    setLoading(true);
    setError('');

    // For simplicity, we use email mapping: teamname@zeroday.local
    const email = `${teamName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@zeroday.local`;

    try {
      if (isRegistering) {
        // Register
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        
        if (data.user) {
          // Initialize team row
          const { error: insertError } = await supabase.from('teams').insert([{
            id: data.user.id,
            team_name: teamName,
            score: 0,
            time_remaining: 10800,
            active_chapter: 1,
            unlocked_chapters: [1]
          }]);
          if (insertError) throw insertError;
          setTeam(data.user.id, teamName);
        }
      } else {
        // Login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
        
        if (data.user) {
          // Fetch team state
          const { data: teamData, error: fetchError } = await supabase
            .from('teams')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (fetchError) throw fetchError;
          
          setTeam(data.user.id, teamData.team_name);
          // Sync state to zustand
          useGameStore.setState({
            score: teamData.score,
            timeRemaining: teamData.time_remaining,
            activeChapter: teamData.active_chapter,
            unlockedChapters: teamData.unlocked_chapters,
            chapter1: teamData.chapter1 || useGameStore.getState().chapter1,
            chapter2: teamData.chapter2 || useGameStore.getState().chapter2,
            chapter3: teamData.chapter3 || useGameStore.getState().chapter3,
            chapter4: teamData.chapter4 || useGameStore.getState().chapter4,
            chapter5: teamData.chapter5 || useGameStore.getState().chapter5,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const orbitron = { fontFamily: "'Orbitron', sans-serif" };
  const mono = { fontFamily: "'Share Tech Mono', monospace" };

  return (
    <div style={{
      ...mono,
      position: 'fixed', inset: 0,
      background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      {/* Matrix rain background could be added here */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent 2px, rgba(0,0,0,0.06) 2px 4px)',
        pointerEvents: 'none', zIndex: 1
      }} />

      <div style={{
        maxWidth: 400, width: '100%',
        background: 'rgba(0,10,0,0.9)',
        border: '1px solid #00ff41',
        padding: 32,
        position: 'relative', zIndex: 10,
        boxShadow: '0 0 30px rgba(0,255,65,0.2)'
      }}>
        <div style={{ ...orbitron, fontSize: 24, color: '#00ff41', textAlign: 'center', marginBottom: 24, letterSpacing: 4 }}>
          SYSTEM LOGIN
        </div>
        
        {error && (
          <div style={{ color: '#ff0000', fontSize: 12, marginBottom: 16, borderLeft: '2px solid #ff0000', paddingLeft: 8 }}>
            [ERROR]: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ color: '#00ff41', fontSize: 12, marginBottom: 4 }}>TEAM DESIGNATION</div>
            <input 
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="Enter Team Name..."
              style={{
                ...mono, width: '100%', background: 'rgba(0,30,0,0.5)', border: '1px solid #005500', 
                color: '#00ff41', padding: '10px 12px', outline: 'none'
              }}
            />
          </div>
          <div>
            <div style={{ color: '#00ff41', fontSize: 12, marginBottom: 4 }}>ACCESS KEY</div>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Password..."
              style={{
                ...mono, width: '100%', background: 'rgba(0,30,0,0.5)', border: '1px solid #005500', 
                color: '#00ff41', padding: '10px 12px', outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              ...orbitron,
              background: '#00ff41', color: '#000', border: 'none', padding: 12,
              marginTop: 8, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', letterSpacing: 2
            }}
          >
            {loading ? 'PROCESSING...' : (isRegistering ? 'INITIALIZE TEAM' : 'AUTHENTICATE')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            style={{ ...mono, background: 'none', border: 'none', color: '#00aa00', cursor: 'pointer', textDecoration: 'underline', fontSize: 12 }}
          >
            {isRegistering ? 'Already have an assignment? Login.' : 'New team assignment? Register.'}
          </button>
        </div>
      </div>
    </div>
  );
};
