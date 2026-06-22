import React, { useState } from 'react';
import { Users, Shield, Settings, Search, Edit2, Terminal } from 'lucide-react';
import MatrixRain from './ui/matrix-code';

// Mock data
const MOCK_TEAMS = [
  { id: '1', name: 'Neon Samurai', score: 4500, chapter: 5, status: 'ONLINE', lastActive: '2 mins ago' },
  { id: '2', name: 'Cyber Phantoms', score: 4200, chapter: 5, status: 'ONLINE', lastActive: 'Just now' },
  { id: '3', name: 'Binary Bandits', score: 3800, chapter: 4, status: 'OFFLINE', lastActive: '1 hr ago' },
  { id: '4', name: 'Quantum Hackers', score: 3100, chapter: 3, status: 'ONLINE', lastActive: '5 mins ago' },
  { id: '5', name: 'Script Kiddies', score: 100, chapter: 1, status: 'OFFLINE', lastActive: '2 days ago' },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="relative min-h-screen bg-black text-white p-4 md:p-8">
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
              <p className="text-green-500/60 font-mono text-xs md:text-sm mt-1">ACCESS LEVEL: ROOT / OMNISCIENT</p>
            </div>
          </div>
          
          <div className="flex space-x-3 md:space-x-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-green-500/5 border border-green-500/20 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
              <span className="text-green-500/50 text-[10px] md:text-xs uppercase mb-1 font-mono">Active Nodes</span>
              <span className="text-xl md:text-2xl font-bold text-green-400">24</span>
            </div>
            <div className="flex-1 md:flex-none bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 md:p-4 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px]">
              <span className="text-blue-500/50 text-[10px] md:text-xs uppercase mb-1 font-mono">Sys Load</span>
              <span className="text-xl md:text-2xl font-bold text-blue-400">12%</span>
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
              className="w-full bg-black/40 border border-green-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-green-500/30 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 font-mono transition-all"
            />
          </div>
          <button className="bg-green-600/10 hover:bg-green-600/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-xl font-mono uppercase tracking-wider transition-colors flex items-center justify-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Global Settings</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-black/60 border border-green-500/30 rounded-2xl overflow-hidden backdrop-blur-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-green-500/30 text-green-500/70 font-mono text-xs uppercase tracking-wider bg-green-500/5">
                <th className="p-4 md:p-6">Team ID / Name</th>
                <th className="p-4 md:p-6">Status</th>
                <th className="p-4 md:p-6">Current Sector</th>
                <th className="p-4 md:p-6">Score</th>
                <th className="p-4 md:p-6">Last Active</th>
                <th className="p-4 md:p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-500/10">
              {MOCK_TEAMS.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((team) => (
                <tr key={team.id} className="hover:bg-green-500/5 transition-colors group">
                  <td className="p-4 md:p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <Users className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white group-hover:text-green-300 transition-colors">{team.name}</div>
                        <div className="text-xs text-white/40 font-mono mt-0.5">ID: {team.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 md:p-6">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono border ${
                      team.status === 'ONLINE' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${team.status === 'ONLINE' ? 'bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'bg-red-400'}`}></span>
                      <span>{team.status}</span>
                    </span>
                  </td>
                  <td className="p-4 md:p-6 font-mono text-white/80">Sector {team.chapter}</td>
                  <td className="p-4 md:p-6 font-mono font-bold text-green-400">{team.score.toLocaleString()}</td>
                  <td className="p-4 md:p-6 text-sm text-white/50">{team.lastActive}</td>
                  <td className="p-4 md:p-6 text-right">
                    <button className="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-white/30 hover:text-green-400 border border-transparent hover:border-green-500/30">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {MOCK_TEAMS.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
             <div className="p-12 text-center text-green-500/50 font-mono">
               NO ENTITIES FOUND MATCHING QUERY
             </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
