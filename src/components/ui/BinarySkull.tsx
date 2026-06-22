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

export const BinarySkull = () => {
  const [skullText, setSkullText] = useState(SKULL_TEMPLATE);

  useEffect(() => {
    const interval = setInterval(() => {
      let newText = '';
      for (let i = 0; i < SKULL_TEMPLATE.length; i++) {
        if (SKULL_TEMPLATE[i] === '0' || SKULL_TEMPLATE[i] === '1') {
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
    <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none overflow-hidden mix-blend-screen scale-[1.5] md:scale-[2] z-0">
      <pre className="font-mono text-[#00ff41] font-bold text-[1.2rem] md:text-[2rem] leading-[0.8] tracking-[0.2em] drop-shadow-[0_0_30px_rgba(0,255,65,1)]">
        {skullText}
      </pre>
    </div>
  );
};
