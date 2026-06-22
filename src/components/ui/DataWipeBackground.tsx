import React, { useEffect, useState, useRef } from 'react';

const DELETION_PATHS = [
  '/root/sys/core.dll',
  '/users/admin/documents/classified.txt',
  '/var/log/auth.log',
  '/etc/shadow',
  '/home/user/desktop/passwords.txt',
  '/mnt/data/archives_2025.zip',
  '/var/www/html/index.php',
  '/sys/firmware/efi/efivars',
  '/dev/sda1',
  '/boot/vmlinuz-linux',
  '/usr/lib/systemd/system',
];

const HEX_CHARS = '0123456789ABCDEF';

const generateHex = (len: number) => {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }
  return res;
};

interface LogLine {
  id: number;
  text: string;
  isRed: boolean;
}

export const DataWipeBackground = () => {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Add 1 to 3 new lines
      const numLines = Math.floor(Math.random() * 3) + 1;
      const newLines: LogLine[] = [];
      
      for (let i = 0; i < numLines; i++) {
        const path = DELETION_PATHS[Math.floor(Math.random() * DELETION_PATHS.length)];
        const hex = `0x${generateHex(8)}`;
        
        const isCritical = Math.random() > 0.7;
        const text = isCritical 
          ? `[!] ERROR: ACCESS DENIED AT ${hex} - FORCE OVERWRITE INITIATED ON ${path}`
          : `[sys] Wiping sector ${hex} ... ${path} - DELETED`;

        newLines.push({
          id: nextId.current++,
          text,
          isRed: isCritical
        });
      }

      setLogs(prev => {
        const next = [...prev, ...newLines];
        // Keep only last 50 lines to prevent memory issues
        if (next.length > 50) return next.slice(next.length - 50);
        return next;
      });
    }, 150); // Fast interval for rapid deletion effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/80 to-black z-10" />
      <div className="w-full h-full flex flex-col justify-end p-4 font-mono text-[10px] md:text-xs leading-none whitespace-nowrap">
        {logs.map(log => (
          <div 
            key={log.id} 
            className={`mb-1 ${log.isRed ? 'text-red-600 font-bold' : 'text-green-600/50'}`}
          >
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
};
