import { Router } from 'express';
import { Blog } from '../models/Blog.js';

export const blogsRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

blogsRouter.get('/', async (req, res) => {
  try {
    const list = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

blogsRouter.get('/:id', async (req, res) => {
  try {
    const doc = await Blog.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Blog not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

blogsRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Blog.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

blogsRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Blog.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Blog not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

blogsRouter.delete('/:id', async (req, res) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Blog not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
