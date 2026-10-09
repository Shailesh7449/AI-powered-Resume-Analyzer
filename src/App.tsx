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
  Briefcase,
  Construction
} from 'lucide-react';

import { ThemeProvider } from './context/ThemeContext';
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

import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ResumeStudio } from './components/ResumeStudio';
import { AiCareerAssistantView } from './components/AiCareerAssistantView';
import { RealJobSearchView } from './components/RealJobSearchView';
import { JobMatchOptimizationView } from './components/JobMatchOptimizationView';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { ResumeVersionsView } from './components/ResumeVersionsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

import { fetchSamples, analyzeResume } from './services/api';
import { exportAnalysisPdf } from './services/pdfExport';
import { AnalysisResponse, SampleItem } from './types';

// Placeholder Component for missing views
function PlaceholderView({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md">{description}</p>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('');
  const [samples, setSamples] = useState<{ resumes: SampleItem[]; jobs: SampleItem[] }>({
    resumes: [],
    jobs: [],
  });

  useEffect(() => {
    fetchSamples()
      .then((data) => setSamples(data))
      .catch((err) => console.warn('Failed to load sample data:', err));
  }, []);

  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setAnalysisResult(result);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setActiveTab('dashboard');
  };

  // Derive stats for sidebar
  const stats = {
    atsScore: analysisResult?.atsScore.overallScore,
    jobsFound: analysisResult?.jobRecommendations?.length || 0,
    jobMatches: analysisResult?.jobMatch ? 1 : 0,
    skillGaps: analysisResult?.jobMatch?.skillGapList?.filter(g => g.status === 'missing').length || 0,
    versions: 3, // Mock value as per instructions
    newAiAdvice: !!analysisResult?.aiEnhancement
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white transition-colors duration-200">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAnalysis={() => {
          setAnalysisResult(null);
          setActiveTab('dashboard');
        }}
      />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex-1 flex w-full">
        {analysisResult && activeTab !== 'methodology' && activeTab !== 'benchmarks' && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            stats={stats}
          />
        )}
        
        <main className={`flex-1 ${analysisResult && activeTab !== 'methodology' && activeTab !== 'benchmarks' ? 'p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full overflow-x-hidden' : 'w-full'}`}>
          {/* VIEW 1: Methodology Page */}
          {activeTab === 'methodology' && <MethodologyPage />}

          {/* VIEW 2: Academic Benchmarks Page */}
          {activeTab === 'benchmarks' && <BenchmarksPage />}

          {/* VIEW 3: Landing / Upload OR Dashboard Views */}
          {activeTab !== 'methodology' && activeTab !== 'benchmarks' && (
            <div className="mx-auto w-full">
              {!analysisResult ? (
                /* Landing & Upload View */
                <div className="space-y-12 py-8 sm:py-12 px-4 max-w-7xl mx-auto">
                  <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>Free Open-Source ATS Scoring & Semantic NLP Platform</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                      Know How Strong Your Resume Really Is
                    </h1>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                      Analyze your resume, check ATS compatibility, discover skill gaps, and find jobs that match your profile — completely for free.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById('upload-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
                      >
                        <span>Check My ATS Score</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const el = document.getElementById('upload-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 font-semibold text-xs tracking-wide transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Match Resume to Job</span>
                      </button>
                    </div>
                  </div>

                  <div id="upload-section" className="max-w-4xl mx-auto">
                    <FileUpload
                      onAnalysisComplete={handleAnalysisComplete}
                      samples={samples}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Free ATS Compatibility</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Transparent 8-factor mathematical scoring: structure, keywords, experience, and format integrity without arbitrary paywalls.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">TF-IDF Job Description Matching</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Semantic vector space similarity and canonical skill ontology matching against any target job requirements.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Job Role Recommendations</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Maps candidate competencies to market roles like Machine Learning Engineer, Full Stack, or DevOps with salary ranges.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Application Views (with Sidebar Active) */
                <div className="space-y-6">
                  {/* Top utility bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      Current Profile: <span className="font-bold text-slate-900 dark:text-slate-100">{analysisResult.parsedSections.personal.name !== 'Not detected' ? analysisResult.parsedSections.personal.name : 'Unknown Candidate'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportAnalysisPdf(analysisResult, analysisResult.parsedSections.personal.name)}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Routing based on activeTab */}
                  {activeTab === 'dashboard' && (
                    <DashboardOverview analysis={analysisResult} setActiveTab={setActiveTab} />
                  )}

                  {activeTab === 'resume' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Resume</h2>
                      <ExtractedInfoView
                        parsedSections={analysisResult.parsedSections}
                        skills={analysisResult.skills}
                        mlInsights={analysisResult.mlInsights}
                      />
                    </div>
                  )}

                  {activeTab === 'atsScore' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ATS Score Details</h2>
                      <AtsScoreCard
                        atsScore={analysisResult.atsScore}
                        fullAnalysis={analysisResult}
                      />
                      <ScoreBreakdown atsScore={analysisResult.atsScore} />
                      <QualityAuditView qualityAudit={analysisResult.qualityAudit} />
                    </div>
                  )}

                  {activeTab === 'aiEditor' && (
                    <div className="animate-in fade-in duration-300">
                      <ResumeStudio analysis={analysisResult} onUpdate={setAnalysisResult} />
                    </div>
                  )}

                  {activeTab === 'aiChat' && (
                    <div className="animate-in fade-in duration-300">
                      <AiCareerAssistantView
                        analysis={analysisResult}
                        onNavigateToTab={setActiveTab}
                      />
                    </div>
                  )}

                  {activeTab === 'findJobs' && (
                    <div className="animate-in fade-in duration-300 space-y-8">
                      <JobRecommendationsView
                        recommendations={analysisResult.jobRecommendations}
                        onSelectRoleForSearch={(role) => {
                          setJobSearchQuery(role);
                        }}
                      />
                      <RealJobSearchView
                        initialQuery={jobSearchQuery}
                        onMatchWithJob={async (jobText) => {
                          try {
                            const updated = await analyzeResume(analysisResult.parsedSections.rawText, jobText);
                            setAnalysisResult(updated);
                            setActiveTab('jobMatch');
                          } catch (e) {
                            console.error('Job match error:', e);
                          }
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'jobMatch' && (
                    <div className="animate-in fade-in duration-300">
                      <JobMatchOptimizationView
                        analysis={analysisResult}
                        onUpdateAnalysis={setAnalysisResult}
                        onNavigateToStudio={() => setActiveTab('aiEditor')}
                      />
                    </div>
                  )}

                  {activeTab === 'learn' && (
                    <div className="animate-in fade-in duration-300">
                      <LearningRoadmapView
                        analysis={analysisResult}
                        onNavigateToTab={setActiveTab}
                      />
                    </div>
                  )}

                  {activeTab === 'versions' && (
                    <div className="animate-in fade-in duration-300">
                      <ResumeVersionsView
                        currentAnalysis={analysisResult}
                        onRestoreVersion={(restored) => {
                          setAnalysisResult(restored);
                        }}
                      />
                    </div>
                  )}

                  {activeTab === 'reports' && (
                    <div className="animate-in fade-in duration-300">
                      <ReportsView analysis={analysisResult} />
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="animate-in fade-in duration-300">
                      <SettingsView
                        analysis={analysisResult}
                        onUpdateAnalysis={setAnalysisResult}
                      />
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Global Footer */}
      {!analysisResult && <Footer onSelectTab={setActiveTab} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
