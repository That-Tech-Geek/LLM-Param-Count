import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Loader2 } from 'lucide-react';

interface CalculatingScreenProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  'Evaluating response patterns...',
  'Determining cognitive style metrics...',
  'Comparing against model benchmarks...',
  'Synthesizing primary archetype...',
  'Finalizing evaluation report...',
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
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / STATUS_MESSAGES.length) * 100));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50/95 backdrop-blur-md flex items-center justify-center p-6 text-slate-800"
    >
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
        {/* Simple Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
          <Brain className="w-8 h-8 animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Synthesizing Evaluation
          </h2>
          <p className="text-xs text-slate-500">
            Neural Architecture Assessment
          </p>
        </div>

        {/* Status Message */}
        <div className="h-12 flex items-center justify-center text-xs font-medium text-slate-700 bg-slate-50 px-4 rounded-xl border border-slate-200">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600 shrink-0" />
            <span>{STATUS_MESSAGES[currentIndex]}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <motion.div
              className="h-full bg-teal-600"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
            <span>CALIBRATING</span>
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
