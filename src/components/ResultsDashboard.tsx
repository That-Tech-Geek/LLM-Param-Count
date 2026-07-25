import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralResults } from '../types';
import { fetchOpenRouterDiagnosis, OpenRouterResponse } from '../utils/openrouter';
import {
  Cpu,
  Share2,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Info,
  Flame,
  Award,
  Layers,
  HelpCircle,
  Bot,
  Loader2,
} from 'lucide-react';

interface ResultsDashboardProps {
  results: NeuralResults;
  onRetake: () => void;
  onToggleSyntheticOverride?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  onRetake,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // OpenRouter State
  const [openRouterData, setOpenRouterData] = useState<OpenRouterResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Auto-fetch OpenRouter AI diagnosis if configured
  useEffect(() => {
    let isMounted = true;

    async function checkAndFetchOpenRouter() {
      setIsAiLoading(true);
      setAiError(null);
      const res = await fetchOpenRouterDiagnosis(
        results.archetypeTitle,
        results.architectureCode,
        results.formattedParams,
        results.roast,
        results.praise
      );

      if (isMounted) {
        setIsAiLoading(false);
        if (res && res.result) {
          setOpenRouterData(res);
        } else if (res && res.error) {
          setAiError(res.error);
        }
      }
    }

    checkAndFetchOpenRouter();

    return () => {
      isMounted = false;
    };
  }, [results]);

  const handleManualOpenRouterTrigger = async () => {
    setIsAiLoading(true);
    setAiError(null);
    const res = await fetchOpenRouterDiagnosis(
      results.archetypeTitle,
      results.architectureCode,
      results.formattedParams,
      results.roast,
      results.praise
    );
    setIsAiLoading(false);
    if (res && res.result) {
      setOpenRouterData(res);
    } else {
      setAiError('OpenRouter API requires OPENROUTER_API key in environment variables or Vercel config.');
    }
  };

  // Billions conversion for share copy snippet
  const paramsInBillions = (results.finalParams / 1_000_000_000).toFixed(1);

  const shareText = `🧠 Just scored ${paramsInBillions}B parameters on the Neural Architecture Assessment!\nMy architecture code is ${results.architectureCode}.\nArchetype: ${results.archetypeTitle}\nBeat that, GPT-4! #NeuralArchitecture Assessment`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto py-4 px-2 sm:px-4 space-y-8"
    >
      {/* 1. Top Section Header & Big Number Hero */}
      <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/30 p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="px-3.5 py-1.5 rounded-full bg-slate-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs sm:text-sm font-semibold shadow-md flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Architecture Code:</span>
            <span className="text-white bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {results.architectureCode}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-slate-950 border border-purple-500/40 text-purple-300 font-mono text-xs sm:text-sm font-medium flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>Archetype:</span>
            <strong className="text-white">{results.archetypeTitle}</strong>
          </div>
        </div>

        {/* The Big Number Hero */}
        <div className="my-6 space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
            TOTAL HUMAN NEURAL PARAMETERS
          </p>

          <div className="relative inline-block my-2">
            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-mono font-extrabold tracking-tight text-white px-4 py-2"
              style={{
                color: '#00ffcc',
                textShadow: '0 0 25px rgba(0, 255, 204, 0.4), 0 0 50px rgba(0, 255, 204, 0.2)',
              }}
            >
              {results.formattedParams}
            </h1>
            <span className="text-sm sm:text-lg font-mono text-cyan-300 font-medium block sm:inline mt-1 sm:mt-0 sm:ml-2">
              Parameters
            </span>
          </div>

          <div className="flex justify-center items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Freakishly accurate ± 0.0001%</span>
            </span>
          </div>
        </div>

        {/* Synthetic LLM Trap Warning Box if triggered */}
        {results.isSyntheticOverride && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-left text-amber-200 text-xs font-mono flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-300 block font-semibold text-sm">
                🛑 High-Probability Synthetic Input Triggered
              </strong>
              <p className="text-slate-300">
                {results.linguisticMetrics.llmReason ||
                  'Your responses matched canned LLM outputs or repetitive token loops. A synthetic correction cap was applied.'}
              </p>
            </div>
          </div>
        )}

        {/* Action Bar (Share & Retake) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopy}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Results</span>
              </>
            )}
          </button>

          <button
            onClick={onRetake}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-sm transition border border-slate-700/60 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* 2. Middle Section: The 16P Trait Sliders (5 Dimensions) */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Neural Trait Calibration (16P Scale)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            5 Core Cognitive Metrics
          </span>
        </div>

        <div className="space-y-5">
          {/* 1. Context Window */}
          <TraitBarItem
            label="Context Window"
            subtitle="Short-term token retention memory cache"
            valueText={results.contextWindowFormatted}
            percentage={Math.min(100, Math.max(15, (results.contextWindowValue / 128) * 100))}
            color="from-cyan-500 to-blue-600"
            icon={<Brain className="w-4 h-4 text-cyan-400" />}
          />

          {/* 2. Attention Heads */}
          <TraitBarItem
            label="Attention Heads"
            subtitle="Parallel task & social signal routing capability"
            valueText={`${results.attentionHeadsValue} heads`}
            percentage={Math.min(100, Math.max(20, (results.attentionHeadsValue / 128) * 100))}
            color="from-indigo-500 to-purple-600"
            icon={<Cpu className="w-4 h-4 text-indigo-400" />}
          />

          {/* 3. Layer Depth */}
          <TraitBarItem
            label="Layer Depth"
            subtitle="Recursive abstract reasoning graph layers"
            valueText={`${results.layerDepthValue} layers`}
            percentage={Math.min(100, Math.max(20, (results.layerDepthValue / 96) * 100))}
            color="from-purple-500 to-pink-600"
            icon={<Layers className="w-4 h-4 text-purple-400" />}
          />

          {/* 4. Temperature */}
          <TraitBarItem
            label="Sampling Temperature"
            subtitle="Stochastic randomness vs logic variance"
            valueText={`${results.temperatureValue} (${results.temperatureValue > 0.65 ? 'High Variance' : 'Grounded'})`}
            percentage={Math.min(100, Math.max(15, results.temperatureValue * 100))}
            color="from-amber-500 to-rose-600"
            icon={<Flame className="w-4 h-4 text-amber-400" />}
          />

          {/* 5. Top-p Sampling */}
          <TraitBarItem
            label="Top-p (Nucleus Sampling)"
            subtitle="Probability mass cutoff threshold"
            valueText={`${results.topPValue} (${results.topPValue > 0.8 ? 'Broad Nucleus' : 'Tight Cutoff'})`}
            percentage={Math.min(100, Math.max(20, results.topPValue * 100))}
            color="from-emerald-500 to-teal-600"
            icon={<Zap className="w-4 h-4 text-emerald-400" />}
          />
        </div>
      </div>

      {/* 3. Bottom Section: The Diagnosis (Roast & Praise) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roast Card */}
        <div className="bg-slate-900/80 rounded-2xl border border-rose-900/40 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold mb-3">
            <Flame className="w-5 h-5" />
            <h3 className="text-lg">Synaptic Roast</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            "{results.roast}"
          </p>
        </div>

        {/* Praise Card */}
        <div className="bg-slate-900/80 rounded-2xl border border-emerald-900/40 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-3">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-lg">Cognitive Strength</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            "{results.praise}"
          </p>
        </div>
      </div>

      {/* OpenRouter AI Live Fine-Tuned Analysis Card */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-indigo-950/60 rounded-2xl border border-purple-500/30 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-800/40 pb-3">
          <div className="flex items-center space-x-2 text-purple-300 font-semibold">
            <Bot className="w-5 h-5 text-purple-400 animate-pulse" />
            <h3 className="text-base font-sans">OpenRouter Live AI Fine-Tuning Synthesis</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-700/60 text-purple-300">
              {openRouterData?.model || 'OpenRouter API'}
            </span>
          </div>
        </div>

        {isAiLoading ? (
          <div className="py-6 flex items-center justify-center space-x-2 text-purple-300 font-mono text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <span>Querying OpenRouter neural model...</span>
          </div>
        ) : openRouterData?.result ? (
          <div className="space-y-2 text-slate-200 text-sm leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-purple-900/40">
            <div className="text-xs font-mono text-purple-400 font-semibold mb-1 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep Neural Fine-Tuning Analysis:</span>
            </div>
            <p className="text-slate-200">{openRouterData.result}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-mono text-slate-400">
              Connect <code className="text-purple-300">OPENROUTER_API</code> in Vercel Environment Variables to generate real-time AI roasts and fine-tuning models.
            </p>
            {aiError && (
              <p className="text-xs font-mono text-amber-400 bg-amber-950/30 p-2 rounded border border-amber-800/50">
                {aiError}
              </p>
            )}
            <button
              onClick={handleManualOpenRouterTrigger}
              className="px-4 py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-mono text-xs border border-purple-700/60 transition flex items-center space-x-2"
            >
              <Bot className="w-4 h-4" />
              <span>Retry OpenRouter AI Generation</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Accordion Section 1: Detailed Fine-Tuning & Math Breakdown */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <button
          onClick={() => setShowMathDetails(!showMathDetails)}
          className="w-full p-5 text-left flex items-center justify-between font-mono text-sm text-slate-300 hover:text-white transition bg-slate-950/40 hover:bg-slate-800/40"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">View Mathematical & Linguistic Fine-Tuning Formula</span>
          </div>
          {showMathDetails ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {showMathDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-6 border-t border-slate-800 space-y-4 text-xs font-mono text-slate-300 bg-slate-950/60"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500">Base MCQ Parameters:</span>
                  <p className="text-cyan-300 font-bold text-sm">
                    {results.baseParams.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Derived from 10 Core & Calibration MCQs
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500">Linguistic Fine-Tune Multiplier:</span>
                  <p className="text-purple-300 font-bold text-sm">
                    {results.textMultiplier}x
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Lexical Richness ({results.linguisticMetrics.lexicalRichness}) + Punctuation Density ({results.linguisticMetrics.punctuationCount})
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500">Heisenberg Quantum Seed:</span>
                  <p className="text-emerald-300 font-bold text-sm">
                    {results.chaosBonus}x (+{(results.chaosValue * 0.05).toFixed(4)}%)
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Submission microsecond jitter timestamp
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-500">Total Words Analyzed:</span>
                  <p className="text-amber-300 font-bold text-sm">
                    {results.linguisticMetrics.totalWords} words ({results.linguisticMetrics.uniqueWords} unique)
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    Avg word length: {results.linguisticMetrics.avgWordLength} chars
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Formula:</strong>{' '}
                <code>Final = Base_Params × Linguistic_Multiplier × Chaos_Seed</code>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Accordion Section 2: Model Comparison Chart */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="w-full p-5 text-left flex items-center justify-between font-mono text-sm text-slate-300 hover:text-white transition bg-slate-950/40 hover:bg-slate-800/40"
        >
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold">Compare with Industry AI Models</span>
          </div>
          {showComparison ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-6 border-t border-slate-800 space-y-4 bg-slate-950/60"
            >
              <div className="space-y-3 font-mono text-xs">
                <ModelCompareBar
                  name="GPT-4 (Estimated)"
                  params="~1,800.0B"
                  percentage={100}
                  color="bg-slate-700"
                />
                <ModelCompareBar
                  name="Claude 3.5 Sonnet (Est.)"
                  params="~200.0B"
                  percentage={45}
                  color="bg-indigo-600"
                />
                <ModelCompareBar
                  name="YOUR HUMAN BRAIN"
                  params={`${paramsInBillions}B`}
                  percentage={Math.min(95, Math.max(15, (results.finalParams / 300_000_000_000) * 100))}
                  color="bg-emerald-400"
                  isYou
                />
                <ModelCompareBar
                  name="Llama 3 70B"
                  params="70.0B"
                  percentage={28}
                  color="bg-purple-600"
                />
                <ModelCompareBar
                  name="Gemini 1.5 Flash (Est.)"
                  params="30.0B"
                  percentage={18}
                  color="bg-cyan-600"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface TraitBarItemProps {
  label: string;
  subtitle: string;
  valueText: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

const TraitBarItem: React.FC<TraitBarItemProps> = ({
  label,
  subtitle,
  valueText,
  percentage,
  color,
  icon,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-semibold text-white text-sm font-sans">{label}</span>
          <span className="text-slate-500 hidden sm:inline">• {subtitle}</span>
        </div>
        <span className="text-cyan-300 font-bold">{valueText}</span>
      </div>

      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

interface ModelCompareBarProps {
  name: string;
  params: string;
  percentage: number;
  color: string;
  isYou?: boolean;
}

const ModelCompareBar: React.FC<ModelCompareBarProps> = ({
  name,
  params,
  percentage,
  color,
  isYou,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className={isYou ? 'text-emerald-400 font-bold flex items-center space-x-1' : 'text-slate-300'}>
          {isYou && <Sparkles className="w-3.5 h-3.5" />}
          <span>{name}</span>
        </span>
        <span className={isYou ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{params}</span>
      </div>
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
