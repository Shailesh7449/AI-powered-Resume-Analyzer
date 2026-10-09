import React, { useState } from 'react';
import { RecommendedJobRole } from '../types';
import {
  Award,
  Briefcase,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface JobRecommendationsViewProps {
  recommendations: RecommendedJobRole[];
  onSelectRoleForSearch?: (roleTitle: string) => void;
}

export const JobRecommendationsView: React.FC<JobRecommendationsViewProps> = ({
  recommendations,
  onSelectRoleForSearch,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

  const domains = [
    { id: 'all', label: 'All Domains' },
    { id: 'Web & Full Stack', label: 'Web & Full Stack' },
    { id: 'AI & Data Science', label: 'AI & Data' },
    { id: 'Cloud & Infrastructure', label: 'Cloud & DevOps' },
    { id: 'Security & Systems', label: 'Security & Systems' },
    { id: 'Mobile & Systems', label: 'Mobile' },
  ];

  const filteredRoles = selectedDomain === 'all'
    ? recommendations
    : recommendations.filter(r => r.domain === selectedDomain);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-200 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Dynamic Job Role Discovery & Career Mapping</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Curated Market Catalog
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Roles evaluated dynamically against candidate core skills, past job history, and practical project evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Match:</span>
          <span className="text-xs px-3 py-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 rounded-lg font-bold">
            {recommendations[0]?.roleTitle || 'Software Engineer'} ({recommendations[0]?.matchPercentage || 0}%)
          </span>
        </div>
      </div>

      {/* Domain Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Domain:
        </span>
        {domains.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDomain(d.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              selectedDomain === d.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredRoles.map((role, idx) => {
          const match = role.matchPercentage;
          const isExpanded = expandedRoleId === role.roleId;

          let matchBadge = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30';
          if (match < 60) matchBadge = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30';
          if (match < 40) matchBadge = 'text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700';

          return (
            <div
              key={role.roleId}
              className="bg-slate-50/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        Rank #{idx + 1}
                      </span>
                      {role.domain && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {role.domain}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {role.roleTitle}
                    </h3>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold font-mono shrink-0 ${matchBadge}`}>
                    {match}% Match
                  </span>
                </div>

                {/* Compatibility Score Breakdown Bar */}
                {role.compatibilityBreakdown && (
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/70 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Transparent Score Factor</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Alignment</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Core Skills</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{role.compatibilityBreakdown.coreSkillsPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${role.compatibilityBreakdown.coreSkillsPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Optional</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{role.compatibilityBreakdown.optionalSkillsPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${role.compatibilityBreakdown.optionalSkillsPct}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Experience</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{role.compatibilityBreakdown.experienceAlignmentPct}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${role.compatibilityBreakdown.experienceAlignmentPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Why fits rationale */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {role.whyFits}
                </p>

                {/* Experience Evidence */}
                {role.experienceEvidence && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-0.5">
                      Extracted Candidate Evidence:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{role.experienceEvidence}</span>
                  </div>
                )}

                {/* Skills tags */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Matched Competencies ({role.matchedSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.matchedSkills.slice(0, 6).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {role.missingSkills.length > 0 && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                        High-Priority Skills to Add:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {role.missingSkills.slice(0, 4).map((s) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-md font-mono">
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible Next Steps */}
                {role.suggestedNextSteps && role.suggestedNextSteps.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => setExpandedRoleId(isExpanded ? null : role.roleId)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Next Steps' : 'View Actionable Next Steps'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="mt-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs animate-in fade-in duration-200">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Recommended Actions for this Role:
                        </span>
                        {role.suggestedNextSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom footer: salary, growth & quick action */}
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{role.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    <TrendingUp className="w-3 h-3 text-indigo-500" />
                    <span>{role.growthOutlook.split('(')[0]}</span>
                  </div>
                </div>

                {onSelectRoleForSearch && (
                  <button
                    onClick={() => onSelectRoleForSearch(role.roleTitle)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    <span>Search Jobs</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
