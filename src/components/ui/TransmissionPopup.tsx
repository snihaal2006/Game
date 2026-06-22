import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const TransmissionPopup = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // 3 seconds delay before showing the blinking notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Minimize popup automatically after 10 seconds of being opened
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setIsMinimized(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleNotificationClick = () => {
    setShowNotification(false);
    setShowPopup(true);
  };

  return (
    <>
      {/* Blinking Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            onClick={handleNotificationClick}
            className="fixed bottom-8 right-8 z-50 flex items-center space-x-3 bg-red-900/20 border border-red-500/50 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-900/40 transition-colors"
          >
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-red-400 font-mono text-sm tracking-widest font-bold">
              [ TRANSMISSION MESSAGE ]
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Actual Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-80 bg-black/80 backdrop-blur-md border border-green-500/50 shadow-[0_0_30px_rgba(0,255,65,0.2)] rounded-lg overflow-hidden"
          >
            <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-2 flex justify-between items-center">
              <span className="text-green-500 font-mono text-xs font-bold tracking-widest">
                INCOMING MESSAGE
              </span>
              <button onClick={() => { setShowPopup(false); setIsMinimized(true); }} className="text-green-500/50 hover:text-green-500">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <span className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                  26 - 19 - 19 - 03 - 08
                </span>
              </div>
              <div className="flex items-center space-x-2 text-green-500/50 text-xs font-mono">
                <div className="w-2 h-2 bg-green-500/50 animate-pulse" />
                <span>Transmission Ending...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Icon */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-8 right-8 z-40 bg-black/40 border border-green-500/30 p-2 rounded-lg cursor-pointer hover:bg-black/60 transition-colors"
            onClick={() => { setIsMinimized(false); setShowPopup(true); }}
            title="View transmission"
          >
            <span className="text-green-500/50 font-mono text-xs">MSG</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
