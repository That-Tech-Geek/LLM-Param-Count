import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { QuestionMCQ, MCQOption } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface MCQStepProps {
  question: QuestionMCQ;
  selectedOptionId?: string;
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  currentStep: number;
  totalSteps: number;
}

export const MCQStep: React.FC<MCQStepProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  currentStep,
  totalSteps,
}) => {
  // Listen for keyboard hotkeys (1,2,3,4 or A,B,C,D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      if (['A', '1'].includes(key)) onSelectOption('A');
      if (['B', '2'].includes(key)) onSelectOption('B');
      if (['C', '3'].includes(key)) onSelectOption('C');
      if (['D', '4'].includes(key)) onSelectOption('D');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectOption]);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -25 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto py-2"
    >
      {/* Question Card Header */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-3">
          <span className="bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/50">
            Cognitive Prompt #{question.id}
          </span>
          {question.subtitle && (
            <span className="text-slate-400 truncate hidden sm:inline">• {question.subtitle}</span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-3">
          {question.question}
        </h2>

        {question.subtitle && (
          <p className="text-sm text-slate-400 sm:hidden mb-4">{question.subtitle}</p>
        )}

        <p className="text-xs text-slate-500 mb-6 font-mono">
          Select one of the 4 options below (or press key <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">1-4</kbd>):
        </p>

        {/* 4 Options Grid */}
        <div className="space-y-3">
          {question.options.map((option: MCQOption) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/90 to-indigo-950/90 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Badge key letter */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {option.id}
                  </div>

                  <span className="text-base font-medium tracking-wide">
                    {option.label}
                  </span>
                </div>

                {/* Right indicator */}
                <div>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
