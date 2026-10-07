import { spawn } from 'child_process';
import path from 'path';

export const runMLTask = async (task: string, payload: any): Promise<any> => {
  return new Promise((resolve) => {
    let timeoutId: NodeJS.Timeout;
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
          console.warn(`ML Task failed (likely missing Python env in Vercel): ${errorOut}`);
          return resolve(null);
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

      // Implement strict 3.5s timeout to prevent Vercel 504 Gateway Timeout
      timeoutId = setTimeout(() => {
        console.warn(`ML Task timeout exceeded (3500ms). Gracefully failing to prevent 504 error.`);
        if (child && !child.killed) {
          child.kill('SIGKILL');
        }
        resolve(null);
      }, 3500);
      
    } catch (e) {
      console.warn("Error running ML Task:", e);
      if (timeoutId) clearTimeout(timeoutId);
      if (child && !child.killed) child.kill('SIGKILL');
      resolve(null); 
    }
  });
};
