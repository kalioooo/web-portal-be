import { Router } from 'express';
import { Page } from '../models/Page.js';

export const pagesRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

pagesRouter.get('/', async (req, res) => {
  try {
    const list = await Page.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

pagesRouter.get('/:id', async (req, res) => {
  try {
    const doc = await Page.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Page not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

pagesRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Page.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

pagesRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Page.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Page not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

pagesRouter.delete('/:id', async (req, res) => {
  try {
    const result = await Page.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Page not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
