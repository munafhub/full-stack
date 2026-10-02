import express, { Router } from 'express';
import taskRoutes from './routes/tasks.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import { authenticateToken, requireRole } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(express.json());

// ---------------------------------------------------------------------------
// CORS
// FRONTEND_ORIGIN can be one origin, a comma separated list, or "*".
// Local dev and the deployed Vercel frontend are always allowed.
// ---------------------------------------------------------------------------
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://full-stack-teal-seven.vercel.app',
];

const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '');

export function getAllowedOrigins() {
  const fromEnv = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
}

app.use((req, res, next) => {
  const allowed = getAllowedOrigins();
  const origin = req.headers.origin;

  if (allowed.includes('*')) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin && allowed.includes(normalizeOrigin(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// The API lives under /api (documented path). The same router is also mounted at
// the root so a client configured WITHOUT the /api suffix (e.g. VITE_API_URL set
// to just the Railway domain) still works instead of returning
// "Route POST /auth/login not found".
// ---------------------------------------------------------------------------
const api = Router();
api.get('/health', (req, res) => res.json({ status: 'ok' }));
api.use('/auth', authRoutes);
api.use('/users', authenticateToken, requireRole('admin'), userRoutes); // RBAC rule
api.use('/tasks', authenticateToken, taskRoutes);

app.get('/', (req, res) => res.json({ name: 'Tasks API', status: 'ok', docs: '/api/health' }));
app.use('/api', api);
app.use('/', api);

app.use(notFound);
app.use(errorHandler);
