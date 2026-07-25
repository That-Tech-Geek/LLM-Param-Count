import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { GlobalAggregates, fetchGlobalAssessmentStats } from '../utils/telemetry';
import { Database, Users, BarChart3, TrendingUp, Sparkles, Brain, Loader2 } from 'lucide-react';

interface GlobalDistributionChartsProps {
  userParamsBillion?: number;
  userArchetype?: string;
}

const COLORS = ['#06b6d4', '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

export const GlobalDistributionCharts: React.FC<GlobalDistributionChartsProps> = ({
  userParamsBillion,
  userArchetype,
}) => {
  const [stats, setStats] = useState<GlobalAggregates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setLoading(true);
      const data = await fetchGlobalAssessmentStats(
        userParamsBillion ? userParamsBillion * 1e9 : undefined
      );
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
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-8 text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading live Firestore global distribution data...</p>
      </div>
    );
  }

  // Determine user bucket for parameter distribution chart
  const userBucketIndex = getUserBucketIndex(userParamsBillion);

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-cyan-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-8">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Firestore Global Neural Population Distribution</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                Live Data
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Anonymously aggregated telemetry across all completed human neural assessments
            </p>
          </div>
        </div>

        {/* Global Summary Stat Cards */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase block flex items-center space-x-1">
              <Users className="w-3 h-3 text-cyan-400" />
              <span>Total Assessed</span>
            </span>
            <span className="text-white font-bold text-sm">{stats.totalAssessments.toLocaleString()}</span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
            <span className="text-slate-400 text-[10px] uppercase block flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-purple-400" />
              <span>Global Average</span>
            </span>
            <span className="text-purple-300 font-bold text-sm">{stats.averageParamsBillion}B</span>
          </div>
        </div>
      </div>

      {/* User Percentile Rank Callout Banner */}
      {userParamsBillion && (
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-950 to-purple-950/80 rounded-2xl border border-cyan-500/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Your Population Percentile Score
              </span>
              <p className="text-sm font-sans text-slate-200 mt-0.5">
                Your <strong className="text-white">{userParamsBillion.toFixed(1)}B</strong> parameters place you in the{' '}
                <strong className="text-cyan-300 underline underline-offset-4 decoration-cyan-500">
                  Top {100 - stats.userPercentile}%
                </strong>{' '}
                of all human neural architectures recorded!
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-sm font-bold">
            Percentile: {stats.userPercentile}th
          </div>
        </div>
      )}

      {/* Grid of Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Parameter Weight Distribution (Bar Chart) */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Parameter Size Distribution (Billions)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Cyan = Your Bucket</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.paramDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val: number) => [`${val} humans (${Math.round((val / stats.totalAssessments) * 100)}%)`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.paramDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === userBucketIndex ? '#06b6d4' : '#334155'}
                      stroke={index === userBucketIndex ? '#22d3ee' : undefined}
                      strokeWidth={index === userBucketIndex ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Archetype Breakdown (Pie Chart) */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Archetype Population Breakdown</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Global Types</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.archetypeCounts}
                  dataKey="count"
                  nameKey="archetype"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={4}
                  label={({ archetype, percentage }) => `${archetype.slice(0, 15)}... (${percentage}%)`}
                  labelLine={false}
                >
                  {stats.archetypeCounts.map((entry, index) => (
                    <Cell
                      key={`pie-cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke={entry.archetype === userArchetype ? '#ffffff' : '#020617'}
                      strokeWidth={entry.archetype === userArchetype ? 3 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val: number) => [`${val} humans`, 'Population']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Temperature Tiers (Bar Chart) */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Sampling Temperature Variance Spectrum</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.temperatureDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="tier" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Context Window Retention Sizes */}
        <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Context Window RAM Retention Sizes</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.contextWindowDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function getUserBucketIndex(userParamsBillion?: number): number {
  if (!userParamsBillion) return 2;
  if (userParamsBillion < 50) return 0;
  if (userParamsBillion < 100) return 1;
  if (userParamsBillion < 200) return 2;
  if (userParamsBillion < 400) return 3;
  return 4;
}
