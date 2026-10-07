import { spawn } from 'child_process';
import path from 'path';

export const runMLTask = async (task: string, payload: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const isWindows = process.platform === 'win32';
      // In production (Vercel), executing local Python may not work unless we bundle Python.
      // For local testing, we use the venv python.
      const pythonExec = isWindows 
        ? path.join(process.cwd(), 'venv', 'Scripts', 'python.exe')
        : 'python3'; // Fallback for Vercel/Linux if python is available
      
      const scriptPath = path.join(process.cwd(), 'server', 'ml_inference.py');
      
      const child = spawn(pythonExec, [scriptPath]);
      
      let dataOut = '';
      let errorOut = '';
      
      child.stdout.on('data', (data) => {
        dataOut += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        errorOut += data.toString();
      });
      
      child.on('close', (code) => {
        if (code !== 0) {
          console.warn(`ML Task failed (likely missing Python env in Vercel): ${errorOut}`);
          return resolve(null); // Fail gracefully, fallback to rule-based
        }
        
        try {
          const result = JSON.parse(dataOut.trim());
          if (result.error) {
            console.warn(`ML Script Error: ${result.error}`);
            resolve(null);
          } else {
            resolve(result);
          }
        } catch (e) {
          console.warn(`Failed to parse ML output: ${e}`);
          resolve(null);
        }
      });
      
      child.stdin.write(JSON.stringify({ task, ...payload }));
      child.stdin.end();
      
    } catch (e) {
      console.warn("Error running ML Task:", e);
      resolve(null); // Graceful fallback
    }
  });
};
