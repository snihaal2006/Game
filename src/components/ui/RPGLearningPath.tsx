import React from 'react';
import { Check, Lock, Home } from 'lucide-react';

interface PathNode {
  id: string;
  label: string;
  status: 'cleared' | 'current' | 'locked';
}

interface RPGLearningPathProps {
  nodes: PathNode[];
}

export const RPGLearningPath: React.FC<RPGLearningPathProps> = ({ nodes }) => {
  return (
    <div className="w-full flex items-center justify-between relative py-6">
      {/* Background connecting line */}
      <div className="absolute top-1/2 left-8 right-8 h-[2px] -translate-y-1/2 bg-purple-900/50"></div>
      
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;
        
        return (
          <div key={node.id} className="relative flex flex-col items-center flex-1">
            {/* Connecting line to next node */}
            {!isLast && (
              <div 
                className={`absolute top-6 left-1/2 w-full h-[2px] -translate-y-1/2 ${
                  node.status === 'cleared' 
                    ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]' 
                    : 'bg-purple-900/50 dashed'
                }`}
                style={node.status !== 'cleared' ? { backgroundImage: 'linear-gradient(to right, #4c1d95 50%, transparent 50%)', backgroundSize: '10px 2px' } : {}}
              ></div>
            )}
            
            {/* Node Circle */}
            <div 
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                node.status === 'cleared' 
                  ? 'bg-purple-900 border-purple-300 shadow-[0_0_15px_rgba(216,180,254,0.6)]' 
                  : node.status === 'current'
                    ? 'bg-purple-800 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse'
                    : 'bg-black border-purple-900/80 text-purple-800'
              }`}
            >
              {/* Inner accent ring */}
              <div className="absolute inset-1 rounded-full border border-purple-400/30"></div>
              
              {node.status === 'cleared' && <Check className="text-purple-200" size={20} />}
              {node.status === 'current' && <div className="w-3 h-3 bg-purple-300 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>}
              {node.status === 'locked' && <Lock className="text-purple-900" size={16} />}
            </div>
            
            {/* Label */}
            <div className={`mt-3 text-center text-xs w-24 leading-tight ${
              node.status === 'locked' ? 'text-purple-700' : 'text-purple-200 font-medium'
            }`}>
              {node.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
