import React, { useState, useEffect } from 'react';
import { Users, Shield, Settings, Search, Terminal, Plus, Power, Activity } from 'lucide-react';
import MatrixRain from './ui/matrix-code';

interface Team {
  id: string;
  team_name: string;
  score: number;
  active_chapter: number;
  updated_at: string;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSecret, setNewTeamSecret] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, team_name, score, active_chapter, updated_at')
        .order('score', { ascending: false });
        
      if (!teamsError && teamsData) setTeams(teamsData);

      const { data: settingsData, error: settingsError } = await supabase
        .from('global_settings')
        .select('game_paused')
        .eq('id', 1)
        .single();
        
      if (!settingsError && settingsData) setIsPaused(settingsData.game_paused);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const togglePause = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const newState = !isPaused;
      setIsPaused(newState); // Optimistic update
      await supabase.from('global_settings').update({ game_paused: newState }).eq('id', 1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setIsAdding(true);
    try {
      const { supabase } = await import('../lib/supabase');
      const { error } = await supabase.from('teams').insert([{
        team_name: newTeamName,
        password: newTeamSecret,
        score: 0,
        time_remaining: 10800,
        active_chapter: 1,
        unlocked_chapters: [1]
      }]);

      if (error) throw error;

      setShowAddModal(false);
      setNewTeamName('');
      setNewTeamSecret('');
      fetchDashboardData();
    } catch (err: any) {
      setAddError(err.message || 'Failed to create team');
    } finally {
      setIsAdding(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    return `${Math.floor(diff / 3600)} hrs ago`;
  };

  const isOnline = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    return diff < 120; // Online if active in last 2 mins
  };

  const filteredTeams = teams.filter(t => t.team_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative min-h-screen bg-black text-white p-4 md:p-8 font-mono">
      <MatrixRain fontSize={12} color="#22c55e" fadeOpacity={0.05} speed={0.8} />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black/60 border border-green-500/30 p-6 rounded-2xl backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.1)] gap-6 md:gap-0">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12 text-green-500" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-500 tracking-widest uppercase flex items-center space-x-2">
                <span>System Overseer</span>
                <Terminal className="w-5 h-5 text-green-400 animate-pulse" />
              </h1>
              <p className="text-green-500/60 text-xs md:text-sm mt-1">ACCESS LEVEL: ROOT / OMNISCIENT</p>
            </div>
          </div>
          
          <div className="flex space-x-3 md:space-x-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-green-500/5 border border-green-500/20 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
              <span className="text-green-500/50 text-[10px] md:text-xs uppercase mb-1">Active Nodes</span>
              <span className="text-xl md:text-2xl font-bold text-green-400">{teams.filter(t => isOnline(t.updated_at)).length}</span>
            </div>
            <div className="flex-1 md:flex-none bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
              <span className="text-blue-500/50 text-[10px] md:text-xs uppercase mb-1">Sys Load</span>
              <span className="text-xl md:text-2xl font-bold text-blue-400"><Activity className="w-6 h-6 animate-pulse" /></span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500/50 w-5 h-5" />
            <input 
              type="text" 
              placeholder="SEARCH ENTITIES..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-green-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-green-500/30 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
            />
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team</span>
            </button>
            <button 
              onClick={togglePause}
              className={`${isPaused ? 'bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30' : 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30'} border px-6 py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-2`}
            >
              <Power className="w-4 h-4" />
              <span>{isPaused ? 'Resume Game' : 'Pause Game'}</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-black/60 border border-green-500/30 rounded-2xl overflow-hidden backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-green-500/30 text-green-500/70 text-xs uppercase tracking-wider bg-green-500/5">
                <th className="p-4 md:p-6">Team ID / Name</th>
                <th className="p-4 md:p-6">Status</th>
                <th className="p-4 md:p-6">Current Sector</th>
                <th className="p-4 md:p-6">Score</th>
                <th className="p-4 md:p-6">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-500/10">
              {filteredTeams.map((team) => {
                const online = isOnline(team.updated_at);
                return (
                  <tr key={team.id} className="hover:bg-green-500/5 transition-colors group">
                    <td className="p-4 md:p-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-green-300 transition-colors">{team.team_name}</div>
                          <div className="text-xs text-white/40 mt-0.5">ID: {team.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs border ${
                        online ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'bg-red-400'}`}></span>
                        <span>{online ? 'ONLINE' : 'OFFLINE'}</span>
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-white/80">Sector {team.active_chapter}</td>
                    <td className="p-4 md:p-6 font-bold text-green-400">{team.score.toLocaleString()}</td>
                    <td className="p-4 md:p-6 text-sm text-white/50">{formatTimeAgo(team.updated_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTeams.length === 0 && (
             <div className="p-12 text-center text-green-500/50">
               NO ENTITIES FOUND MATCHING QUERY
             </div>
          )}
        </div>
        
      </div>

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-black/90 border border-green-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(34,197,94,0.15)] animate-slideUp">
            <h2 className="text-2xl font-bold text-green-500 tracking-widest uppercase mb-6 flex items-center space-x-3">
              <Plus className="w-6 h-6" />
              <span>Inject New Team</span>
            </h2>
            
            <form onSubmit={handleAddTeam} className="space-y-4">
              {addError && <div className="text-red-400 bg-red-900/20 border border-red-500/30 p-3 rounded-lg text-sm animate-pulse">{addError}</div>}
              <div>
                <label className="block text-green-500/70 text-xs uppercase mb-2">Team Name</label>
                <input 
                  type="text" 
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full bg-black border border-green-500/30 rounded-xl py-3 px-4 text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none"
                  placeholder="e.g. Neon Samurai"
                />
              </div>
              <div>
                <label className="block text-green-500/70 text-xs uppercase mb-2">Team Secret (Password)</label>
                <input 
                  type="text" 
                  required
                  value={newTeamSecret}
                  onChange={(e) => setNewTeamSecret(e.target.value)}
                  className="w-full bg-black border border-green-500/30 rounded-xl py-3 px-4 text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 outline-none"
                  placeholder="e.g. hack_the_planet"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 rounded-xl uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isAdding}
                  className="flex-1 py-3 bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-600/30 rounded-xl uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isAdding ? 'Injecting...' : 'Inject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
