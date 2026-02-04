import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes.js';

// Load environment variables from root .env
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', router);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 StyleSync AI Backend running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});
