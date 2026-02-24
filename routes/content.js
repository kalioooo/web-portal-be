import { Router } from 'express';
import { ContentItem } from '../models/ContentItem.js';

export const contentRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

contentRouter.get('/', async (req, res) => {
  try {
    const list = await ContentItem.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.get('/:id', async (req, res) => {
  try {
    const doc = await ContentItem.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Content item not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

contentRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await ContentItem.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

contentRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await ContentItem.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Content item not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

contentRouter.delete('/:id', async (req, res) => {
  try {
    const result = await ContentItem.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Content item not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
