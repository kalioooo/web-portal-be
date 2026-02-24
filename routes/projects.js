import { Router } from 'express';
import { Project } from '../models/Project.js';

export const projectsRouter = Router();

projectsRouter.get('/', async (req, res) => {
  try {
    const list = await Project.find().sort({ createdAt: -1 }).lean();
    res.json(list.map((o) => ({ ...o, id: o._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

projectsRouter.get('/:id', async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Project not found' });
    res.json({ ...doc, id: doc._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

projectsRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Project.create(body);
    const o = doc.toObject();
    res.status(201).json({ ...o, id: o._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

projectsRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Project.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Project not found' });
    res.json({ ...doc, id: doc._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

projectsRouter.delete('/:id', async (req, res) => {
  try {
    const result = await Project.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Project not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
