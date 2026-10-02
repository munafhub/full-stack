import express from 'express';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { authenticateToken, requireRole } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());

// Simple CORS middleware so the React/Vite frontend can call the API.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN || 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, requireRole('admin'), userRoutes); // RBAC rule
app.use('/api/tasks', authenticateToken, taskRoutes);

app.use(notFound);
app.use(errorHandler);
