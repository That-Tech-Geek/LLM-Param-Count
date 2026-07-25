import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Terminal, Sparkles, BookOpen } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 text-cyan-400">
            <BookOpen className="w-6 h-6" />
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Assessment Methodology
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="font-semibold text-white flex items-center space-x-2 text-sm">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Phase 1 & 3: Core Cognition & Calibration (10 MCQs)</span>
              </h3>
              <p className="text-slate-400 text-xs">
                Each choice maps to 5 hidden neural parameters: Context Window, Attention Heads, Transformer Layers, Temperature, and Top-p sampling.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-purple-900/50 space-y-2">
              <h3 className="font-semibold text-white flex items-center space-x-2 text-sm">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Phase 2: Fine-Tuning Typing Analysis (2 Prompts)</span>
              </h3>
              <p className="text-slate-400 text-xs">
                Analyzing word count, unique lexical richness, punctuation density, and syntactic structure calculates a 0.70x–1.45x fine-tuning multiplier.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-900/50 space-y-2">
              <h3 className="font-semibold text-white flex items-center space-x-2 text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Heisenberg Quantum Seed & Architecture Code</span>
              </h3>
              <p className="text-slate-400 text-xs">
                Uses millisecond submission jitter to inject realistic quantum variance (± 0.0001%), formatting your final score into a 16P-style architecture code like <code>C-32k / H-96 / L-48</code>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition"
          >
            Got it, close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
