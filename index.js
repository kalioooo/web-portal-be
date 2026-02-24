import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDb } from './db.js';
import { projectsRouter } from './routes/projects.js';
import { proposalsRouter } from './routes/proposals.js';
import { usersRouter } from './routes/users.js';
import { portalLinksRouter } from './routes/portalLinks.js';
import { pagesRouter } from './routes/pages.js';
import { masterDataRouter } from './routes/masterData.js';
import { contentRouter } from './routes/content.js';
import { blogsRouter } from './routes/blogs.js';
import { settingsRouter } from './routes/settings.js';
import { mediaRouter } from './routes/media.js';
import { aiTrainingRouter } from './routes/aiTraining.js';
import { analyticsRouter } from './routes/analytics.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const openapiPath = join(__dirname, 'openapi.json');
const uploadsPath = join(__dirname, 'uploads');

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use('/uploads', express.static(uploadsPath));

// Read spec on each request so edits to openapi.json show up after a browser refresh (no server restart)
app.get('/api-docs.json', (req, res) => {
  try {
    const spec = JSON.parse(readFileSync(openapiPath, 'utf8'));
    res.setHeader('Content-Type', 'application/json');
    res.json(spec);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load OpenAPI spec', message: err.message });
  }
});
// Serve Swagger UI from CDN (avoids "Resolver error / reading 'api'" from bundled swagger-ui-express)
app.get('/api-docs', (req, res) => res.sendFile(join(__dirname, 'public', 'api-docs.html')));

app.get('/health', (req, res) => res.json({ ok: true, message: 'web-portal-backend' }));

app.use('/api/projects', projectsRouter);
app.use('/api/proposals', proposalsRouter);
app.use('/api/users', usersRouter);
app.use('/api/portal-links', portalLinksRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/master-data', masterDataRouter);
app.use('/api/content', contentRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/media', mediaRouter);
app.use('/api/ai-training', aiTrainingRouter);
app.use('/api/analytics', analyticsRouter);

// Return JSON (not HTML) when request body is invalid JSON (e.g. ""string"" from Swagger placeholder)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && (err.message || '').includes('JSON')) {
    res.status(400).json({
      error: 'Invalid JSON in request body',
      message: 'Request body must be valid JSON. Example: {"title":"My Project","slug":"my-project","status":"draft"}'
    });
    return;
  }
  next(err);
});

// Listen immediately so /health and /api-docs work even before MongoDB is ready
app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
  console.log(`[server] API docs: http://localhost:${PORT}/api-docs`);
  connectDb()
    .then(() => console.log('[db] Connected to MongoDB'))
    .catch((err) => console.error('[db] MongoDB not connected:', err.message));
});
