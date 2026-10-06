import React from 'react';
import { AtsScoreResult } from '../types';
import { Layers, Key, Code2, Briefcase, Trophy, Layout, UserCheck, Crosshair } from 'lucide-react';

interface ScoreBreakdownProps {
  atsScore: AtsScoreResult;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  structure: <Layers className="w-4 h-4 text-indigo-400" />,
  keywords: <Key className="w-4 h-4 text-amber-400" />,
  skillsMatch: <Code2 className="w-4 h-4 text-emerald-400" />,
  experience: <Briefcase className="w-4 h-4 text-sky-400" />,
  achievements: <Trophy className="w-4 h-4 text-yellow-400" />,
  formatting: <Layout className="w-4 h-4 text-purple-400" />,
  essentialInfo: <UserCheck className="w-4 h-4 text-rose-400" />,
  jobAlignment: <Crosshair className="w-4 h-4 text-teal-400" />,
};

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ atsScore }) => {
  const categories = Object.values(atsScore.categoryScores);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>ATS Scoring Breakdown by Component</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Formulaic breakdown normalized to 100 total points.
          </p>
        </div>
        <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
          Total: <span className="text-indigo-400 font-bold">{atsScore.overallScore}</span> / 100
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {categories.map((cat) => {
          const percentage = cat.percentage;
          let barColor = 'bg-emerald-500';
          if (percentage < 60) barColor = 'bg-red-500';
          else if (percentage < 75) barColor = 'bg-amber-500';

          return (
            <div
              key={cat.category}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {CATEGORY_ICONS[cat.category] || <Layers className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {cat.feedback}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono text-white">
                    {cat.score}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    /{cat.maxScore}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono">
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
                <div
                  className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
