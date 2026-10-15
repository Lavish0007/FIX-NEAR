import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { connectDB, getIsDbConnected } from './server/config/db';
import { seedDatabaseIfEmpty } from './server/config/seed';
import authRoutes from './server/routes/authRoutes';
import issueRoutes from './server/routes/issueRoutes';
import notificationRoutes from './server/routes/notificationRoutes';
import commentRoutes from './server/routes/commentRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support both documented locations while preserving process-level overrides.
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, 'server/.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint (Rule 38)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'FixNear API is running',
    database: getIsDbConnected() ? 'connected' : 'unavailable',
    timestamp: new Date().toISOString(),
  });
});

// Mount REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/comments', commentRoutes);

// Database initialization
async function startServer() {
  const isDbConnected = await connectDB();
  if (isDbConnected) {
    await seedDatabaseIfEmpty();
  }

  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Mount Vite dev middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FixNear server running on port ${PORT}`);
    if (isDbConnected) {
      console.log('MongoDB connected successfully');
    }
  });
}

startServer().catch((error: unknown) => {
  console.error(
    'Failed to start server:',
    error instanceof Error ? error.name : 'UnknownError'
  );
});
