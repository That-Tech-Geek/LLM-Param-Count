import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralResults, OpenRouterSynthesis } from '../types';
import { fetchOpenRouterDiagnosis, OpenRouterFetchResult } from '../utils/openrouter';
import { GlobalDistributionCharts } from './GlobalDistributionCharts';
import {
  Cpu,
  Share2,
  Check,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
  Info,
  Flame,
  Layers,
  Bot,
  Loader2,
  MessageSquare,
  Compass,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface ResultsDashboardProps {
  results: NeuralResults;
  onRetake: () => void;
}

const AVAILABLE_MODELS = [
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B Instruct' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 Reasoning' },
];

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  onRetake,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);

  // OpenRouter State
  const [selectedModel, setSelectedModel] = useState<string>('meta-llama/llama-3.1-8b-instruct:free');
  const [synthesisData, setSynthesisData] = useState<OpenRouterSynthesis | null>(null);
  const [modelUsedName, setModelUsedName] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const runSynthesisFetch = async (model: string) => {
    setIsAiLoading(true);
    const res: OpenRouterFetchResult = await fetchOpenRouterDiagnosis(results, model);
    setIsAiLoading(false);
    if (res.synthesis) {
      setSynthesisData(res.synthesis);
      setModelUsedName(res.model);
    }
  };

  useEffect(() => {
    runSynthesisFetch(selectedModel);
  }, [results]);

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    runSynthesisFetch(newModel);
  };

  const paramsInBillions = (results.finalParams / 1_000_000_000).toFixed(1);

  const shareText = `🧠 My human neural parameters: ${paramsInBillions}B!\nArchitecture Code: ${results.architectureCode}\nArchetype: ${synthesisData?.customTitle || results.archetypeTitle}\nTested on Neural Architecture Assessment.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto py-6 px-4 space-y-8 text-slate-100"
    >
      {/* 1. Primary Hero Result */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-8 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 text-xs font-mono px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Code: <strong className="text-cyan-300">{results.architectureCode}</strong></span>
          <span>•</span>
          <span>Archetype: <strong className="text-white">{synthesisData?.customTitle || results.archetypeTitle}</strong></span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
            Total Human Neural Parameters
          </span>
          <h1 className="text-4xl sm:text-6xl font-mono font-bold tracking-tight text-white">
            {results.formattedParams}
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-2">
            Calculated across 12 cognitive metrics & token bandwidth
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition flex items-center space-x-2 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied Result</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Architecture</span>
              </>
            )}
          </button>

          <button
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700/60 flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Test</span>
          </button>
        </div>
      </div>

      {/* 2. Key Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span>Context Window</span>
          </span>
          <span className="text-white font-bold text-base block">
            {results.contextWindowFormatted}
          </span>
          <span className="text-[10px] text-slate-500 block">RAM retention cache</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Attention Heads</span>
          </span>
          <span className="text-white font-bold text-base block">
            {results.attentionHeadsValue} Heads
          </span>
          <span className="text-[10px] text-slate-500 block">Parallel focus channels</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Layer Depth</span>
          </span>
          <span className="text-white font-bold text-base block">
            {results.layerDepthValue} Layers
          </span>
          <span className="text-[10px] text-slate-500 block">Abstract reasoning depth</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Temperature</span>
          </span>
          <span className="text-white font-bold text-base block">
            {results.temperatureValue}
          </span>
          <span className="text-[10px] text-slate-500 block">Entropy / Spontaneity</span>
        </div>
      </div>

      {/* 3. Neural Synthesis Report Panel */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">AI Neural Synthesis Report</h2>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={isAiLoading}
              className="bg-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {isAiLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Executive Overview</span>
          </span>
          <p className="text-slate-200 text-sm leading-relaxed">
            {synthesisData?.summaryOverview || results.archetypeDescription}
          </p>
        </div>

        {/* Linguistic Analysis */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>Token & Lexical Compression</span>
            </span>
            <span className="text-purple-300">
              Richness: {(results.linguisticMetrics.lexicalRichness * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            {synthesisData?.linguisticAnalysis ||
              `Vocabulary diversity of ${results.linguisticMetrics.lexicalRichness} indicates concise phrasing across ${results.linguisticMetrics.totalWords} typed tokens.`}
          </p>
        </div>

        {/* Behavioral Quirks & Advice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 font-mono text-[11px] uppercase flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Predicted Quirks</span>
            </span>
            <ul className="space-y-1.5 text-slate-300">
              {(synthesisData?.behavioralQuirks || [
                'Monitors group notifications promptly upon ping',
                'Optimizes routines prior to seeking new challenges',
                'Evaluates message tone before hitting send',
              ]).map((q, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-indigo-400 font-mono">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 font-mono text-[11px] uppercase flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
              <span>Optimization Advice</span>
            </span>
            <p className="text-slate-300 leading-relaxed">
              {synthesisData?.optimizationAdvice ||
                'Clear low-priority items from active working context before starting high-entropy creative sessions.'}
            </p>
          </div>
        </div>

        {/* Roast & Praise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-rose-400 font-mono text-[11px] uppercase flex items-center space-x-1 font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>Synaptic Roast</span>
            </span>
            <p className="text-slate-300 italic">
              "{synthesisData?.roast || results.roast}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-mono text-[11px] uppercase flex items-center space-x-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cognitive Strength</span>
            </span>
            <p className="text-slate-300 italic">
              "{synthesisData?.praise || results.praise}"
            </p>
          </div>
        </div>
      </div>

      {/* 4. Global Telemetry Distribution */}
      <GlobalDistributionCharts
        userParamsBillion={results.finalParams / 1e9}
        userArchetype={synthesisData?.customTitle || results.archetypeTitle}
      />

      {/* 5. Math & Parameter Calculations Accordion */}
      <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 overflow-hidden">
        <button
          onClick={() => setShowMathDetails(!showMathDetails)}
          className="w-full p-4 text-left flex items-center justify-between font-mono text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Mathematical Weights & Fine-Tuning Formula</span>
          </div>
          {showMathDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showMathDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 border-t border-slate-800/60 bg-slate-950 text-xs font-mono space-y-3 text-slate-300"
            >
              <p>
                <strong className="text-slate-200">Base Formula:</strong> <code className="text-cyan-300">Total Params = Base (70B) × Layer Multiplier × Context Factor</code>
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>• Baseline: 70,000,000,000</div>
                <div>• Overthinking Factor: {results.layerDepthValue} layers</div>
                <div>• Context Cache: {results.contextWindowFormatted}</div>
                <div>• Sampling Variance: {results.temperatureValue}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
