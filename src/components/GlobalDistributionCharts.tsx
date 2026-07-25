import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlobalAggregates, fetchGlobalAssessmentStats } from '../utils/telemetry';
import { Users, BarChart3, TrendingUp, Loader2, Award } from 'lucide-react';

interface GlobalDistributionChartsProps {
  userParamsBillion?: number;
  userArchetype?: string;
}

export const GlobalDistributionCharts: React.FC<GlobalDistributionChartsProps> = ({
  userParamsBillion,
  userArchetype,
}) => {
  const [stats, setStats] = useState<GlobalAggregates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'params' | 'archetypes'>('params');

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
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 text-center space-y-2">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-400 mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading population telemetry...</p>
      </div>
    );
  }

  const userBucketIndex = getUserBucketIndex(userParamsBillion);

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-white tracking-tight">
              Population Telemetry
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              Live Firestore Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Anonymized distribution benchmarked against {stats.totalAssessments.toLocaleString()} completed assessments
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('params')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'params'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parameter Spread
          </button>
          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'archetypes'
                ? 'bg-slate-800 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Archetypes
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>Your Rank</span>
          </span>
          <span className="text-cyan-300 font-bold text-base block">
            Top {100 - stats.userPercentile}% ({stats.userPercentile}th percentile)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Global Average</span>
          </span>
          <span className="text-purple-300 font-bold text-base block">
            {stats.averageParamsBillion} Billion Params
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample Size</span>
          </span>
          <span className="text-slate-200 font-bold text-base block">
            {stats.totalAssessments.toLocaleString()} Records
          </span>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'params' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Human Parameter Distribution (Billions)</span>
            <span className="text-cyan-400">Highlighted = Your Bucket</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.paramDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(val: number) => [
                    `${val} humans (${Math.round((val / stats.totalAssessments) * 100)}%)`,
                    'Count',
                  ]}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.paramDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === userBucketIndex ? '#06b6d4' : '#1e293b'}
                      stroke={index === userBucketIndex ? '#22d3ee' : '#334155'}
                      strokeWidth={1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <span className="text-xs font-mono text-slate-400 block">Archetype Frequency breakdown</span>
          <div className="space-y-2">
            {stats.archetypeCounts.map((item, idx) => {
              const isMatch = item.archetype === userArchetype;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={isMatch ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                      {item.archetype} {isMatch && '(Your Archetype)'}
                    </span>
                    <span className="text-slate-400">{item.percentage}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMatch ? 'bg-cyan-400' : 'bg-slate-700'
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

function getUserBucketIndex(userParamsBillion?: number): number {
  if (!userParamsBillion) return 2;
  if (userParamsBillion < 50) return 0;
  if (userParamsBillion < 100) return 1;
  if (userParamsBillion < 200) return 2;
  if (userParamsBillion < 400) return 3;
  return 4;
}
