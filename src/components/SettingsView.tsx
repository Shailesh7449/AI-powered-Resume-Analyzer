import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Cpu,
  Info,
  Layers
} from 'lucide-react';
import { DEFAULT_WEIGHTS } from '../../server/atsScorer';
import { AnalysisResponse } from '../types';

interface SettingsViewProps {
  analysis: AnalysisResponse;
  onUpdateAnalysis?: (updated: AnalysisResponse) => void;
}

export function SettingsView({ analysis, onUpdateAnalysis }: SettingsViewProps) {
  const [weights, setWeights] = useState({ ...DEFAULT_WEIGHTS });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleWeightChange = (key: keyof typeof DEFAULT_WEIGHTS, val: number) => {
    const updated = { ...weights, [key]: val };
    setWeights(updated);
  };

  const handleResetWeights = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
    showToast('Reset ATS factor weights to academic defaults.');
  };

  const handleClearLocalData = () => {
    if (confirm('Are you sure you want to clear stored versions and learning roadmap progress?')) {
      localStorage.removeItem('resumeai_resume_versions');
      localStorage.removeItem('resumeai_learning_roadmap');
      showToast('Local application storage cleared.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-200 space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Platform Settings & Scoring Architecture</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              System Config
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure ATS scoring weight coefficients, view AI system telemetry, and manage browser storage.
          </p>
        </div>
      </div>

      {/* 1. AI Integration & Engine Diagnostics */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <span>1. AI Engine & NLP Inference Configuration</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Generative Model Provider
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Gemini 3.8 Flash</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Provides section rewrites, executive summaries, and career chat via server-side proxy routes.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ATS Scoring Engine
            </span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Deterministic NLP (8 Factors)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              100% explainable mathematical scoring engine. Scores are mathematically derived and never hallucinated.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Entity & Taxonomy Engine
            </span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Canonical Ontology (77+ Skills)</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Normalizes aliases (e.g. k8s → Kubernetes, python 3 → Python) across 8 categories with TF-IDF cosine matching.
            </p>
          </div>
        </div>
      </div>

      {/* 2. ATS Weight Coefficient Customizer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>2. Transparent ATS Factor Weight Coefficients</span>
          </h3>

          <button
            onClick={handleResetWeights}
            className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize the relative significance of each factor in the overall ATS score calculation formula:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {Object.entries(weights).map(([key, val]) => (
            <div key={key} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{val} pts</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={val}
                onChange={(e) => handleWeightChange(key as any, parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Storage & Privacy */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <Trash2 className="w-4 h-4 text-red-600" />
          <span>3. Data Storage & Privacy Controls</span>
        </h3>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Local Browser Storage</h4>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg">
              Saved resume versions and learning roadmap progress are stored securely in your browser's local storage. You can purge them at any time.
            </p>
          </div>

          <button
            onClick={handleClearLocalData}
            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 font-semibold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Storage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
