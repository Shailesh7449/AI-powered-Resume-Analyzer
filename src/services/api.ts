import { AnalysisResponse, SampleItem } from '../types';

export async function uploadResumeFile(file: File): Promise<{
  filename: string;
  fileSize: number;
  charCount: number;
  extractedText: string;
}> {
  const formData = new FormData();
  formData.append('resume', file);

  const res = await fetch('/api/resume/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload and parse resume file.');
  }

  return data;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string,
  weights?: any
): Promise<AnalysisResponse> {
  const res = await fetch('/api/resume/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resumeText,
      jobDescription: jobDescription || undefined,
      weights,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.details || 'Failed to complete resume analysis.');
  }

  return data;
}

export async function fetchSamples(): Promise<{
  resumes: SampleItem[];
  jobs: SampleItem[];
}> {
  const res = await fetch('/api/samples');
  if (!res.ok) throw new Error('Failed to fetch sample data');
  return res.json();
}

export async function fetchAcademicBenchmarks(): Promise<any> {
  const res = await fetch('/api/academic/benchmarks');
  if (!res.ok) throw new Error('Failed to fetch benchmark evaluation');
  return res.json();
}

export async function fetchHealth(): Promise<any> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}
