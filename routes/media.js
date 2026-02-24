import { Router } from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync, unlinkSync } from 'fs';
import { MediaFile } from '../models/MediaFile.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = process.env.VERCEL
  ? join('/tmp', 'uploads', 'media')
  : join(__dirname, '..', 'uploads', 'media');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = Date.now() + '-' + (file.originalname || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safe);
  },
});
const upload = multer({ storage });

export const mediaRouter = Router();

function toResponse(o) {
  const url = o.url ? `/uploads/media/${o.url.split(/[/\\]/).pop()}` : '';
  return { ...o, id: o._id.toString(), url: url || o.url };
}

mediaRouter.get('/', async (req, res) => {
  try {
    const list = await MediaFile.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mediaRouter.get('/:id', async (req, res) => {
  try {
    const doc = await MediaFile.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Media file not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mediaRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const doc = await MediaFile.create({
      name: req.file.originalname || req.file.filename,
      size: req.file.size,
      url: req.file.path,
      mimeType: req.file.mimetype || '',
    });
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

mediaRouter.delete('/:id', async (req, res) => {
  try {
    const doc = await MediaFile.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Media file not found' });
    if (doc.url && existsSync(doc.url)) {
      try { unlinkSync(doc.url); } catch (_) {}
    }
    await MediaFile.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
