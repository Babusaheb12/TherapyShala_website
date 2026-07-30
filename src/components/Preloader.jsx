import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TherapyshalaLogo from './TherapyshalaLogo';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        return prev + 4;
      });
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[9999] bg-[#1F1B18] flex flex-col items-center justify-center overflow-hidden selection:bg-[#E09F93]"
    >
      {/* Background Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#D88373]/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Center Content Container: ONLY LOGO */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Animated Pure Logo Emblem (No Name / Text) */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glowing Outer Radial Ring */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.75, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#D88373]/40 via-[#E09F93]/30 to-[#D4AF37]/40 blur-xl"
          />

          <TherapyshalaLogo
            className="w-24 h-24 sm:w-32 sm:h-32 relative z-10 drop-shadow-[0_12px_30px_rgba(216,131,115,0.45)]"
            showText={false}
          />
        </motion.div>

        {/* Minimal Thin Progress Accent Line Under Logo */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="h-[2px] bg-white/10 rounded-full overflow-hidden relative mt-10"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#D88373] via-[#E09F93] to-[#D4AF37]"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
