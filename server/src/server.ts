import express from 'express';
import cors from 'cors';
import { apiV1Router } from './routes';
import { errorHandler } from './middlewares/error.middleware';

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Health endpoint
  app.get('/health', (req, res) => {
    return res.json({
      status: 'healthy',
      service: 'hubio-enterprise-backend',
      version: '1.0.0',
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  });

  // Mount API v1
  app.use('/api/v1', apiV1Router);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

if (require.main === module || process.env.HUBIO_START_SERVER === 'true') {
  const PORT = process.env.PORT || 5000;
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`[Hubio Enterprise Backend] REST API Server running on http://localhost:${PORT}`);
    console.log(`[Hubio Enterprise Backend] Healthcheck at http://localhost:${PORT}/health`);
  });
}
