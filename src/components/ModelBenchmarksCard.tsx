import React, { useState } from 'react';
import { Cpu, Zap, Layers, Sparkles, Scale, Info } from 'lucide-react';

interface ModelBenchmarkProps {
  userParamsBillion: number;
}

interface ModelTier {
  category: string;
  rangeLabel: string;
  description: string;
  badgeColor: string;
  models: Array<{
    name: string;
    paramsLabel: string;
    paramsBillion: number;
    notes?: string;
  }>;
}

const MODEL_TIERS: ModelTier[] = [
  {
    category: 'Small Models',
    rangeLabel: '< 10B parameters',
    description: 'Optimized for low-latency, edge computing, or local device deployment.',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
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
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    models: [
      { name: 'Meta Llama 3.1 (70B)', paramsLabel: '70 Billion params', paramsBillion: 70 },
      { name: 'Meta Llama 3 (405B - Dense/Config)', paramsLabel: 'Scales up to 405 Billion params', paramsBillion: 405 },
    ],
  },
  {
    category: 'Large / Mixture-of-Experts (MoE) Models',
    rangeLabel: '> 150B+ parameters',
    description: 'High-capacity frontier systems utilizing sparse activation to optimize active parameters during inference.',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    models: [
      { name: 'Z AI GLM-5.2 (max)', paramsLabel: '753 Billion total params (40B active)', paramsBillion: 753, notes: '40B active at inference' },
      { name: 'DeepSeek V4 Pro', paramsLabel: '1.6 Trillion total params (49B active)', paramsBillion: 1600, notes: '49B active at inference' },
      { name: 'OpenAI GPT-4', paramsLabel: '~1.76 Trillion total params', paramsBillion: 1760, notes: 'Estimated MoE architecture' },
    ],
  },
];

export const ModelBenchmarksCard: React.FC<ModelBenchmarkProps> = ({ userParamsBillion }) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

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
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Major Open-Weights & Proprietary AI Models Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Benchmark your human neural parameter capacity against industry frontier architectures
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Closest Match: {closestModelName}</span>
        </div>
      </div>

      {/* Tiers List */}
      <div className="space-y-4">
        {MODEL_TIERS.map((tier, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-100">{tier.category}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                  {tier.rangeLabel}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {tier.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {tier.models.map((model, mIdx) => {
                const isClosest = model.name === closestModelName;
                return (
                  <div
                    key={mIdx}
                    className={`p-3 rounded-lg border text-xs font-mono transition space-y-1 ${
                      isClosest
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-100 ring-1 ring-cyan-500/50'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate">{model.name}</span>
                      {isClosest && (
                        <span className="text-[9px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-bold uppercase">
                          Your Tier
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px]">{model.paramsLabel}</div>
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
