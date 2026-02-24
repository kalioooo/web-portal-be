import { Router } from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { AITraining } from '../models/AITraining.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = process.env.VERCEL
  ? join('/tmp', 'uploads', 'ai-training')
  : join(__dirname, '..', 'uploads', 'ai-training');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + (file.originalname || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safe);
  },
});
const upload = multer({ storage });

export const aiTrainingRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return bytes + ' B';
}

aiTrainingRouter.get('/', async (req, res) => {
  try {
    const list = await AITraining.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

aiTrainingRouter.get('/:id', async (req, res) => {
  try {
    const doc = await AITraining.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'AI training record not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

aiTrainingRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    const body = { ...(req.body || {}) };
    delete body.id;
    delete body._id;
    if (req.file) {
      body.fileUrl = req.file.path;
      body.fileSize = formatSize(req.file.size);
      body.status = 'processed';
    }
    if (!body.title) body.title = req.file?.originalname || 'Untitled';
    const doc = await AITraining.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

aiTrainingRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    delete body.fileUrl;
    const doc = await AITraining.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'AI training record not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

aiTrainingRouter.delete('/:id', async (req, res) => {
  try {
    const doc = await AITraining.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'AI training record not found' });
    if (doc.fileUrl && existsSync(doc.fileUrl)) {
      try { unlinkSync(doc.fileUrl); } catch (_) {}
    }
    await AITraining.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
