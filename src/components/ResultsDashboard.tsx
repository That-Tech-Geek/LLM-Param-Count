import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NeuralResults, OpenRouterSynthesis } from '../types';
import { fetchOpenRouterDiagnosis, OpenRouterFetchResult } from '../utils/openrouter';
import { GlobalDistributionCharts } from './GlobalDistributionCharts';
import { ModelBenchmarksCard } from './ModelBenchmarksCard';
import {
  Share2,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Brain,
  Layers,
  Bot,
  Loader2,
  MessageSquare,
  Compass,
  FileText,
  Lightbulb,
  Info,
  Award,
  Sparkles,
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
  const [isAiLoading, setIsAiLoading] = useState(false);

  const runSynthesisFetch = async (model: string) => {
    setIsAiLoading(true);
    const res: OpenRouterFetchResult = await fetchOpenRouterDiagnosis(results, model);
    setIsAiLoading(false);
    if (res.synthesis) {
      setSynthesisData(res.synthesis);
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

  const shareText = `🧠 My Cognitive Architecture Score: ${paramsInBillions}B parameters!\nProfile Code: ${results.architectureCode}\nArchetype: ${synthesisData?.customTitle || results.archetypeTitle}\nTested on Neural Architecture Assessment.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto py-6 px-4 space-y-8 text-slate-800"
    >
      {/* 1. Primary Hero Result */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-xs">
        <div className="inline-flex items-center space-x-2 text-xs font-medium px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
          <Brain className="w-3.5 h-3.5 text-teal-600" />
          <span>Profile Code: <strong className="text-teal-900 font-mono">{results.architectureCode}</strong></span>
          <span className="text-teal-300">•</span>
          <span>Archetype: <strong>{synthesisData?.customTitle || results.archetypeTitle}</strong></span>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Calculated Parameter Equivalent
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            {results.formattedParams}
          </h1>
          <p className="text-xs text-slate-500 pt-1">
            Based on core preferences, reasoning style, and written communication
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied Profile</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Profile</span>
              </>
            )}
          </button>

          <button
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition border border-slate-200 flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* 2. Key Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase flex items-center space-x-1">
            <Brain className="w-3.5 h-3.5 text-teal-600" />
            <span>Context Length</span>
          </span>
          <span className="text-slate-900 font-bold text-base block font-mono">
            {results.contextWindowFormatted}
          </span>
          <span className="text-[10px] text-slate-500 block">Active memory retention</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Focus Channels</span>
          </span>
          <span className="text-slate-900 font-bold text-base block font-mono">
            {results.attentionHeadsValue} Channels
          </span>
          <span className="text-[10px] text-slate-500 block">Parallel task attention</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Cognitive Depth</span>
          </span>
          <span className="text-slate-900 font-bold text-base block font-mono">
            {results.layerDepthValue} Layers
          </span>
          <span className="text-[10px] text-slate-500 block">Analytical structure</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Flexibility</span>
          </span>
          <span className="text-slate-900 font-bold text-base block font-mono">
            {results.temperatureValue} / 1.0
          </span>
          <span className="text-[10px] text-slate-500 block">Creative spontaneity</span>
        </div>
      </div>

      {/* 3. Synthesis Report Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900">Cognitive Profile Evaluation</h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Engine:</span>
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              disabled={isAiLoading}
              className="bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-teal-600"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {isAiLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />}
          </div>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider block flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Executive Overview</span>
          </span>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {synthesisData?.summaryOverview || results.archetypeDescription}
          </p>
        </div>

        {/* Linguistic Analysis */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Expression & Vocabulary Density</span>
            </span>
            <span className="text-indigo-700 font-mono">
              Richness: {(results.linguisticMetrics.lexicalRichness * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            {synthesisData?.linguisticAnalysis ||
              `Vocabulary diversity of ${(results.linguisticMetrics.lexicalRichness * 100).toFixed(0)}% indicates structured phrasing across ${results.linguisticMetrics.totalWords} written words.`}
          </p>
        </div>

        {/* Behavioral Quirks & Advice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-700 font-semibold text-[11px] uppercase flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Observed Tendencies</span>
            </span>
            <ul className="space-y-1.5 text-slate-600">
              {(synthesisData?.behavioralQuirks || [
                'Monitors group notifications promptly upon receiving pings',
                'Optimizes routines prior to seeking new challenges',
                'Evaluates message tone before sending important emails',
              ]).map((q, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-700 font-semibold text-[11px] uppercase flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
              <span>Growth & Optimization</span>
            </span>
            <p className="text-slate-600 leading-relaxed">
              {synthesisData?.optimizationAdvice ||
                'Clear low-priority items from active working memory before starting complex creative projects.'}
            </p>
          </div>
        </div>

        {/* Growth Areas & Core Strengths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-amber-800 font-semibold text-[11px] uppercase flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>Potential Blindspots</span>
            </span>
            <p className="text-slate-700 leading-relaxed">
              "{synthesisData?.roast || results.roast}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-teal-800 font-semibold text-[11px] uppercase flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-teal-600" />
              <span>Core Strengths</span>
            </span>
            <p className="text-slate-700 leading-relaxed">
              "{synthesisData?.praise || results.praise}"
            </p>
          </div>
        </div>
      </div>

      {/* 4. Model Benchmarks Comparison */}
      <ModelBenchmarksCard userParamsBillion={results.finalParams / 1e9} />

      {/* 5. Global Population Distribution */}
      <GlobalDistributionCharts
        userParamsBillion={results.finalParams / 1e9}
        userArchetype={synthesisData?.customTitle || results.archetypeTitle}
      />

      {/* 6. Score Calculation Breakdown Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <button
          onClick={() => setShowMathDetails(!showMathDetails)}
          className="w-full p-4 text-left flex items-center justify-between text-xs font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-teal-600" />
            <span>Calculation & Scoring Breakdown</span>
          </div>
          {showMathDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showMathDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 border-t border-slate-100 bg-slate-50 text-xs font-mono space-y-2 text-slate-600"
            >
              <p>
                <strong className="text-slate-800">Formula:</strong> Total Params = Base (70B) × Layer Multiplier × Context Factor
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>• Baseline Capacity: 70,000,000,000</div>
                <div>• Analytical Layers: {results.layerDepthValue}</div>
                <div>• Context Window: {results.contextWindowFormatted}</div>
                <div>• Flexibility Index: {results.temperatureValue}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
