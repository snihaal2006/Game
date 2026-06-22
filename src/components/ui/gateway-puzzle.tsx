import React, { useState } from 'react';
import { Lock, Unlock, AlertCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { chaptersData } from '../../data/chapters';

const GatewayPuzzleModal = () => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  
  const currentChapter = useGameStore((state) => state.currentChapter);
  const setPhase = useGameStore((state) => state.setPhase);
  
  const chapterData = chaptersData[currentChapter];
  if (!chapterData) return null;

  const puzzle = chapterData.gatewayPuzzle;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toUpperCase() === puzzle.answer.toUpperCase()) {
      setError(false);
      // Puzzle solved! Move to video phase.
      setPhase('VIDEO');
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-black/60 border border-purple-500/30 rounded-xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)] animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Lock className="text-purple-400" size={32} />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase tracking-widest">
            Security Gateway
          </h2>
        </div>

        {/* Puzzle Content */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8 text-center">
          <p className="text-white/60 uppercase tracking-widest text-xs mb-2">Incoming Transmission</p>
          <div className="text-3xl font-mono font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] mb-4">
            {puzzle.clue}
          </div>
          <p className="text-sm text-white/40 italic">Hint: {puzzle.hint}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="ENTER DECRYPTION KEY..."
              className={`w-full bg-black/40 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent font-mono text-center uppercase transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs text-center mt-2 flex items-center justify-center">
                <AlertCircle size={12} className="mr-1" /> INCORRECT KEY. TRY AGAIN.
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] flex items-center justify-center space-x-2"
          >
            <span>DECRYPT & ENTER</span>
            <Unlock size={18} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default GatewayPuzzleModal;
