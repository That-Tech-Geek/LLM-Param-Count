import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QuestionTyping } from '../types';
import { Terminal, Check, AlertCircle, ArrowRight, Sparkles, Sliders } from 'lucide-react';

interface TypingStepProps {
  question: QuestionTyping;
  currentValue: string;
  onSubmitText: (text: string) => void;
  onBack?: () => void;
}

export const TypingStep: React.FC<TypingStepProps> = ({
  question,
  currentValue,
  onSubmitText,
  onBack,
}) => {
  const [text, setText] = useState(currentValue || '');

  useEffect(() => {
    setText(currentValue || '');
  }, [currentValue, question.id]);

  // Analyze current text stats
  const wordsArray = text.trim().length > 0 ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = wordsArray.length;
  const charCount = text.length;

  const isExact5 = question.exactWordCount ? wordCount === question.exactWordCount : true;
  const isMinChars = question.minChars ? charCount >= question.minChars : true;

  const isValid = isExact5 && isMinChars && wordCount > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmitText(text);
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 25 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -25 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto py-2"
    >
      <div className="bg-slate-900/90 rounded-2xl border border-purple-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Ambient subtle purple glow in corner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 mb-3">
          <span className="bg-purple-950/90 px-3 py-1 rounded-md border border-purple-800/80 flex items-center space-x-1.5 shadow-md shadow-purple-950/50">
            <Terminal className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Fine-Tuning Phase #{question.id}</span>
          </span>
          <span className="text-slate-400 font-sans">• Linguistic Sample Analysis</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-3">
          {question.prompt}
        </h2>

        <p className="text-sm text-purple-200/80 mb-6 font-mono leading-relaxed bg-purple-950/40 p-3 rounded-lg border border-purple-900/40 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
          <span>{question.subtitle}</span>
        </p>

        {/* Textarea Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              autoFocus
              className="w-full bg-slate-950/80 text-white font-mono placeholder:text-slate-600 p-4 rounded-xl border border-purple-800/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition shadow-inner text-base leading-relaxed"
            />

            {/* Live metrics indicator badge in corner of textarea */}
            <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-xs font-mono">
              {question.exactWordCount && (
                <span
                  className={`px-2.5 py-1 rounded-md border transition-all ${
                    wordCount === 5
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80'
                      : 'bg-slate-900 text-amber-400 border-amber-800/60'
                  }`}
                >
                  {wordCount} / 5 words
                </span>
              )}

              {!question.exactWordCount && (
                <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                  {wordCount} words ({charCount} chars)
                </span>
              )}
            </div>
          </div>

          {/* Validation Help Banner */}
          <div className="flex items-center justify-between text-xs font-mono py-1">
            <div className="flex items-center space-x-2">
              {question.exactWordCount ? (
                isExact5 ? (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Exact 5-word count verified!</span>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Requires exactly 5 words (currently {wordCount})</span>
                  </span>
                )
              ) : isMinChars ? (
                <span className="text-emerald-400 flex items-center space-x-1">
                  <Check className="w-4 h-4" />
                  <span>Sufficient linguistic density</span>
                </span>
              ) : (
                <span className="text-slate-400">Please write at least a full sentence.</span>
              )}
            </div>

            <div className="hidden sm:flex items-center space-x-1 text-purple-400 text-[11px]">
              <Sliders className="w-3.5 h-3.5" />
              <span>Analyzing Lexical Entropy</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition"
              >
                Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={!isValid}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg ${
                isValid
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-purple-600/30 cursor-pointer hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <span>Submit Fine-Tuning Sample</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
