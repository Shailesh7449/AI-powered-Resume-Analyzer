import React, { useState, useEffect } from 'react';
import {
  History,
  Save,
  RotateCcw,
  GitCompare,
  Plus,
  Calendar,
  CheckCircle2,
  Trash2,
  FileText,
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AnalysisResponse, ResumeVersion } from '../types';
import { calculateAtsScore, DEFAULT_WEIGHTS } from '../../server/atsScorer';
import { extractAllTaxonomySkills } from '../../server/taxonomy';

interface ResumeVersionsViewProps {
  currentAnalysis: AnalysisResponse;
  onRestoreVersion: (restoredAnalysis: AnalysisResponse) => void;
}

export function ResumeVersionsView({ currentAnalysis, onRestoreVersion }: ResumeVersionsViewProps) {
  const [versions, setVersions] = useState<ResumeVersion[]>(() => {
    try {
      const saved = localStorage.getItem('resumeai_resume_versions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }

    // Default initial version from current analysis
    return [
      {
        id: 'ver-initial',
        versionName: 'v1.0 – Initial Upload Snapshot',
        createdAt: new Date().toLocaleString(),
        notes: 'Baseline uploaded resume with initial deterministic ATS evaluation.',
        resumeText: currentAnalysis.parsedSections.rawText,
        parsedSections: JSON.parse(JSON.stringify(currentAnalysis.parsedSections)),
        atsScore: JSON.parse(JSON.stringify(currentAnalysis.atsScore)),
        targetJobRole: currentAnalysis.jobMatch?.detectedJobRole || 'General Profile',
      },
    ];
  });

  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('resumeai_resume_versions', JSON.stringify(versions));
    } catch {
      // ignore
    }
  }, [versions]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;

    const newVer: ResumeVersion = {
      id: `ver-${Date.now()}`,
      versionName: newVersionName.trim(),
      createdAt: new Date().toLocaleString(),
      notes: newVersionNotes.trim() || 'Custom optimization checkpoint.',
      resumeText: currentAnalysis.parsedSections.rawText,
      parsedSections: JSON.parse(JSON.stringify(currentAnalysis.parsedSections)),
      atsScore: JSON.parse(JSON.stringify(currentAnalysis.atsScore)),
      targetJobRole: currentAnalysis.jobMatch?.detectedJobRole,
    };

    setVersions([newVer, ...versions]);
    setNewVersionName('');
    setNewVersionNotes('');
    setIsSavingNew(false);
    showToast(`Saved version "${newVer.versionName}" successfully!`);
  };

  const handleDeleteVersion = (id: string) => {
    if (versions.length <= 1) {
      alert('Cannot delete the last remaining version snapshot.');
      return;
    }
    setVersions(versions.filter(v => v.id !== id));
    if (compareVersionId === id) setCompareVersionId(null);
    showToast('Version removed.');
  };

  const handleRestore = (version: ResumeVersion) => {
    // Reconstruct updated analysis
    const restoredAnalysis: AnalysisResponse = {
      ...currentAnalysis,
      parsedSections: JSON.parse(JSON.stringify(version.parsedSections)),
      atsScore: JSON.parse(JSON.stringify(version.atsScore)),
    };

    onRestoreVersion(restoredAnalysis);
    showToast(`Restored "${version.versionName}"! ATS Score: ${version.atsScore.overallScore}/100`);
  };

  const comparedVersion = versions.find(v => v.id === compareVersionId);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-200 space-y-6">
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
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Resume Version History & Iteration Comparison</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {versions.length} Snapshots
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Safely store named iterations, inspect score progression, and restore prior versions with ATS recalculation.
          </p>
        </div>

        <button
          onClick={() => setIsSavingNew(!isSavingNew)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Current Version</span>
        </button>
      </div>

      {/* New Version Form */}
      {isSavingNew && (
        <form onSubmit={handleSaveVersion} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Save New Resume Iteration</h3>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Version Title</label>
            <input
              type="text"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              placeholder="e.g. v2.1 – Quantified NovaCloud Accomplishments & Added Docker"
              required
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Version Notes / Changes Made</label>
            <textarea
              rows={2}
              value={newVersionNotes}
              onChange={(e) => setNewVersionNotes(e.target.value)}
              placeholder="Summary of edits, ATS factor optimizations, or job target..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSavingNew(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold"
            >
              Save Version Snapshot
            </button>
          </div>
        </form>
      )}

      {/* Side-by-Side Comparison Modal / Box */}
      {comparedVersion && (
        <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-4 text-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-200 dark:border-indigo-800/60">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Comparing: Current Live State vs. {comparedVersion.versionName}
              </h3>
            </div>
            <button
              onClick={() => setCompareVersionId(null)}
              className="text-slate-400 hover:text-slate-600 font-semibold"
            >
              Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current State */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Current Live Resume</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Overall ATS Score:</span>
                <span className="font-bold text-indigo-600 text-base">{currentAnalysis.atsScore.overallScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Skills Detected:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentAnalysis.skills.totalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Experience Roles:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{currentAnalysis.parsedSections.experience.length}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500 italic">
                Summary: {currentAnalysis.parsedSections.summary.slice(0, 90)}...
              </div>
            </div>

            {/* Snapshot */}
            <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">{comparedVersion.versionName}</span>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Overall ATS Score:</span>
                <span className="font-bold text-purple-600 text-base">{comparedVersion.atsScore.overallScore}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Experience Roles:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{comparedVersion.parsedSections.experience.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Saved Date:</span>
                <span className="font-mono text-slate-500">{comparedVersion.createdAt}</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500 italic">
                Summary: {comparedVersion.parsedSections.summary.slice(0, 90)}...
              </div>

              <button
                onClick={() => handleRestore(comparedVersion)}
                className="w-full mt-2 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore this Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Versions List */}
      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className="p-4 bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {ver.versionName}
                </h4>
                <span className="font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-[10px]">
                  ATS: {ver.atsScore.overallScore}/100
                </span>
                {ver.targetJobRole && (
                  <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                    Target: {ver.targetJobRole}
                  </span>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-xs">
                {ver.notes}
              </p>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <Calendar className="w-3 h-3" />
                <span>{ver.createdAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareVersionId(compareVersionId === ver.id ? null : ver.id)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <GitCompare className="w-3.5 h-3.5 text-indigo-500" />
                <span>{compareVersionId === ver.id ? 'Hide Diff' : 'Compare'}</span>
              </button>

              <button
                onClick={() => handleRestore(ver)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>

              <button
                onClick={() => handleDeleteVersion(ver.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete snapshot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
