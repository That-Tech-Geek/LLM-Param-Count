import React from 'react';
import { motion } from 'motion/react';
import { Brain, MessageSquare, Compass, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto py-8 px-4 text-center space-y-8 text-slate-800"
    >
      {/* Category Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-medium text-xs">
        <Brain className="w-3.5 h-3.5 text-teal-600" />
        <span>Free Cognitive & Personality Profile</span>
      </div>

      {/* Hero Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Discover Your Neural Architecture
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed font-normal">
          A 2-minute evaluation to explore your cognitive style, attention mechanisms, decision-making depth, and model parameter equivalent.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left my-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 mb-2">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">1. Core Preferences</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Answer questions about your communication habits, planning style, and focus patterns.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-2">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">2. Expressive Style</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Provide short written responses to evaluate vocabulary structure and linguistic flow.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 mb-2">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">3. Detailed Profile</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Receive your primary archetype, trait breakdown, and model capacity analysis.
          </p>
        </div>
      </div>

      {/* Info Markers */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
        <span className="flex items-center space-x-1.5">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Takes under 2 minutes</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Anonymous & private</span>
        </span>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        <button
          onClick={onStart}
          className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-sm transition-all duration-200 flex items-center space-x-2 mx-auto cursor-pointer"
        >
          <span>Take the Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
