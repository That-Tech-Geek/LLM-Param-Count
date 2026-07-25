import React from 'react';
import { Scale, Check } from 'lucide-react';

interface ModelBenchmarkProps {
  userParamsBillion: number;
}

interface ModelTier {
  category: string;
  rangeLabel: string;
  description: string;
  models: Array<{
    name: string;
    paramsLabel: string;
    paramsBillion: number;
  }>;
}

const MODEL_TIERS: ModelTier[] = [
  {
    category: 'Small Models',
    rangeLabel: '< 10B parameters',
    description: 'Optimized for low-latency, edge computing, or local device deployment.',
    models: [
      { name: 'IBM Granite 3.0 (1B/3B)', paramsLabel: '1B - 3B params', paramsBillion: 3 },
      { name: 'Google Gemma (7B)', paramsLabel: '7 Billion params', paramsBillion: 7 },
      { name: 'Meta Llama 3 (8B)', paramsLabel: '8 Billion params', paramsBillion: 8 },
    ],
  },
  {
    category: 'Medium Models',
    rangeLabel: '10B – 150B parameters',
    description: 'Used for advanced enterprise workflows and multi-step reasoning.',
    models: [
      { name: 'Meta Llama 3.1 (70B)', paramsLabel: '70 Billion params', paramsBillion: 70 },
      { name: 'Meta Llama 3 (405B - Dense/Config)', paramsLabel: 'Scales up to 405 Billion params', paramsBillion: 405 },
    ],
  },
  {
    category: 'Large / Mixture-of-Experts (MoE) Models',
    rangeLabel: '> 150B+ parameters',
    description: 'High-capacity frontier systems utilizing sparse activation to optimize active parameters during inference.',
    models: [
      { name: 'Z AI GLM-5.2 (max)', paramsLabel: '753 Billion total params (40B active)', paramsBillion: 753 },
      { name: 'DeepSeek V4 Pro', paramsLabel: '1.6 Trillion total params (49B active)', paramsBillion: 1600 },
      { name: 'OpenAI GPT-4', paramsLabel: '~1.76 Trillion total params', paramsBillion: 1760 },
    ],
  },
];

export const ModelBenchmarksCard: React.FC<ModelBenchmarkProps> = ({ userParamsBillion }) => {
  // Find closest model to user score
  let closestModelName = 'Meta Llama 3.1 (70B)';
  let minDiff = Infinity;

  MODEL_TIERS.forEach((tier) => {
    tier.models.forEach((m) => {
      const diff = Math.abs(m.paramsBillion - userParamsBillion);
      if (diff < minDiff) {
        minDiff = diff;
        closestModelName = m.name;
      }
    });
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
            <Scale className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Major AI Model Benchmarks
            </h2>
            <p className="text-xs text-slate-500">
              Comparing your calculated parameter score against open-weights and proprietary AI models
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium flex items-center space-x-1.5">
          <Check className="w-3.5 h-3.5 text-teal-600" />
          <span>Closest Tier Match: <strong>{closestModelName}</strong></span>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-4">
        {MODEL_TIERS.map((tier, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900">{tier.category}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                  {tier.rangeLabel}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {tier.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {tier.models.map((model, mIdx) => {
                const isClosest = model.name === closestModelName;
                return (
                  <div
                    key={mIdx}
                    className={`p-3 rounded-lg border text-xs transition space-y-1 ${
                      isClosest
                        ? 'bg-teal-50 border-teal-500 text-teal-950 font-medium shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate">{model.name}</span>
                      {isClosest && (
                        <span className="text-[9px] bg-teal-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                          Match
                        </span>
                      )}
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono">{model.paramsLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
