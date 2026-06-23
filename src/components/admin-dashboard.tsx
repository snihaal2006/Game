import React, { useState, useEffect } from 'react';
import { Users, Shield, Settings, Search, Terminal, Plus, Power, Activity } from 'lucide-react';
import MatrixRain from './ui/matrix-code';

interface Team {
  id: string;
  team_name: string;
  score: number;
  active_chapter: number;
  updated_at: string;
  disqualified: boolean;
  tab_switches: number;
}

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Global Settings state
  const [globalSettings, setGlobalSettings] = useState({
    current_chapter: 0,
    round_status: 'waiting',
    round_end_time: null as string | null,
    paused_time_remaining: 0
  });

  const [timerSecs, setTimerSecs] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      if (globalSettings.round_status === 'paused') {
        setTimerSecs(globalSettings.paused_time_remaining);
        return;
      }
      if (!globalSettings.round_end_time) {
        setTimerSecs(0);
        return;
      }
      const end = new Date(globalSettings.round_end_time).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimerSecs(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [globalSettings.round_end_time, globalSettings.round_status, globalSettings.paused_time_remaining]);

  const formatRoundTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
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
        .select('id, team_name, score, active_chapter, updated_at, disqualified, tab_switches')
        .order('score', { ascending: false });
        
      if (!teamsError && teamsData) setTeams(teamsData);

      const { data: settingsData, error: settingsError } = await supabase
        .from('global_settings')
        .select('current_chapter, round_status, round_end_time, paused_time_remaining')
        .eq('id', 1)
        .single();
        
      if (!settingsError && settingsData) {
        setGlobalSettings({
          current_chapter: settingsData.current_chapter,
          round_status: settingsData.round_status,
          round_end_time: settingsData.round_end_time,
          paused_time_remaining: settingsData.paused_time_remaining
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const pushToNextRound = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const nextChapter = globalSettings.current_chapter + 1;
      
      // Calculate duration
      let duration = 0;
      if (nextChapter === 0) duration = 140;
      else if (nextChapter === 1) duration = 227;
      else if (nextChapter === 2) duration = 1260;
      else if (nextChapter === 3) duration = 2040;
      else if (nextChapter === 4) duration = 2520;
      else if (nextChapter === 5) duration = 2700;

      const newEndTime = new Date(new Date().getTime() + duration * 1000).toISOString();

      await supabase.from('global_settings').update({
        current_chapter: nextChapter,
        round_status: 'active',
        round_end_time: newEndTime,
        paused_time_remaining: 0
      }).eq('id', 1);
      
      // Update all teams
      await supabase.from('teams').update({ active_chapter: nextChapter });
      
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const togglePause = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      if (globalSettings.round_status === 'active') {
        // Pause
        let remaining = 0;
        if (globalSettings.round_end_time) {
          remaining = Math.max(0, Math.floor((new Date(globalSettings.round_end_time).getTime() - new Date().getTime()) / 1000));
        }
        await supabase.from('global_settings').update({
          round_status: 'paused',
          round_end_time: null,
          paused_time_remaining: remaining
        }).eq('id', 1);
      } else if (globalSettings.round_status === 'paused') {
        // Resume
        const newEndTime = new Date(new Date().getTime() + globalSettings.paused_time_remaining * 1000).toISOString();
        await supabase.from('global_settings').update({
          round_status: 'active',
          round_end_time: newEndTime,
          paused_time_remaining: 0
        }).eq('id', 1);
      }
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLock = async () => {
    try {
      const { supabase } = await import('../lib/supabase');
      const newStatus = globalSettings.round_status === 'waiting' ? 'active' : 'waiting';
      
      let newEndTime = globalSettings.round_end_time;
      if (newStatus === 'active' && globalSettings.round_status === 'waiting') {
        // Just unlocked, but waiting doesn't pause time, so let's just keep end time.
        // Wait, if they were waiting, they might not have a timer.
      }

      await supabase.from('global_settings').update({
        round_status: newStatus
      }).eq('id', 1);
      fetchDashboardData();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleDisqualify = async (teamId: string, currentStatus: boolean) => {
    try {
      const { supabase } = await import('../lib/supabase');
      await supabase.from('teams').update({ disqualified: !currentStatus }).eq('id', teamId);
      fetchDashboardData();
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
          <div className="flex flex-col space-y-2 text-right">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/50 text-green-400 px-6 py-2 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team</span>
            </button>
          </div>
        </div>

        {/* Round Controls */}
        <div className="bg-black/60 border border-blue-500/30 p-6 rounded-2xl backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.1)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-blue-500/50 text-xs uppercase tracking-widest mb-1">Global Round Status</span>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-400">Chapter {globalSettings.current_chapter}</span>
                <span className={`px-3 py-1 text-xs border rounded-full uppercase tracking-wider ${
                  globalSettings.round_status === 'active' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
                  globalSettings.round_status === 'paused' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
                  'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
                }`}>
                  {globalSettings.round_status}
                </span>
              </div>
              <div className="mt-2 text-blue-400 font-mono tracking-widest text-lg font-bold">
                {globalSettings.round_status === 'active' || globalSettings.round_status === 'paused' ? (
                  <>TIME REMAINING: <span className="text-white">{formatRoundTime(timerSecs)}</span></>
                ) : (
                  <>WAITING FOR OVERSEER</>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={pushToNextRound}
                className="bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30 border px-6 py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 flex-1 md:flex-none"
              >
                <span>Push Next Round</span>
              </button>
              
              <button 
                onClick={togglePause}
                disabled={globalSettings.round_status === 'waiting'}
                className={`${globalSettings.round_status === 'paused' ? 'bg-green-600/20 border-green-500/50 text-green-400 hover:bg-green-600/30' : 'bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30'} border px-6 py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 flex-1 md:flex-none disabled:opacity-50`}
              >
                <Power className="w-4 h-4" />
                <span>{globalSettings.round_status === 'paused' ? 'Resume' : 'Pause'}</span>
              </button>
              
              <button 
                onClick={toggleLock}
                className={`${globalSettings.round_status === 'waiting' ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30' : 'bg-orange-600/20 border-orange-500/50 text-orange-400 hover:bg-orange-600/30'} border px-6 py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 flex-1 md:flex-none`}
              >
                <span>{globalSettings.round_status === 'waiting' ? 'Unlock Round' : 'Lock Round'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-black/60 border border-green-500/30 rounded-2xl overflow-hidden backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-green-500/30 text-green-500/70 text-xs uppercase tracking-wider bg-green-500/5">
                <th className="p-4 md:p-6">Team ID / Name</th>
                <th className="p-4 md:p-6">Status</th>
                <th className="p-4 md:p-6">Tabs</th>
                <th className="p-4 md:p-6">Current Sector</th>
                <th className="p-4 md:p-6">Score</th>
                <th className="p-4 md:p-6">Last Active</th>
                <th className="p-4 md:p-6 text-right">Actions</th>
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
                          <div className={`font-bold transition-colors ${team.disqualified ? 'text-red-500 line-through' : 'text-white group-hover:text-green-300'}`}>{team.team_name}</div>
                          <div className="text-xs text-white/40 mt-0.5">ID: {team.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs border ${
                        team.disqualified ? 'bg-red-900/40 border-red-500/50 text-red-400' :
                        online ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-gray-500/10 border-gray-500/50 text-gray-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${team.disqualified ? 'bg-red-500' : online ? 'bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'bg-gray-400'}`}></span>
                        <span>{team.disqualified ? 'DISQUALIFIED' : online ? 'ONLINE' : 'OFFLINE'}</span>
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-white/80">
                      <span className={team.tab_switches >= 4 ? 'text-red-400 font-bold' : ''}>{team.tab_switches} / 4</span>
                    </td>
                    <td className="p-4 md:p-6 text-white/80">Sector {team.active_chapter}</td>
                    <td className="p-4 md:p-6 font-bold text-green-400">{team.score.toLocaleString()}</td>
                    <td className="p-4 md:p-6 text-sm text-white/50">{formatTimeAgo(team.updated_at)}</td>
                    <td className="p-4 md:p-6 text-right">
                      <button 
                        onClick={() => toggleDisqualify(team.id, team.disqualified)}
                        className={`px-3 py-1 text-xs border rounded-lg transition-colors ${
                          team.disqualified 
                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20' 
                            : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                        }`}
                      >
                        {team.disqualified ? 'Reinstate' : 'Disqualify'}
                      </button>
                    </td>
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
