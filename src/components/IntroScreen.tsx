import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Terminal, Gauge, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto py-8 px-4 text-center space-y-8"
    >
      {/* Hero Badge */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold shadow-lg shadow-cyan-500/10">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>16Personalities-Style Neural Evaluation Engine</span>
      </div>

      {/* Hero Title */}
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Neural Architecture <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Assessment
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          Discover your human brain's exact parameter count, architecture code, attention heads, and sampling temperature in 2 minutes.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left my-8">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-white font-semibold text-sm">1. Core Cognition</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            10 multiple-choice questions determining your base layers and attention heads.
          </p>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-purple-900/50 backdrop-blur-md space-y-2 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 mb-3">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-white font-semibold text-sm">2. Fine-Tuning Phase</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            2 text prompts analyzing linguistic entropy and sentence structure to fine-tune your parameters.
          </p>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3">
            <Gauge className="w-5 h-5" />
          </div>
          <h3 className="text-white font-semibold text-sm">3. Freakish Accuracy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generates your Architecture Code (e.g. <code>C-32k / H-96 / L-48</code>) and 16P Trait Sliders.
          </p>
        </div>
      </div>

      {/* Info Pills */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
        <span className="flex items-center space-x-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>12 Total Steps</span>
        </span>
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Data Retention</span>
        </span>
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>± 0.0001% Variance Engine</span>
        </span>
      </div>

      {/* CTA Button */}
      <div className="pt-4">
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-cyan-500/25 transition-all duration-200 transform hover:scale-105 flex items-center space-x-3 mx-auto cursor-pointer"
        >
          <span>Begin Neural Assessment</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
