import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import { GlobalAggregates, fetchGlobalAssessmentStats, GranularBin } from '../utils/telemetry';
import { NeuralResults } from '../types';
import { Users, TrendingUp, Loader2, Award, Sliders, Layers, Compass, Brain, Sparkles } from 'lucide-react';

interface GlobalDistributionChartsProps {
  userParamsBillion?: number;
  userArchetype?: string;
  userResults?: NeuralResults;
}

type TabKey = 'params1b' | 'context' | 'heads' | 'layers' | 'radar' | 'archetypes';

export const GlobalDistributionCharts: React.FC<GlobalDistributionChartsProps> = ({
  userParamsBillion = 70,
  userArchetype,
  userResults,
}) => {
  const [stats, setStats] = useState<GlobalAggregates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabKey>('params1b');

  // Range filter for 1B class width params
  const user1BBin = Math.floor(userParamsBillion);
  const [paramRangeFilter, setParamRangeFilter] = useState<'neighborhood' | '0-100' | '100-200' | '200-280' | 'all'>('neighborhood');

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setLoading(true);
      const data = await fetchGlobalAssessmentStats(userParamsBillion * 1e9);
      if (isMounted) {
        setStats(data);
        setLoading(false);
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [userParamsBillion]);

  if (loading || !stats) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2 shadow-xs">
        <Loader2 className="w-5 h-5 animate-spin text-teal-600 mx-auto" />
        <p className="text-xs font-mono text-slate-500">Loading population distribution dataset...</p>
      </div>
    );
  }

  // Filter 1B parameter bins according to selected range
  let filtered1BBins: GranularBin[] = stats.paramDistribution1B || [];
  if (paramRangeFilter === 'neighborhood') {
    const minBin = Math.max(10, user1BBin - 25);
    const maxBin = Math.min(280, user1BBin + 25);
    filtered1BBins = filtered1BBins.filter((b) => b.value >= minBin && b.value <= maxBin);
  } else if (paramRangeFilter === '0-100') {
    filtered1BBins = filtered1BBins.filter((b) => b.value >= 10 && b.value <= 100);
  } else if (paramRangeFilter === '100-200') {
    filtered1BBins = filtered1BBins.filter((b) => b.value >= 100 && b.value <= 200);
  } else if (paramRangeFilter === '200-280') {
    filtered1BBins = filtered1BBins.filter((b) => b.value >= 200 && b.value <= 280);
  }

  // Radar chart normalized metrics
  const userCwScore = userResults
    ? Math.min(100, Math.round((userResults.contextWindowValue / 128) * 100))
    : 50;
  const userHeadsScore = userResults
    ? Math.min(100, Math.round((userResults.attentionHeadsValue / 128) * 100))
    : 50;
  const userLayersScore = userResults
    ? Math.min(100, Math.round((userResults.layerDepthValue / 96) * 100))
    : 50;
  const userTempScore = userResults
    ? Math.min(100, Math.round(userResults.temperatureValue * 100))
    : 50;
  const userLexScore = userResults
    ? Math.min(100, Math.round((userResults.linguisticMetrics?.lexicalRichness || 0.5) * 100))
    : 50;
  const userParamsScore = Math.min(100, Math.round((userParamsBillion / 300) * 100));

  const globalCwScore = Math.min(100, Math.round((stats.averageContextWindow / 128) * 100));
  const globalHeadsScore = Math.min(100, Math.round((stats.averageAttentionHeads / 128) * 100));
  const globalLayersScore = Math.min(100, Math.round((stats.averageLayerDepth / 96) * 100));
  const globalTempScore = Math.min(100, Math.round(stats.averageTemperature * 100));
  const globalLexScore = Math.min(100, Math.round(stats.averageLexicalRichness * 100));
  const globalParamsScore = Math.min(100, Math.round((stats.averageParamsBillion / 300) * 100));

  const radarData = [
    { metric: 'Context Memory (C)', 'Your Profile': userCwScore, 'Global Mean': globalCwScore, fullMark: 100 },
    { metric: 'Focus Channels (H)', 'Your Profile': userHeadsScore, 'Global Mean': globalHeadsScore, fullMark: 100 },
    { metric: 'Cognitive Depth (L)', 'Your Profile': userLayersScore, 'Global Mean': globalLayersScore, fullMark: 100 },
    { metric: 'Flexibility Index', 'Your Profile': userTempScore, 'Global Mean': globalTempScore, fullMark: 100 },
    { metric: 'Lexical Density', 'Your Profile': userLexScore, 'Global Mean': globalLexScore, fullMark: 100 },
    { metric: 'Parameter Scale', 'Your Profile': userParamsScore, 'Global Mean': globalParamsScore, fullMark: 100 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Granular Population Distribution & Specifications
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Live Firestore Dataset
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Benchmarked against {stats.totalAssessments.toLocaleString()} completed cognitive profiles
          </p>
        </div>

        {/* Primary Metric Tab Selectors */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('params1b')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'params1b'
                ? 'bg-white text-teal-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-teal-600" />
            <span>1B Params</span>
          </button>

          <button
            onClick={() => setActiveTab('context')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'context'
                ? 'bg-white text-indigo-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Context (C)</span>
          </button>

          <button
            onClick={() => setActiveTab('heads')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'heads'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Heads (H)</span>
          </button>

          <button
            onClick={() => setActiveTab('layers')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'layers'
                ? 'bg-white text-purple-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Layers (L)</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center space-x-1 ${
              activeTab === 'radar'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-700" />
            <span>Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'archetypes'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Archetypes
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Percentile Rank</span>
          </span>
          <span className="text-teal-900 font-extrabold text-sm block">
            Top {100 - stats.userPercentile}% ({stats.userPercentile}th)
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mean Parameter Score</span>
          </span>
          <span className="text-slate-800 font-bold text-sm block">
            {stats.averageParamsBillion} Billion Params
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mean Context (C)</span>
          </span>
          <span className="text-slate-800 font-bold text-sm block">
            {stats.averageContextWindow}k Tokens
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Sample Dataset</span>
          </span>
          <span className="text-slate-800 font-bold text-sm block">
            {stats.totalAssessments.toLocaleString()} Profiles
          </span>
        </div>
      </div>

      {/* Tab 1: Granular 1B Class Width Parameters */}
      {activeTab === 'params1b' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">
                1 Billion Parameter Class Width Distribution
              </span>
              <span className="text-slate-500 text-[11px]">
                Each vertical bar represents a distinct 1.0 Billion parameter class bin.
              </span>
            </div>

            {/* Range Filters */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px]">
              <button
                onClick={() => setParamRangeFilter('neighborhood')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  paramRangeFilter === 'neighborhood'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Range (±25B)
              </button>
              <button
                onClick={() => setParamRangeFilter('0-100')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  paramRangeFilter === '0-100'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                10B-100B
              </button>
              <button
                onClick={() => setParamRangeFilter('100-200')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  paramRangeFilter === '100-200'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                100B-200B
              </button>
              <button
                onClick={() => setParamRangeFilter('200-280')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  paramRangeFilter === '200-280'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                200B-280B
              </button>
              <button
                onClick={() => setParamRangeFilter('all')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  paramRangeFilter === 'all'
                    ? 'bg-teal-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full Scale
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filtered1BBins} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={filtered1BBins.length > 60 ? 9 : 4}
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: number, name: string, props: any) => [
                    `${val} profiles (${props.payload.percentage}%)`,
                    `Class Bin: ${props.payload.value}B – ${props.payload.value + 1}B`,
                  ]}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {filtered1BBins.map((bin) => {
                    const isUserBin = bin.value === user1BBin;
                    return (
                      <Cell
                        key={`bin-${bin.value}`}
                        fill={isUserBin ? '#0d9488' : '#cbd5e1'}
                        stroke={isUserBin ? '#0f766e' : '#94a3b8'}
                        strokeWidth={isUserBin ? 2 : 1}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span>
              Your calculated parameter bin: <strong className="text-teal-800 font-mono">{user1BBin}B – {user1BBin + 1}B</strong>
            </span>
            <span className="text-teal-700 font-medium">Teal Bar = Your Exact 1B Class Bin</span>
          </div>
        </div>
      )}

      {/* Tab 2: Context Window (C) Distribution */}
      {activeTab === 'context' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Context Window (C) Capacity Distribution</span>
              <span className="text-slate-500 text-[11px]">
                Active working memory retention in k-tokens across population
              </span>
            </div>
            <span className="text-indigo-700 font-medium text-[11px]">
              Your C Value: <strong>{userResults?.contextWindowFormatted || '32k tokens'}</strong>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.contextDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: number, name: string, props: any) => [
                    `${val} profiles (${props.payload.percentage}%)`,
                    'Population Count',
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.contextDistribution.map((item) => {
                    const isMatch =
                      userResults && Math.abs(item.value - userResults.contextWindowValue) < 6;
                    return (
                      <Cell
                        key={`c-${item.value}`}
                        fill={isMatch ? '#4f46e5' : '#cbd5e1'}
                        stroke={isMatch ? '#4338ca' : '#94a3b8'}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Higher context windows enable complex multi-document synthesis and long-range coherence without token degradation.
          </p>
        </div>
      )}

      {/* Tab 3: Attention Heads (H) Distribution */}
      {activeTab === 'heads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Attention Heads (H) Channel Distribution</span>
              <span className="text-slate-500 text-[11px]">
                Parallel multi-channel attention routing capacity
              </span>
            </div>
            <span className="text-blue-700 font-medium text-[11px]">
              Your H Value: <strong>{userResults?.attentionHeadsValue || 32} channels</strong>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.headsDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: number, name: string, props: any) => [
                    `${val} profiles (${props.payload.percentage}%)`,
                    'Population Count',
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.headsDistribution.map((item) => {
                    const isMatch =
                      userResults && Math.abs(item.value - userResults.attentionHeadsValue) < 6;
                    return (
                      <Cell
                        key={`h-${item.value}`}
                        fill={isMatch ? '#2563eb' : '#cbd5e1'}
                        stroke={isMatch ? '#1d4ed8' : '#94a3b8'}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Attention head count dictates how many disparate signals or contexts can be tracked simultaneously.
          </p>
        </div>
      )}

      {/* Tab 4: Layer Depth (L) Distribution */}
      {activeTab === 'layers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Layer Depth (L) Cognitive Depth Distribution</span>
              <span className="text-slate-500 text-[11px]">
                Sequential hierarchical transformation depth
              </span>
            </div>
            <span className="text-purple-700 font-medium text-[11px]">
              Your L Value: <strong>{userResults?.layerDepthValue || 32} layers</strong>
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.layersDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: number, name: string, props: any) => [
                    `${val} profiles (${props.payload.percentage}%)`,
                    'Population Count',
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.layersDistribution.map((item) => {
                    const isMatch =
                      userResults && Math.abs(item.value - userResults.layerDepthValue) < 5;
                    return (
                      <Cell
                        key={`l-${item.value}`}
                        fill={isMatch ? '#7c3aed' : '#cbd5e1'}
                        stroke={isMatch ? '#6d28d9' : '#94a3b8'}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Deeper layer architectures excel at abstract multi-hop reasoning and nuanced logical deduction.
          </p>
        </div>
      )}

      {/* Tab 5: Multi-Trait Radar Comparison */}
      {activeTab === 'radar' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Normalized Architectural Specs (0 – 100 Scale)</span>
            <span className="text-teal-700 font-medium">Teal = Your Profile | Slate = Global Mean</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" stroke="#475569" fontSize={11} tickLine={false} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                <Radar
                  name="Your Profile"
                  dataKey="Your Profile"
                  stroke="#0d9488"
                  fill="#0d9488"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Global Mean"
                  dataKey="Global Mean"
                  stroke="#64748b"
                  fill="#94a3b8"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number, name: string) => [`${value} / 100`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 6: Archetypes Breakdown */}
      {activeTab === 'archetypes' && (
        <div className="space-y-3">
          <span className="text-xs text-slate-500 block font-medium">Population Archetype Breakdown</span>
          <div className="space-y-2.5">
            {stats.archetypeCounts.map((item, idx) => {
              const isMatch = item.archetype === userArchetype;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={isMatch ? 'text-teal-800 font-bold' : 'text-slate-700 font-medium'}>
                      {item.archetype} {isMatch && '(Your Archetype)'}
                    </span>
                    <span className="text-slate-500">
                      {item.percentage}% ({item.count} profiles)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMatch ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
