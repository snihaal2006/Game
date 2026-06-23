import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Cpu } from 'lucide-react';
import MatrixRain from './ui/matrix-code';

interface TeamScore {
  id: string;
  name: string;
  score: number;
  chapter: number;
}

const Scoreboard = () => {
  const [leaderboard, setLeaderboard] = useState<TeamScore[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('teams')
          .select('id, team_name, score, active_chapter')
          .order('score', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        if (data) {
          setLeaderboard(data.map(team => ({
            id: team.id,
            name: team.team_name,
            score: team.score,
            chapter: team.active_chapter
          })));
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    
    fetchLeaderboard();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white p-4 md:p-8 overflow-hidden">
      <MatrixRain fontSize={14} color="#a855f7" fadeOpacity={0.1} speed={0.5} />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8 md:mb-12 animate-fadeIn pt-8">
          <Trophy className="text-yellow-400 w-10 h-10 md:w-12 md:h-12 hidden md:block" />
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 tracking-widest uppercase text-center">
            Global Rankings
          </h1>
          <Trophy className="text-yellow-400 w-10 h-10 md:w-12 md:h-12 hidden md:block" />
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 md:p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] animate-slideUp">
          <div className="hidden md:grid grid-cols-12 gap-4 text-purple-400 font-mono text-sm uppercase tracking-wider mb-4 px-6 py-3 border-b border-purple-500/30">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-6">Team Name</div>
            <div className="col-span-2 text-center">Sector</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((team, index) => (
              <div 
                key={team.id}
                className={`flex flex-col md:grid md:grid-cols-12 gap-4 items-center px-4 md:px-6 py-4 rounded-xl border transition-all hover:scale-[1.01] ${
                  index === 0 ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]' :
                  index === 1 ? 'bg-gray-400/10 border-gray-400/50 text-gray-300' :
                  index === 2 ? 'bg-amber-700/10 border-amber-700/50 text-amber-600' :
                  'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                }`}
              >
                <div className="md:col-span-1 flex justify-center w-full md:w-auto">
                  {index === 0 ? <Trophy className="w-8 h-8 md:w-6 md:h-6" /> :
                   index === 1 ? <Medal className="w-8 h-8 md:w-6 md:h-6" /> :
                   index === 2 ? <Medal className="w-8 h-8 md:w-6 md:h-6" /> :
                   <span className="font-mono text-xl md:text-lg">#{index + 1}</span>}
                </div>
                
                <div className="md:col-span-6 font-bold text-xl md:text-lg flex items-center space-x-3 w-full md:w-auto justify-center md:justify-start text-center md:text-left">
                  <Cpu className="w-5 h-5 opacity-50 hidden md:block" />
                  <span>{team.name}</span>
                </div>
                
                <div className="md:col-span-2 text-center font-mono w-full md:w-auto text-sm md:text-base text-white/70 md:text-inherit">
                  Sector {team.chapter}
                </div>
                
                <div className="md:col-span-3 text-center md:text-right font-mono text-2xl md:text-xl font-bold tracking-wider flex items-center justify-center md:justify-end space-x-2 w-full md:w-auto">
                  <span>{team.score.toLocaleString()}</span>
                  <Star className="w-5 h-5 md:w-4 md:h-4 opacity-70 text-yellow-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
