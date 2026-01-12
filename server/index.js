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