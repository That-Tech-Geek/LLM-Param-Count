import React from 'react';
import { motion } from 'motion/react';
import { PhaseType } from '../types';
import { Cpu, Terminal, Gauge } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentPhase: PhaseType;
  phaseName: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  currentPhase,
  phaseName,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));

  const getPhaseIcon = () => {
    switch (currentPhase) {
      case 'core':
        return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'typing':
        return <Terminal className="w-3.5 h-3.5 text-purple-400 animate-pulse" />;
      case 'calibration':
        return <Gauge className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getPhaseBadgeColor = () => {
    switch (currentPhase) {
      case 'core':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
      case 'typing':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-lg shadow-purple-900/30';
      case 'calibration':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/80 py-3 px-4 sm:px-6 shadow-sm">
      <div className="max-w-3xl mx-auto flex flex-col space-y-2">
        {/* Top Header info */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full border text-[11px] font-medium flex items-center space-x-1.5 transition-colors ${getPhaseBadgeColor()}`}
            >
              {getPhaseIcon()}
              <span>{phaseName}</span>
            </span>
          </div>

          <div className="text-slate-400 font-semibold flex items-center space-x-2">
            <span>Progress: {percentage}%</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">{currentStep} / {totalSteps}</span>
          </div>
        </div>

        {/* Outer bar */}
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-0.5 relative">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 shadow-md shadow-cyan-500/30"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};
