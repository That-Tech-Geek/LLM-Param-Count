import React from 'react';
import { Brain, RefreshCw, Info } from 'lucide-react';

interface NavbarProps {
  currentStep: number;
  totalSteps: number;
  onReset?: () => void;
  onShowInfo?: () => void;
  isCompleted: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  totalSteps,
  onReset,
  onShowInfo,
  isCompleted,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-800 transition-all no-print">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-slate-900 text-base">
                Neural Architecture
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                Cognitive Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Human Cognitive & Personality Assessment
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!isCompleted && currentStep > 0 && (
            <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center space-x-1">
              <span>
                Question <strong className="text-slate-900">{currentStep}</strong> of {totalSteps}
              </span>
            </div>
          )}

          {onShowInfo && (
            <button
              onClick={onShowInfo}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition border border-slate-200 text-xs flex items-center space-x-1 font-medium"
              title="Assessment Methodology"
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">Methodology</span>
            </button>
          )}

          {currentStep > 0 && onReset && (
            <button
              onClick={onReset}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-lg transition border border-slate-200 text-xs flex items-center space-x-1 font-medium"
              title="Restart Quiz"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Restart</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
