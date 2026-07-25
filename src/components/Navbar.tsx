import React from 'react';
import { Cpu, Sparkles, RefreshCw, Info } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold tracking-tight text-white text-base">
                Neural Architecture
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                16P Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Human Synaptic Parameter Assessment
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {!isCompleted && currentStep > 0 && (
            <div className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>
                Step <strong className="text-white">{currentStep}</strong> of {totalSteps}
              </span>
            </div>
          )}

          {onShowInfo && (
            <button
              onClick={onShowInfo}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition border border-slate-700/50 text-xs flex items-center space-x-1"
              title="Methodology & Architecture Info"
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">Methodology</span>
            </button>
          )}

          {currentStep > 0 && onReset && (
            <button
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition border border-slate-700/50 text-xs flex items-center space-x-1"
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
