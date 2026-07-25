import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { QuestionTyping } from '../types';
import { Check, ArrowRight } from 'lucide-react';

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
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto py-2"
    >
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-2">
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-200">
            Written Prompt #{question.id}
          </span>
          <span className="text-slate-400 font-normal">• Expression Sample</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
          {question.prompt}
        </h2>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
          {question.subtitle}
        </p>

        {/* Textarea Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              autoFocus
              className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-4 rounded-xl border border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 focus:outline-none transition text-sm leading-relaxed"
            />

            {/* Word counter */}
            <div className="absolute bottom-3 right-3 text-xs font-mono">
              {question.exactWordCount ? (
                <span
                  className={`px-2 py-0.5 rounded border ${
                    wordCount === 5
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {wordCount} / 5 words
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  {wordCount} words
                </span>
              )}
            </div>
          </div>

          {/* Validation help */}
          <div className="flex items-center justify-between text-xs py-1">
            <div>
              {question.exactWordCount ? (
                isExact5 ? (
                  <span className="text-emerald-700 font-medium flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Exact 5-word count met</span>
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Requires exactly 5 words (currently {wordCount})
                  </span>
                )
              ) : isMinChars ? (
                <span className="text-emerald-700 font-medium flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Sufficient length</span>
                </span>
              ) : (
                <span className="text-slate-500">Please write a complete response.</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
              >
                Back
              </button>
            ) : <div />}

            <button
              type="submit"
              disabled={!isValid}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 flex items-center space-x-2 ${
                isValid
                  ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
