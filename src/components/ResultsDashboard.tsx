import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralResults, OpenRouterSynthesis } from '../types';
import { fetchOpenRouterDiagnosis, OpenRouterFetchResult } from '../utils/openrouter';
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
  Key,
  MessageSquare,
  Compass,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface ResultsDashboardProps {
  results: NeuralResults;
  onRetake: () => void;
  onToggleSyntheticOverride?: () => void;
}

const AVAILABLE_MODELS = [
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B Instruct (Free)' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash Exp (Free)' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct (Free)' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 Reasoning (Free)' },
];

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  results,
  onRetake,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  // OpenRouter State
  const [selectedModel, setSelectedModel] = useState<string>('meta-llama/llama-3.1-8b-instruct:free');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [synthesisData, setSynthesisData] = useState<OpenRouterSynthesis | null>(null);
  const [modelUsedName, setModelUsedName] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const runSynthesisFetch = async (model: string, apiKey?: string) => {
    setIsAiLoading(true);
    setAiError(null);

    const res: OpenRouterFetchResult = await fetchOpenRouterDiagnosis(results, model, apiKey);

    setIsAiLoading(false);
    if (res.synthesis) {
      setSynthesisData(res.synthesis);
      setModelUsedName(res.model);
      setIsFallbackMode(!!res.isFallback);
      if (res.error) setAiError(res.error);
    }
  };

  useEffect(() => {
    runSynthesisFetch(selectedModel);
  }, [results]);

  const handleModelChange = (newModel: string) => {
    setSelectedModel(newModel);
    runSynthesisFetch(newModel, customApiKey);
  };

  const handleCustomKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSynthesisFetch(selectedModel, customApiKey);
  };

  // Billions conversion for share copy snippet
  const paramsInBillions = (results.finalParams / 1_000_000_000).toFixed(1);

  const shareText = `🧠 Just scored ${paramsInBillions}B parameters on the Neural Architecture Assessment!\nMy architecture code is ${results.architectureCode}.\nArchetype: ${synthesisData?.customTitle || results.archetypeTitle}\nBeat that, GPT-4! #NeuralArchitecture Assessment`;

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
      {/* 1. Top Hero Section: Total Parameters */}
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
            <strong className="text-white">
              {synthesisData?.customTitle || results.archetypeTitle}
            </strong>
          </div>
        </div>

        {/* Big Number Display */}
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

        {/* Synthetic Trap Warning if triggered */}
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

        {/* Action Bar */}
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

      {/* 2. Interactive OpenRouter Control Center */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-indigo-950/70 rounded-2xl border border-purple-500/40 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-800/40 pb-4">
          <div className="flex items-center space-x-2.5">
            <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-purple-200">
                OpenRouter AI Live Diagnostic Engine
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Select an LLM model or connect your OpenRouter API Key
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-[11px] font-mono px-3 py-1 rounded-full border ${
                isFallbackMode
                  ? 'bg-slate-950 border-amber-700/60 text-amber-300'
                  : 'bg-purple-950 border-purple-600 text-purple-300'
              }`}
            >
              {modelUsedName || 'OpenRouter API'}
            </span>

            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-700/50 text-xs font-mono flex items-center space-x-1"
              title="Configure API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Key</span>
            </button>
          </div>
        </div>

        {/* Model Selection & Trigger */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-mono text-purple-300 block mb-1">
              Select AI Model for Neural Synthesis:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-purple-700/60 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-purple-400"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => runSynthesisFetch(selectedModel, customApiKey)}
              disabled={isAiLoading}
              className="w-full mt-4 sm:mt-5 px-4 py-2.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 text-purple-100 font-mono text-xs font-semibold border border-purple-500/50 transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-purple-300" />
                  <span>Run AI Synthesis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Key Expandable Form */}
        <AnimatePresence>
          {showKeyInput && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCustomKeySubmit}
              className="p-3 bg-slate-950/80 rounded-xl border border-purple-800/50 space-y-2 text-xs font-mono"
            >
              <label className="text-purple-300 block">
                Enter Custom OpenRouter API Key (<code className="text-purple-400">sk-or-v1-...</code>):
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Paste sk-or-v1-..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-400 text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 text-white rounded-lg font-semibold"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Key is processed in-memory for this session only. You can also set{' '}
                <code className="text-purple-300">OPENROUTER_API</code> in environment variables or Vercel.
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {aiError && (
          <p className="text-xs font-mono text-amber-400 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/50">
            Notice: {aiError}
          </p>
        )}
      </div>

      {/* 3. Deep LLM Neural Diagnostics Report */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-white font-bold text-xl border-b border-slate-800 pb-3">
          <Brain className="w-6 h-6 text-cyan-400" />
          <h2>LLM-Powered Synaptic Diagnostic Report</h2>
        </div>

        {/* Executive Summary Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-6 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center space-x-2 text-cyan-300 font-semibold text-sm uppercase tracking-wider font-mono">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Synaptic Executive Overview</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed font-sans">
            {synthesisData?.summaryOverview || results.archetypeDescription}
          </p>
        </div>

        {/* Deep Linguistic Analysis Card */}
        <div className="bg-slate-900/90 rounded-2xl border border-purple-500/30 p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
            <div className="flex items-center space-x-2 text-purple-300 font-semibold text-sm uppercase tracking-wider font-mono">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Deep Linguistic & Token Fine-Tuning Analysis</span>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950 px-2.5 py-0.5 rounded border border-purple-800">
              Lexical Richness: {(results.linguisticMetrics.lexicalRichness * 100).toFixed(0)}%
            </span>
          </div>

          {/* User's Exact Typed Quotes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-purple-900/30 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">
                Typed 5-Word Mental State (Q7):
              </span>
              <p className="text-purple-200 font-sans italic font-medium">
                "{results.answersSummary?.typedMentalState || 'N/A'}"
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-purple-900/30 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase block">
                Apology to Future Self (Q8):
              </span>
              <p className="text-indigo-200 font-sans italic font-medium">
                "{results.answersSummary?.typedApology || 'N/A'}"
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed font-sans">
            {synthesisData?.linguisticAnalysis ||
              `Your vocabulary diversity score of ${results.linguisticMetrics.lexicalRichness} indicates high token compression across ${results.linguisticMetrics.totalWords} words typed.`}
          </p>
        </div>

        {/* 16P Trait Sliders & Custom Explanations */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                16P Parameter Trait Calibration
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              5 Core Cognitive Metrics
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Context Window */}
            <TraitBarItem
              label="Context Window"
              subtitle="Working memory token cache"
              valueText={results.contextWindowFormatted}
              percentage={Math.min(100, Math.max(15, (results.contextWindowValue / 128) * 100))}
              color="from-cyan-500 to-blue-600"
              icon={<Brain className="w-4 h-4 text-cyan-400" />}
              explanation={
                synthesisData?.contextWindowExplain ||
                `Your ${results.contextWindowFormatted} context window governs how many multi-turn social messages and working objectives you hold in active RAM simultaneously.`
              }
            />

            {/* 2. Attention Heads */}
            <TraitBarItem
              label="Attention Heads"
              subtitle="Parallel social signal routing"
              valueText={`${results.attentionHeadsValue} heads`}
              percentage={Math.min(100, Math.max(20, (results.attentionHeadsValue / 128) * 100))}
              color="from-indigo-500 to-purple-600"
              icon={<Cpu className="w-4 h-4 text-indigo-400" />}
              explanation={
                synthesisData?.attentionHeadsExplain ||
                `With ${results.attentionHeadsValue} multi-headed attention layers, you split focus between raw task logic, subtext, and emotional tone.`
              }
            />

            {/* 3. Layer Depth */}
            <TraitBarItem
              label="Layer Depth"
              subtitle="Recursive overthinking graph"
              valueText={`${results.layerDepthValue} layers`}
              percentage={Math.min(100, Math.max(20, (results.layerDepthValue / 96) * 100))}
              color="from-purple-500 to-pink-600"
              icon={<Layers className="w-4 h-4 text-purple-400" />}
              explanation={
                synthesisData?.layerDepthExplain ||
                `${results.layerDepthValue} transformer layers allow you to process deep abstract concepts and hidden meanings before reaching a final output.`
              }
            />

            {/* 4. Temperature */}
            <TraitBarItem
              label="Sampling Temperature"
              subtitle="Spontaneity vs logic variance"
              valueText={`${results.temperatureValue} (${
                results.temperatureValue > 0.65 ? 'High Variance' : 'Grounded'
              })`}
              percentage={Math.min(100, Math.max(15, results.temperatureValue * 100))}
              color="from-amber-500 to-rose-600"
              icon={<Flame className="w-4 h-4 text-amber-400" />}
              explanation={
                synthesisData?.temperatureExplain ||
                `Sampling temperature of ${results.temperatureValue} balances deterministic factual outputs with creative entropy.`
              }
            />

            {/* 5. Top-p */}
            <TraitBarItem
              label="Top-p (Nucleus Sampling)"
              subtitle="Decision probability cutoff"
              valueText={`${results.topPValue} (${
                results.topPValue > 0.8 ? 'Broad Nucleus' : 'Tight Cutoff'
              })`}
              percentage={Math.min(100, Math.max(20, results.topPValue * 100))}
              color="from-emerald-500 to-teal-600"
              icon={<Zap className="w-4 h-4 text-emerald-400" />}
              explanation={`Top-p of ${results.topPValue} controls the breadth of alternative choices considered before taking action.`}
            />
          </div>
        </div>

        {/* Behavioral Predictions & Optimization Advice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Behavioral Quirks */}
          <div className="bg-slate-900/90 rounded-2xl border border-indigo-900/40 p-6 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-sm uppercase tracking-wider font-mono">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Predicted Behavioral Quirks</span>
            </div>
            <ul className="space-y-2 text-slate-300 text-xs font-sans">
              {(synthesisData?.behavioralQuirks || [
                'Checks group chat notifications immediately upon receiving a ping',
                'Over-optimizes daily routines before abandoning them for new hobbies',
                'Re-reads sent messages to evaluate their emotional temperature',
              ]).map((quirk, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-indigo-400 font-mono font-bold">•</span>
                  <span>{quirk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Neural Optimization Protocol */}
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-900/40 p-6 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-sm uppercase tracking-wider font-mono">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>Neural Optimization Advice</span>
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              {synthesisData?.optimizationAdvice ||
                'Flush low-priority items from your active context buffer before attempting high-temperature creative sessions.'}
            </p>
          </div>
        </div>

        {/* Synaptic Roast & Cognitive Strength */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Roast Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-rose-900/40 p-6 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 font-semibold">
              <Flame className="w-5 h-5" />
              <h3 className="text-base font-bold">Synaptic Roast</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              "{synthesisData?.roast || results.roast}"
            </p>
          </div>

          {/* Praise Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-900/40 p-6 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold">Cognitive Strength</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-sans">
              "{synthesisData?.praise || results.praise}"
            </p>
          </div>
        </div>
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
  explanation?: string;
}

const TraitBarItem: React.FC<TraitBarItemProps> = ({
  label,
  subtitle,
  valueText,
  percentage,
  color,
  icon,
  explanation,
}) => {
  return (
    <div className="space-y-2">
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

      {explanation && (
        <p className="text-xs text-slate-400 font-sans leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
          {explanation}
        </p>
      )}
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
