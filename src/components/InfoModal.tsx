import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Brain, MessageSquare, Compass } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl relative text-slate-800 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center space-x-3 text-teal-700">
            <Brain className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Assessment Methodology
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-semibold text-slate-900 flex items-center space-x-2 text-sm">
                <Brain className="w-4 h-4 text-teal-600" />
                <span>1. Core Cognitive Preferences (8 Questions)</span>
              </h3>
              <p className="text-slate-600 text-xs">
                Multiple-choice questions evaluate working memory capacity, focus channels, depth of analysis, and decision flexibility.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-semibold text-slate-900 flex items-center space-x-2 text-sm">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>2. Written Communication Sample (2 Prompts)</span>
              </h3>
              <p className="text-slate-600 text-xs">
                Written text prompts evaluate vocabulary density, sentence structure, and concise expression under length constraints.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <h3 className="font-semibold text-slate-900 flex items-center space-x-2 text-sm">
                <Compass className="w-4 h-4 text-purple-600" />
                <span>3. Archetype Synthesis & Benchmarks</span>
              </h3>
              <p className="text-slate-600 text-xs">
                Your responses map to a primary personality archetype code, 5 core specification metrics, and an equivalent parameter scale compared against industry AI systems.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
