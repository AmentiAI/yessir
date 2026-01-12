import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/business.js';
import siteRoutes from './routes/site.js';
import adminRoutes from './routes/admin.js';
import { initDatabase } from './db/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Neon DB connection
export const sql = neon(process.env.DATABASE_URL);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/site', siteRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SiteForge Pro API', 
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      business: '/api/business',
      site: '/api/site',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'NOT_FOUND',
    code: 'NOT_FOUND',
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: ['POST /api/auth/signup', 'POST /api/auth/login'],
      business: ['POST /api/business/setup', 'GET /api/business/my-business'],
      site: ['POST /api/site/generate', 'GET /api/site/content'],
      admin: ['GET /api/admin/dashboard', 'PUT /api/admin/content', 'POST /api/admin/publish']
    }
  });
});

// Initialize database and start server
(async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();