export default async function handler(req: any, res: any) {
  try {
    const module = await import('../server.js');
    const app = module.default;
    return app(req, res);
  } catch (err: any) {
    console.error('Initialization error:', err);
    res.status(500).json({ 
      error: 'Initialization failed', 
      message: err.message, 
      stack: err.stack 
    });
  }
}
