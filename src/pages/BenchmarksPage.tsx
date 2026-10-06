import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Terminal, CheckCircle2, TrendingUp, Cpu, Database } from 'lucide-react';
import { fetchAcademicBenchmarks } from '../services/api';

export const BenchmarksPage: React.FC = () => {
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBenchmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAcademicBenchmarks();
      setBenchmarkData(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load benchmarks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBenchmarks();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold">
          <Terminal className="w-3.5 h-3.5" />
          <span>Information Retrieval & NLP Evaluation Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Model Evaluation & Academic Benchmarks
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Quantitative metrics evaluating named entity skill extraction, ranking efficacy, and information retrieval accuracy across labeled benchmark test cases.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={loadBenchmarks}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-all flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-run Evaluation Suite</span>
        </button>
      </div>

      {loading && !benchmarkData && (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
          Computing Information Retrieval metrics across test corpus...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300">
          {error}
        </div>
      )}

      {benchmarkData && (
        <div className="space-y-6">
          {/* Card 1: Skill Extraction Classification Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>1. Skill Extraction & Entity Recognition (Classification Metrics)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluated against labeled ground-truth skill annotations.
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
                {benchmarkData.sampleTestCasesRun} Test Vectors Run
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Precision</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {(benchmarkData.skillExtractionBenchmark.precision * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">TP / (TP + FP)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Recall</span>
                <span className="text-2xl font-bold font-mono text-indigo-400">
                  {(benchmarkData.skillExtractionBenchmark.recall * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">TP / (TP + FN)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">F1-Score</span>
                <span className="text-2xl font-bold font-mono text-violet-400">
                  {(benchmarkData.skillExtractionBenchmark.f1Score * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Harmonic Mean</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Accuracy Est.</span>
                <span className="text-2xl font-bold font-mono text-sky-400">
                  {(benchmarkData.skillExtractionBenchmark.accuracyEstimate * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Jaccard Alignment</span>
              </div>
            </div>
          </div>

          {/* Card 2: Ranking & Recommendation Quality (IR Metrics) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 flex-wrap gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>2. Information Retrieval & Job Role Ranking Quality</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Measures top-k ranking relevance and discount factors.
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
                k=3 / k=5 evaluations
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Precision@3</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {(benchmarkData.rankingBenchmark.precisionAt3 * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Top-3 Relevance</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">Recall@3</span>
                <span className="text-2xl font-bold font-mono text-teal-400">
                  {(benchmarkData.rankingBenchmark.recallAt3 * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Ground-truth capture</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">MRR (Mean Reciprocal Rank)</span>
                <span className="text-2xl font-bold font-mono text-indigo-400">
                  {benchmarkData.rankingBenchmark.mrr.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">1 / Rank(1st hit)</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-1">NDCG@5</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {benchmarkData.rankingBenchmark.ndcgAt5.toFixed(3)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Discounted Gain</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
