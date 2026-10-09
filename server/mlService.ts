import { spawn } from 'child_process';
import path from 'path';
import { extractAllTaxonomySkills, lookupCanonicalSkill } from './taxonomy.js';
import { recommendJobRoles } from './jobRecommender.js';
import { segmentResumeSections } from './parser.js';

let pythonAvailable: boolean | null = null;

function runNodeFallback(task: string, payload: any): any {
  if (task === 'classify_resume') {
    const text = typeof payload?.text === 'string' ? payload.text : '';
    if (!text.trim()) {
      return { category: 'Software Engineer' };
    }
    try {
      const parsed = segmentResumeSections(text);
      const { matchedSkills } = extractAllTaxonomySkills(text);
      const recommendations = recommendJobRoles(parsed, matchedSkills);
      if (recommendations && recommendations.length > 0) {
        return { category: recommendations[0].roleTitle };
      }
    } catch {
      // fallback to default
    }
    return { category: 'Software Engineer' };
  }

  if (task === 'extract_skills') {
    const phrases: string[] = Array.isArray(payload?.phrases) ? payload.phrases : [];
    const extractedSet = new Set<string>();

    for (const phrase of phrases) {
      if (typeof phrase === 'string' && phrase.length > 1) {
        const canonical = lookupCanonicalSkill(phrase);
        if (canonical) {
          extractedSet.add(canonical.name);
        }
      }
    }
    return { skills: Array.from(extractedSet) };
  }

  return null;
}

export const runMLTask = async (task: string, payload: any): Promise<any> => {
  // If we already detected Python/joblib is unavailable in this environment, use instant Node fallback
  if (pythonAvailable === false) {
    return runNodeFallback(task, payload);
  }

  return new Promise((resolve) => {
    let timeoutId: NodeJS.Timeout | undefined;
    let child: any;

    try {
      const isWindows = process.platform === 'win32';
      const pythonExec = isWindows 
        ? path.join(process.cwd(), 'venv', 'Scripts', 'python.exe')
        : 'python3'; 
      
      const scriptPath = path.join(process.cwd(), 'server', 'ml_inference.py');
      
      child = spawn(pythonExec, [scriptPath]);
      
      let dataOut = '';
      let errorOut = '';
      
      child.stdout.on('data', (data: any) => {
        dataOut += data.toString();
      });
      
      child.stderr.on('data', (data: any) => {
        errorOut += data.toString();
      });
      
      child.on('close', (code: number) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          pythonAvailable = false;
          return resolve(runNodeFallback(task, payload));
        }
        
        try {
          const result = JSON.parse(dataOut.trim());
          if (result.error) {
            pythonAvailable = false;
            resolve(runNodeFallback(task, payload));
          } else {
            pythonAvailable = true;
            resolve(result);
          }
        } catch {
          pythonAvailable = false;
          resolve(runNodeFallback(task, payload));
        }
      });

      child.on('error', () => {
        clearTimeout(timeoutId);
        pythonAvailable = false;
        resolve(runNodeFallback(task, payload));
      });
      
      child.stdin.write(JSON.stringify({ task, ...payload }));
      child.stdin.end();

      timeoutId = setTimeout(() => {
        if (child && !child.killed) {
          child.kill('SIGKILL');
        }
        pythonAvailable = false;
        resolve(runNodeFallback(task, payload));
      }, 3000);
      
    } catch {
      if (timeoutId) clearTimeout(timeoutId);
      if (child && !child.killed) child.kill('SIGKILL');
      pythonAvailable = false;
      resolve(runNodeFallback(task, payload)); 
    }
  });
};
