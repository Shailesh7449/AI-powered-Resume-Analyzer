import React from 'react';
import { RecommendedJobRole } from '../types';
import { Award, Briefcase, TrendingUp, DollarSign, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

interface JobRecommendationsViewProps {
  recommendations: RecommendedJobRole[];
}

export const JobRecommendationsView: React.FC<JobRecommendationsViewProps> = ({ recommendations }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>AI-Recommended Career Roles & Market Fit</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked using multi-factor ontology graph matching against {recommendations.length} standardized roles.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-slate-950 text-indigo-300 border border-slate-800 rounded-lg font-mono">
          Top Role: {recommendations[0]?.roleTitle || 'Software Engineer'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {recommendations.slice(0, 6).map((role, idx) => {
          const match = role.matchPercentage;
          let matchBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
          if (match < 60) matchBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/30';

          return (
            <div
              key={role.roleId}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block mb-0.5">
                      Rank #{idx + 1} Recommendation
                    </span>
                    <h3 className="font-bold text-white text-base">
                      {role.roleTitle}
                    </h3>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold font-mono shrink-0 ${matchBadge}`}>
                    {match}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {role.whyFits}
                </p>

                {/* Skills Match vs Missing */}
                <div className="space-y-2 mb-4 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      Matched Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.matchedSkills.slice(0, 5).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {role.missingSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Recommended to Add:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.missingSkills.slice(0, 4).map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded font-mono">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Salary & Growth footer */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{role.salaryRange}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{role.growthOutlook.split('(')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
