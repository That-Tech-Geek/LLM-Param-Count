import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles, Brain, Loader2, Database, ShieldCheck, Zap } from 'lucide-react';

interface CalculatingScreenProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  'Distilling synaptic weights...',
  'Applying temperature scaling...',
  'Cross-referencing with training data...',
  'Accounting for cognitive dissonance...',
  'Finalizing parameter count...',
];

export const CalculatingScreen: React.FC<CalculatingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= STATUS_MESSAGES.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  const icons = [
    <Brain className="w-8 h-8 text-cyan-400 animate-pulse" key="0" />,
    <Zap className="w-8 h-8 text-purple-400 animate-bounce" key="1" />,
    <Database className="w-8 h-8 text-indigo-400 animate-pulse" key="2" />,
    <Cpu className="w-8 h-8 text-amber-400 animate-spin" key="3" />,
    <ShieldCheck className="w-8 h-8 text-emerald-400 animate-pulse" key="4" />,
  ];

  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / STATUS_MESSAGES.length) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 text-white"
    >
      <div className="max-w-md w-full text-center space-y-8 bg-slate-900/90 p-8 sm:p-10 rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-purple-500/5 to-transparent pointer-events-none" />

        {/* Animated Icon Ring */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {/* Outer Rotating Glow Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 border-r-purple-500 animate-spin duration-1000" />
          <div className="absolute inset-2 rounded-full border border-purple-500/20 border-b-purple-400 animate-spin duration-1000 direction-reverse" />

          {/* Central Active Icon */}
          <div className="relative z-10 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {icons[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center space-x-2">
            <span>Synthesizing Architecture</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Neural Architecture Assessment (16P Engine)
          </p>
        </div>

        {/* Status Message Text */}
        <div className="h-14 flex items-center justify-center font-mono text-sm text-cyan-300 bg-slate-950/80 px-4 rounded-xl border border-slate-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
              <span>{STATUS_MESSAGES[currentIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 shadow-md shadow-cyan-400/50"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
            <span>SYNAPTIC_CALIBRATION_PHASE</span>
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
