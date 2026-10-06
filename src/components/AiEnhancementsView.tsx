import React from 'react';
import { Sparkles, ArrowRight, Wand2, Lightbulb, CheckCheck } from 'lucide-react';

interface AiEnhancementsViewProps {
  enhancement?: {
    executiveSummaryAnalysis: string;
    bulletPointRewrites: {
      original: string;
      improved: string;
      rationale: string;
    }[];
    tailoringAdvice: string[];
  } | null;
}

export const AiEnhancementsView: React.FC<AiEnhancementsViewProps> = ({ enhancement }) => {
  if (!enhancement) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Bullet Point Rewriter & Executive Strategy</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Powered by Google XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]").
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
          Strategic Recruiter Lens
        </span>
      </div>

      {/* Executive Summary Analysis */}
      {enhancement.executiveSummaryAnalysis && (
        <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-xs">
          <h3 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Recruiter Assessment</span>
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {enhancement.executiveSummaryAnalysis}
          </p>
        </div>
      )}

      {/* Bullet Point Rewrites Before & After */}
      {enhancement.bulletPointRewrites.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>High-Impact Experience Bullet Rewrites</span>
          </h3>

          <div className="space-y-3">
            {enhancement.bulletPointRewrites.map((rewrite, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5">
                <div className="text-slate-400">
                  <span className="font-semibold text-red-400 text-[11px] uppercase block mb-0.5">Original (Weak or Unquantified):</span>
                  <p className="line-through opacity-80 pl-2 border-l-2 border-red-500/40">
                    "{rewrite.original}"
                  </p>
                </div>

                <div className="text-slate-200">
                  <span className="font-semibold text-emerald-400 text-[11px] uppercase block mb-0.5">Recommended ATS High-Impact Rewrite:</span>
                  <p className="font-medium text-emerald-300 pl-2 border-l-2 border-emerald-500">
                    "{rewrite.improved}"
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2 rounded border border-slate-800">
                  <strong>Rationale:</strong> {rewrite.rationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tailoring Advice */}
      {enhancement.tailoringAdvice.length > 0 && (
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
          <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <CheckCheck className="w-4 h-4 text-teal-400" />
            <span>Tailoring Advice for Target Submissions:</span>
          </h4>
          <ul className="space-y-1.5 text-slate-300">
            {enhancement.tailoringAdvice.map((advice, aIdx) => (
              <li key={aIdx} className="flex items-start gap-2">
                <span className="text-teal-400 font-bold">•</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
