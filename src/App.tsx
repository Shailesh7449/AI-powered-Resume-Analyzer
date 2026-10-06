/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Target,
  Award,
  Sparkles,
  BookOpen,
  BarChart3,
  Layers,
  CheckCircle2,
  TrendingUp,
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase
} from 'lucide-react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { AtsScoreCard } from './components/AtsScoreCard';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { ExtractedInfoView } from './components/ExtractedInfoView';
import { JobMatchCard } from './components/JobMatchCard';
import { SkillGapCard } from './components/SkillGapCard';
import { JobRecommendationsView } from './components/JobRecommendationsView';
import { QualityAuditView } from './components/QualityAuditView';
import { AiEnhancementsView } from './components/AiEnhancementsView';
import { MethodologyPage } from './pages/MethodologyPage';
import { BenchmarksPage } from './pages/BenchmarksPage';

import { fetchSamples } from './services/api';
import { exportAnalysisPdf } from './services/pdfExport';
import { AnalysisResponse, SampleItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('analyzer');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [samples, setSamples] = useState<{ resumes: SampleItem[]; jobs: SampleItem[] }>({
    resumes: [],
    jobs: [],
  });
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  useEffect(() => {
    fetchSamples()
      .then((data) => setSamples(data))
      .catch((err) => console.warn('Failed to load sample data:', err));
  }, []);

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setAnalysisResult(result);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActiveTab('analyzer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAnalysis={() => {
          setAnalysisResult(null);
          setActiveTab('analyzer');
        }}
      />

      {/* Main Body Content */}
      <main className="flex-1">
        {/* VIEW 1: Methodology Page */}
        {activeTab === 'methodology' && <MethodologyPage />}

        {/* VIEW 2: Academic Benchmarks Page */}
        {activeTab === 'benchmarks' && <BenchmarksPage />}

        {/* VIEW 3: Main Analyzer & Dashboard */}
        {(activeTab === 'analyzer' || activeTab === 'jobMatch' || activeTab === 'recommendations') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
            {/* If no analysis has been run yet, show the Landing Hero + Upload Area */}
            {!analysisResult ? (
              <div className="space-y-12">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Open-Source ATS Scoring & Semantic NLP Platform</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    Know How Strong Your Resume Really Is
                  </h1>

                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    Analyze your resume, check ATS compatibility, discover skill gaps, and find jobs that match your profile — completely for free.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('upload-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
                    >
                      <span>Check My ATS Score</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById('upload-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs tracking-wide transition-all flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-emerald-400" />
                      <span>Match Resume to Job</span>
                    </button>
                  </div>
                </div>

                {/* Upload & Ingestion Section */}
                <div id="upload-section" className="max-w-4xl mx-auto">
                  <FileUpload
                    onAnalysisComplete={handleAnalysisComplete}
                    samples={samples}
                  />
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Free ATS Compatibility</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Transparent 8-factor mathematical scoring: structure, keywords, experience, and format integrity without arbitrary paywalls.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">TF-IDF Job Description Matching</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Semantic vector space similarity and canonical skill ontology matching against any target job requirements.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Job Role Recommendations</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Maps candidate competencies to market roles like Machine Learning Engineer, Full Stack, or DevOps with salary ranges.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* RESULTS DASHBOARD */
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Result Navigation Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Analysis Dashboard
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Candidate: {analysisResult.parsedSections.personal.name !== 'Not detected' ? analysisResult.parsedSections.personal.name : 'Analyzed Profile'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportAnalysisPdf(analysisResult, analysisResult.parsedSections.personal.name)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Download PDF Report</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Upload Another</span>
                    </button>
                  </div>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto text-xs font-medium">
                  <button
                    onClick={() => setActiveTab('analyzer')}
                    className={`px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                      activeTab === 'analyzer'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ATS Score & Breakdown</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('jobMatch')}
                    className={`px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                      activeTab === 'jobMatch'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Job Match & Skill Gap</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`px-3.5 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                      activeTab === 'recommendations'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Recommended Job Roles</span>
                  </button>
                </div>

                {/* TAB CONTENT: ATS Score & Overview */}
                {activeTab === 'analyzer' && (
                  <div className="space-y-8">
                    {/* Primary ATS Score Card */}
                    <AtsScoreCard
                      atsScore={analysisResult.atsScore}
                      fullAnalysis={analysisResult}
                    />

                    {/* Mathematical Score Breakdown */}
                    <ScoreBreakdown
                      atsScore={analysisResult.atsScore}
                    />

                    {/* AI Executive Enhancements & XYZ Rewrites */}
                    {analysisResult.aiEnhancement && (
                      <AiEnhancementsView
                        enhancement={analysisResult.aiEnhancement}
                      />
                    )}

                    {/* Quality Audit: Readability, Action Verbs, Metrics */}
                    <QualityAuditView
                      qualityAudit={analysisResult.qualityAudit}
                    />

                    {/* Extracted Entities & Categorized Skills */}
                    <ExtractedInfoView
                      parsedSections={analysisResult.parsedSections}
                      skills={analysisResult.skills}
                    />
                  </div>
                )}

                {/* TAB CONTENT: Job Description Matching & Skill Gap */}
                {activeTab === 'jobMatch' && (
                  <div className="space-y-8">
                    <JobMatchCard
                      jobMatch={analysisResult.jobMatch}
                      onOpenJdInput={() => {
                        setAnalysisResult(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />

                    {analysisResult.jobMatch && (
                      <SkillGapCard
                        skillGapList={analysisResult.jobMatch.skillGapList}
                      />
                    )}
                  </div>
                )}

                {/* TAB CONTENT: Job Roles */}
                {activeTab === 'recommendations' && (
                  <div className="space-y-8">
                    <JobRecommendationsView
                      recommendations={analysisResult.jobRecommendations}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
