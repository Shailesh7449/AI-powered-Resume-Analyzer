import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  ExternalLink,
  Target,
  Sparkles,
  RefreshCw,
  Building2,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Globe
} from 'lucide-react';
import { RealJobListing } from '../types';
import { searchRealJobs } from '../services/api';

interface RealJobSearchViewProps {
  initialQuery?: string;
  onMatchWithJob: (jobText: string, jobTitle: string) => void;
}

export function RealJobSearchView({ initialQuery = '', onMatchWithJob }: RealJobSearchViewProps) {
  const [roleQuery, setRoleQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<RealJobListing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('live');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedJobForDetail, setSelectedJobForDetail] = useState<RealJobListing | null>(null);

  const fetchJobs = async (targetPage = 1) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await searchRealJobs({
        role: roleQuery.trim() || undefined,
        location: locationQuery.trim() || undefined,
        remote: remoteOnly,
        page: targetPage,
      });

      if (res && res.jobs) {
        setJobs(res.jobs);
        setTotalCount(res.totalCount || res.jobs.length);
        setApiStatus(res.apiStatus || 'live');
        setPage(targetPage);
      }
    } catch (err: any) {
      console.warn('Job search error:', err);
      setErrorMsg('Failed to fetch job listings. Please check your query or network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [remoteOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-colors duration-200 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Real Live Job Search & Application Discovery</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Verified Open Postings
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover active software engineering, AI, cloud, and tech opportunities with direct application URLs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <Globe className="w-3.5 h-3.5 text-emerald-500" />
          <span>Source: Arbeitnow API ({apiStatus === 'live' ? 'Live Stream' : 'Cached Sync'})</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        <div className="md:col-span-5 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={roleQuery}
            onChange={(e) => setRoleQuery(e.target.value)}
            placeholder="Role, skill, or keyword (e.g. React, Python, DevOps)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-4 relative flex items-center">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Location or City (optional)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-3 flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium shrink-0">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-0"
            />
            <span>Remote Only</span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 text-xs"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
          <p className="text-xs">Querying open job boards and parsing active requirements...</p>
        </div>
      )}

      {/* Job list */}
      {!isLoading && jobs.length === 0 && (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="font-semibold text-sm">No job postings found matching your query.</p>
          <p className="text-xs mt-1">Try broadening your search term or unchecking the "Remote Only" filter.</p>
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Showing {jobs.length} open opportunities</span>
            <span>Page {page}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {job.title}
                    </h3>
                    {job.remote && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Remote
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    {job.postedDate && (
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {job.postedDate}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.tags.slice(0, 6).map((t, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 md:flex-col sm:items-stretch">
                  <button
                    onClick={() => {
                      const textForMatch = `${job.title} at ${job.companyName}\n\nRequired Skills: ${job.tags.join(', ')}\n\nJob Description:\n${(job as any).fullDescription || job.description}`;
                      onMatchWithJob(textForMatch, job.title);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Match with Resume</span>
                  </button>

                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Apply on Site</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => fetchJobs(Math.max(1, page - 1))}
              disabled={page <= 1 || isLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Previous Page
            </button>
            <span className="text-slate-500 font-medium">Page {page}</span>
            <button
              onClick={() => fetchJobs(page + 1)}
              disabled={jobs.length < 10 || isLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
