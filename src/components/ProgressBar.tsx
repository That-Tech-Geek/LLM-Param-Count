import React from 'react';
import { motion } from 'motion/react';
import { PhaseType } from '../types';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  currentPhase: PhaseType;
  phaseName: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  phaseName,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));

  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-3 px-4 sm:px-6 shadow-2xs">
      <div className="max-w-3xl mx-auto flex flex-col space-y-2">
        {/* Top Header info */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
              {phaseName}
            </span>
          </div>

          <div className="text-slate-500 font-semibold flex items-center space-x-2">
            <span>{percentage}% completed</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-900">{currentStep} of {totalSteps}</span>
          </div>
        </div>

        {/* Outer bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <motion.div
            className="h-full rounded-full bg-teal-600"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
};
