import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlobalAggregates, fetchGlobalAssessmentStats } from '../utils/telemetry';
import { Users, TrendingUp, Loader2, Award } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2 shadow-xs">
        <Loader2 className="w-5 h-5 animate-spin text-teal-600 mx-auto" />
        <p className="text-xs font-mono text-slate-500">Loading population distribution...</p>
      </div>
    );
  }

  const userBucketIndex = getUserBucketIndex(userParamsBillion);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Population Distribution
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Global Database Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Anonymized distribution benchmarked against {stats.totalAssessments.toLocaleString()} completed assessments
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('params')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'params'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parameter Spread
          </button>
          <button
            onClick={() => setActiveTab('archetypes')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'archetypes'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Archetypes
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Your Percentile</span>
          </span>
          <span className="text-teal-800 font-bold text-base block">
            Top {100 - stats.userPercentile}% ({stats.userPercentile}th percentile)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Global Average</span>
          </span>
          <span className="text-slate-800 font-bold text-base block">
            {stats.averageParamsBillion} Billion Params
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-slate-500 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Sample Size</span>
          </span>
          <span className="text-slate-800 font-bold text-base block">
            {stats.totalAssessments.toLocaleString()} Records
          </span>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'params' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Human Parameter Distribution (Billions)</span>
            <span className="text-teal-700 font-medium">Highlighted = Your Range</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.paramDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    borderRadius: '0.5rem',
                    color: '#0f172a',
                    fontSize: '12px',
                    fontFamily: 'sans-serif',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
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
                      fill={index === userBucketIndex ? '#0d9488' : '#e2e8f0'}
                      stroke={index === userBucketIndex ? '#0f766e' : '#cbd5e1'}
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
          <span className="text-xs text-slate-500 block font-medium">Archetype Population Breakdown</span>
          <div className="space-y-2.5">
            {stats.archetypeCounts.map((item, idx) => {
              const isMatch = item.archetype === userArchetype;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={isMatch ? 'text-teal-800 font-bold' : 'text-slate-700 font-medium'}>
                      {item.archetype} {isMatch && '(Your Archetype)'}
                    </span>
                    <span className="text-slate-500">{item.percentage}% ({item.count})</span>
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

function getUserBucketIndex(userParamsBillion?: number): number {
  if (!userParamsBillion) return 2;
  if (userParamsBillion < 50) return 0;
  if (userParamsBillion < 100) return 1;
  if (userParamsBillion < 200) return 2;
  if (userParamsBillion < 400) return 3;
  return 4;
}
