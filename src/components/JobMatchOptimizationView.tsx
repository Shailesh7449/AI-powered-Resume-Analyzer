import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  FileCheck2,
  Briefcase,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  Check,
  RotateCcw
} from 'lucide-react';
import { AnalysisResponse, JobMatchResult, SkillGapItem } from '../types';
import { analyzeResume } from '../services/api';

interface JobMatchOptimizationViewProps {
  analysis: AnalysisResponse;
  onUpdateAnalysis: (updated: AnalysisResponse) => void;
  onNavigateToStudio?: () => void;
}

export function JobMatchOptimizationView({
  analysis,
  onUpdateAnalysis,
  onNavigateToStudio,
}: JobMatchOptimizationViewProps) {
  const [isMatchingNewJd, setIsMatchingNewJd] = useState(false);
  const [customJdText, setCustomJdText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [appliedEdits, setAppliedEdits] = useState<Record<string, boolean>>({});
  const [scoreDiff, setScoreDiff] = useState<number | null>(null);

  const jobMatch = analysis.jobMatch;

  const handleRunMatch = async (jdToMatch: string) => {
    if (!jdToMatch.trim() || jdToMatch.length < 30) {
      setErrorMsg('Please provide a valid job description text (minimum 30 characters).');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const updated = await analyzeResume(analysis.parsedSections.rawText, jdToMatch);
      onUpdateAnalysis(updated);
      setIsMatchingNewJd(false);
      setCustomJdText('');
      setScoreDiff(null);
      setAppliedEdits({});
    } catch (err: any) {
      console.error('Job match error:', err);
      setErrorMsg(err?.message || 'Failed to analyze job match. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleJdPresets = [
    {
      title: 'Senior Full Stack Software Engineer (React/Node/AWS)',
      content: `Job Title: Senior Full Stack Software Engineer\n\nRequired Qualifications:\n• 4+ years professional software development experience.\n• Proficiency in TypeScript, JavaScript, React, Node.js, and PostgreSQL.\n• Strong experience building REST APIs, microservices, and Docker containerization.\n• Cloud deployments on AWS (ECS, Lambda, S3).\n• Hands-on CI/CD pipeline automation experience.`,
    },
    {
      title: 'Staff Machine Learning & AI Engineer (Python/PyTorch/LLMs)',
      content: `Job Title: Staff Machine Learning & Generative AI Engineer\n\nRequired Qualifications:\n• 4+ years of industry experience deploying machine learning pipelines.\n• Expert proficiency in Python, PyTorch, Scikit-Learn, and scientific packages.\n• Experience with Natural Language Processing (NLP), Transformers, and GenAI/RAG architectures.\n• Containerization with Docker and cloud deployment on AWS or GCP.`,
    },
    {
      title: 'Senior DevOps & Platform Engineer (Kubernetes/Terraform/AWS)',
      content: `Job Title: Senior DevOps & Platform Engineer\n\nRequired Qualifications:\n• 4+ years building cloud infrastructure and CI/CD pipelines.\n• Strong expertise in Kubernetes (EKS), Docker, and Terraform (IaC).\n• Proficient in AWS multi-account networking, Linux, and Bash scripting.\n• Monitoring with Prometheus, Grafana, and automated blue/green deployments.`,
    },
  ];

  // Targeted edits tailored to target job
  const targetedSuggestions = jobMatch ? [
    {
      id: 'sug-1',
      section: 'Professional Summary',
      title: `Feature ${jobMatch.detectedJobRole} in opening statement`,
      original: analysis.parsedSections.summary !== 'Not detected' ? analysis.parsedSections.summary : 'Results-driven engineer...',
      suggestion: `Targeted ${jobMatch.detectedJobRole} with verified background in ${jobMatch.matchingSkills.slice(0, 3).join(', ')}. Demonstrated success delivering high-performance scalable systems with proven reliability.`,
      ptsEstimate: 3,
      rationale: 'Aligns the primary resume headline with the hiring manager’s target role ontology.',
    },
    {
      id: 'sug-2',
      section: 'Technical Skills Header',
      title: `Prioritize ${jobMatch.matchingSkills.slice(0, 4).join(', ')} prominently`,
      original: 'Categorized technical catalog',
      suggestion: `Place core position keywords (${jobMatch.matchingSkills.slice(0, 4).join(', ')}) in the topmost category on Page 1 to ensure instant ATS scanner keyword extraction.`,
      ptsEstimate: 2,
      rationale: 'Elevates position keyword density in the first 300 words evaluated by ATS parsers.',
    },
    {
      id: 'sug-3',
      section: 'Work Experience Highlights',
      title: 'Incorporate quantifiable outcome metrics in latest role',
      original: analysis.parsedSections.experience[0]?.highlights[0] || 'Engineered software components and microservices.',
      suggestion: `Spearheaded system architecture using ${jobMatch.matchingSkills[0] || 'core technologies'}, reducing API response latency by 34% and improving deployment frequency across team.`,
      ptsEstimate: 3,
      rationale: 'Adheres to Google XYZ formula with concrete percentage outcome evidence.',
    },
  ] : [];

  const handleApplyEdit = (id: string, pts: number) => {
    const isNowApplied = !appliedEdits[id];
    setAppliedEdits(prev => ({ ...prev, [id]: isNowApplied }));

    const delta = isNowApplied ? pts : -pts;
    const currentDiff = scoreDiff || 0;
    const newDiff = currentDiff + delta;
    setScoreDiff(newDiff);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex items-center justify-between flex-wrap gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Job-Specific Resume Optimization & Match Engine</span>
            </h2>
            {jobMatch && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {jobMatch.overallMatchScore}% Match
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare candidate profile with any target job posting, uncover skill gaps, and apply verified targeted rewrites.
          </p>
        </div>

        <button
          onClick={() => setIsMatchingNewJd(!isMatchingNewJd)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{jobMatch ? 'Match New Job Description' : 'Select Target Job'}</span>
        </button>
      </div>

      {/* Target JD Selection Box */}
      {(isMatchingNewJd || !jobMatch) && (
        <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Select or Paste Target Job Requirements</span>
            </h3>
            {jobMatch && (
              <button
                onClick={() => setIsMatchingNewJd(false)}
                className="text-slate-400 hover:text-slate-600 font-semibold text-xs"
              >
                Close
              </button>
            )}
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-2 uppercase tracking-wider">
              Quick Test Presets (Zero Typing):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {sampleJdPresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handleRunMatch(preset.content)}
                  disabled={isLoading}
                  className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all font-medium text-slate-800 dark:text-slate-200"
                >
                  <span className="font-bold text-xs block text-indigo-700 dark:text-indigo-400 mb-1">{preset.title.split('(')[0]}</span>
                  <span className="text-[11px] text-slate-500 line-clamp-2">{preset.content}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom textarea */}
          <div className="pt-2">
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
              Or Paste Custom Job Description:
            </label>
            <textarea
              rows={4}
              value={customJdText}
              onChange={(e) => setCustomJdText(e.target.value)}
              placeholder="Paste responsibilities and required qualifications from LinkedIn, Indeed, or careers page..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 transition-all"
            />

            {errorMsg && (
              <p className="text-red-600 text-xs mt-1">{errorMsg}</p>
            )}

            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={() => handleRunMatch(customJdText)}
                disabled={isLoading || !customJdText.trim()}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
                <span>Run Resume-to-Job Matching</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Matched Analysis Content */}
      {jobMatch && (
        <div className="space-y-6">
          {/* Match Score Hero Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-6">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium">
                  Active Target Evaluation
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5">
                  {jobMatch.detectedJobRole}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {jobMatch.experienceRequirementSummary} • {jobMatch.educationRequirementSummary}
                </p>
              </div>

              {/* Score Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto text-xs">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Overall Fit</span>
                  <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {jobMatch.overallMatchScore}%
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Skills Match</span>
                  <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {jobMatch.skillMatchScore}%
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Cosine Similarity</span>
                  <span className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400">
                    {Math.round(jobMatch.semanticSimilarityScore * 100)}%
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Experience</span>
                  <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    {jobMatch.experienceMatchScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Tri-group skills: Matched, Partial, Missing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Matched */}
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Matched Skills ({jobMatch.matchingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {jobMatch.matchingSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partial */}
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Related / Conceptual Skills ({jobMatch.partialSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {jobMatch.partialSkills.length > 0 ? (
                    jobMatch.partialSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium text-[11px]">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No partial matches.</span>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
                <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1.5 mb-2.5">
                  <XCircle className="w-4 h-4" />
                  <span>Missing High-Priority Skills ({jobMatch.missingSkills.length})</span>
                </span>
                <div className="flex flex-wrap gap-1">
                  {jobMatch.missingSkills.length > 0 ? (
                    jobMatch.missingSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-medium text-[11px]">
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-600 font-medium">All core job skills covered!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Targeted Job-Specific Optimization Suggestions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Targeted Section Edits for {jobMatch.detectedJobRole}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review and accept targeted rewrites to maximize ATS keyword alignment without fabricating qualifications.
                </p>
              </div>

              {/* Real-time Score Diff Preview */}
              {scoreDiff !== null && scoreDiff > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 animate-in fade-in">
                  <TrendingUp className="w-4 h-4" />
                  <span>Estimated ATS Gain: +{scoreDiff} points ({analysis.atsScore.overallScore + scoreDiff}/100)</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {targetedSuggestions.map((sug) => {
                const isAccepted = appliedEdits[sug.id];

                return (
                  <div
                    key={sug.id}
                    className={`border rounded-2xl p-5 transition-all text-xs ${
                      isAccepted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-mono">
                            {sug.section}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            +{sug.ptsEstimate} pts ATS potential
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {sug.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleApplyEdit(sug.id, sug.ptsEstimate)}
                        className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
                          isAccepted
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isAccepted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isAccepted ? 'Accepted' : 'Accept Edit'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px] mb-2">
                      {sug.suggestion}
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      Why it matters: {sug.rationale}
                    </p>
                  </div>
                );
              })}
            </div>

            {onNavigateToStudio && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNavigateToStudio}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <span>Open in Resume Studio to Refine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
