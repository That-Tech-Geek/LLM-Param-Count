import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { QuestionMCQ, MCQOption } from '../types';
import { Check } from 'lucide-react';

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
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto py-2"
    >
      {/* Question Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-2">
          <span className="bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-slate-700">
            Question #{question.id}
          </span>
          {question.subtitle && (
            <span className="text-slate-400 font-normal truncate hidden sm:inline">• {question.subtitle}</span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
          {question.question}
        </h2>

        {question.subtitle && (
          <p className="text-xs text-slate-500 sm:hidden mb-4">{question.subtitle}</p>
        )}

        <p className="text-xs text-slate-400 mb-6">
          Choose the statement that best describes you (or press <kbd className="px-1 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px]">1–4</kbd>):
        </p>

        {/* 4 Options */}
        <div className="space-y-3">
          {question.options.map((option: MCQOption) => {
            const isSelected = selectedOptionId === option.id;

            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.995 }}
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-xl border transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/90 border-teal-600 text-teal-950 font-medium shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  {/* Badge key letter */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-xs transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300 group-hover:text-slate-900'
                    }`}
                  >
                    {option.id}
                  </div>

                  <span className="text-sm sm:text-base leading-snug">
                    {option.label}
                  </span>
                </div>

                {/* Selected Indicator */}
                <div className="shrink-0 ml-2">
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
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
