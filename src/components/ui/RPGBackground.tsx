import React, { useState, useEffect } from 'react';

const SKULL_TEMPLATE = `         0101010101
       10101010101010
      0101010101010101
     101010101010101010
     010101010101010101
     101010101010101010
     010101010101010101
     10101   01   10101
     0101          0101
     1010          1010
     01010        01010
      1010101010101010
       01010101010101
        101010101010
010      01  01  01      010
1010     1010101010     1010
 01010   01 01 01 01   01010
  101010              101010
    010101          010101
      101010101010101010
    010101          010101
  101010              101010
 01010                  01010
1010                      1010
010                        010`;

const BinarySkull = () => {
  const [skullText, setSkullText] = useState(SKULL_TEMPLATE);

  useEffect(() => {
    const interval = setInterval(() => {
      let newText = '';
      for (let i = 0; i < SKULL_TEMPLATE.length; i++) {
        if (SKULL_TEMPLATE[i] === '0' || SKULL_TEMPLATE[i] === '1') {
          // Constantly flip between 0 and 1
          newText += Math.random() > 0.5 ? '1' : '0';
        } else {
          newText += SKULL_TEMPLATE[i];
        }
      }
      setSkullText(newText);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none overflow-hidden mix-blend-screen scale-[1.5] md:scale-[2]">
      <pre className="font-mono text-[#00ff41] font-bold text-[1.2rem] md:text-[2rem] leading-[0.8] tracking-[0.2em] drop-shadow-[0_0_30px_rgba(0,255,65,1)]">
        {skullText}
      </pre>
    </div>
  );
};

export const RPGBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0f0518]">
      {/* Deep purple radial glow in center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,20,120,0.4)_0%,transparent_70%)]" />
      
      <BinarySkull />

      {/* Hexagon pattern overlay (very faint) */}
      <div className="absolute inset-0 opacity-10" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='%23a855f7' stroke-width='1'/%3E%3C/svg%3E")`,
             backgroundSize: '40px 60px'
           }} 
      />
      
      {/* Stars/Dust particles */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      
      {/* Glowing atmospheric clouds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[100px] rounded-full mix-blend-screen" />
    </div>
  );
};
