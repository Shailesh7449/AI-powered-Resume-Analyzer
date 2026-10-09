import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FolderGit2
} from 'lucide-react';
import { AnalysisResponse, LearningRoadmapItem } from '../types';

interface LearningRoadmapViewProps {
  analysis: AnalysisResponse;
  onNavigateToTab?: (tab: string) => void;
}

// Curated verified reputable documentation & learning resources
const RESOURCE_DIRECTORY: Record<string, { title: string; url: string; effort: string; exercise: string }> = {
  Docker: {
    title: 'Docker Official Getting Started Guide & CLI Reference',
    url: 'https://docs.docker.com/get-started/',
    effort: '~6-8 hours (Estimated)',
    exercise: 'Containerize an Express/Node.js or Python service with multi-stage build and test locally.',
  },
  Kubernetes: {
    title: 'Kubernetes Official Interactive Basics Tutorial',
    url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
    effort: '~15-20 hours (Estimated)',
    exercise: 'Deploy a mini-cluster with Minikube, write a Deployment manifest, and configure Ingress routing.',
  },
  AWS: {
    title: 'AWS Cloud Architecture & Services Documentation',
    url: 'https://docs.aws.amazon.com/',
    effort: '~12-16 hours (Estimated)',
    exercise: 'Provision an S3 bucket and deploy an automated serverless Lambda function using AWS SAM or CDK.',
  },
  PostgreSQL: {
    title: 'PostgreSQL Official Documentation & Query Optimization',
    url: 'https://www.postgresql.org/docs/current/performance-tips.html',
    effort: '~8-10 hours (Estimated)',
    exercise: 'Execute EXPLAIN ANALYZE on complex joins, create multi-column B-tree indexes, and compare query plans.',
  },
  Redis: {
    title: 'Redis University & Official Documentation',
    url: 'https://redis.io/docs/latest/develop/get-started/',
    effort: '~5-7 hours (Estimated)',
    exercise: 'Implement Redis caching with TTL for high-traffic API endpoints and session persistence.',
  },
  TypeScript: {
    title: 'TypeScript Official Handbook & Deep Dive',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    effort: '~10-12 hours (Estimated)',
    exercise: 'Refactor JavaScript utility types to strict generics, discriminated unions, and branded types.',
  },
  'CI/CD Pipelines': {
    title: 'GitHub Actions Official Documentation',
    url: 'https://docs.github.com/en/actions',
    effort: '~4-6 hours (Estimated)',
    exercise: 'Set up an automated GitHub Action workflow running linter, unit test suite, and build checks on pull request.',
  },
  PyTorch: {
    title: 'PyTorch Official Deep Learning Tutorials',
    url: 'https://pytorch.org/tutorials/',
    effort: '~15-20 hours (Estimated)',
    exercise: 'Train and evaluate a transfer learning classifier on an image or text dataset using PyTorch Lightning.',
  },
  GraphQL: {
    title: 'GraphQL Official Learning Guide',
    url: 'https://graphql.org/learn/',
    effort: '~6-8 hours (Estimated)',
    exercise: 'Create a schema with queries, mutations, and DataLoader to prevent N+1 query overhead.',
  },
  Terraform: {
    title: 'HashiCorp Terraform Official Tutorials',
    url: 'https://developer.hashicorp.com/terraform/tutorials',
    effort: '~8-12 hours (Estimated)',
    exercise: 'Write reusable Terraform modules with input variables, state locking, and output references.',
  },
};

export function LearningRoadmapView({ analysis, onNavigateToTab }: LearningRoadmapViewProps) {
  // Collect missing skills from jobMatch or top recommended role
  const targetRoleName = analysis.jobMatch?.detectedJobRole || analysis.jobRecommendations[0]?.roleTitle || 'Target Role';
  
  const rawMissingSkills = analysis.jobMatch?.missingSkills && analysis.jobMatch.missingSkills.length > 0
    ? analysis.jobMatch.missingSkills
    : analysis.jobRecommendations[0]?.missingSkills || ['Docker', 'Kubernetes', 'AWS', 'Redis', 'CI/CD Pipelines'];

  // Build roadmap items
  const initialRoadmapItems: LearningRoadmapItem[] = rawMissingSkills.slice(0, 7).map((skill, index) => {
    const resource = RESOURCE_DIRECTORY[skill] || {
      title: `${skill} Documentation & Tutorial`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(skill)}`,
      effort: '~8-12 hours (Estimated)',
      exercise: `Build a practical hands-on demonstration repository showcasing core ${skill} concepts and publish to GitHub.`,
    };

    return {
      id: `roadmap-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      skillName: skill,
      category: index < 2 ? 'High-Impact Foundational' : 'Specialized Capability',
      priority: index < 2 ? 'High' : index < 4 ? 'Medium' : 'Low',
      whyItMatters: `Standard industry requirement for ${targetRoleName} positions. Demonstrating hands-on competence significantly improves hiring manager interview conversion.`,
      currentEvidence: 'Currently absent in parsed resume entities or projects.',
      practicalExercise: resource.exercise,
      estimatedEffort: resource.effort,
      resourceUrl: resource.url,
      resourceTitle: resource.title,
      status: 'planned',
    };
  });

  // Local storage persistence
  const [items, setItems] = useState<LearningRoadmapItem[]>(() => {
    try {
      const saved = localStorage.getItem('resumeai_learning_roadmap');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialRoadmapItems;
  });

  useEffect(() => {
    try {
      localStorage.setItem('resumeai_learning_roadmap', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const updateStatus = (id: string, status: 'planned' | 'in_progress' | 'completed') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const inProgressCount = items.filter((i) => i.status === 'in_progress').length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-200 space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Prioritized Learning Roadmap & Skill Bridge</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Target: {targetRoleName}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bridging verified skill gaps with reputable educational references, estimated effort, and practical projects.
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Overall Progress</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{progressPct}%</span>
            </div>
            <div className="w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-l border-slate-200 dark:border-slate-800 pl-3">
            <div>Completed: <strong className="text-emerald-600">{completedCount}</strong></div>
            <div>In Progress: <strong className="text-amber-600">{inProgressCount}</strong></div>
          </div>
        </div>
      </div>

      {/* Roadmap Items List */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          let priorityBadge = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900/50';
          if (item.priority === 'Medium') {
            priorityBadge = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/50';
          } else if (item.priority === 'Low') {
            priorityBadge = 'text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
          }

          return (
            <div
              key={item.id}
              className={`border rounded-2xl p-5 transition-all ${
                item.status === 'completed'
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40'
                  : item.status === 'in_progress'
                  ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40'
                  : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold text-slate-400">Step #{idx + 1}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {item.skillName}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${priorityBadge}`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.whyItMatters}
                  </p>
                </div>

                {/* Status Switcher Pills */}
                <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 text-xs">
                  <button
                    onClick={() => updateStatus(item.id, 'planned')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      item.status === 'planned'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Planned
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'in_progress')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      item.status === 'in_progress'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'text-slate-500 hover:text-amber-600'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(item.id, 'completed')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      item.status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-emerald-600'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Practical Exercise Box */}
              <div className="mt-3.5 pt-3.5 border-t border-slate-200 dark:border-slate-800/70 grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                <div className="md:col-span-8 space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Suggested Practical Project / Exercise:</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                    {item.practicalExercise}
                  </p>
                </div>

                <div className="md:col-span-4 flex flex-col justify-between items-start md:items-end gap-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.estimatedEffort}</span>
                  </span>

                  <a
                    href={item.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs"
                  >
                    <span>Official Guide</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
