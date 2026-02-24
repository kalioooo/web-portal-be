import { Router } from 'express';
import { Proposal } from '../models/Proposal.js';

export const proposalsRouter = Router();

proposalsRouter.get('/', async (req, res) => {
  try {
    const list = await Proposal.find().sort({ updatedAt: -1 }).lean();
    res.json(list.map((o) => ({ ...o, id: o._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

proposalsRouter.get('/:id', async (req, res) => {
  try {
    const doc = await Proposal.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Proposal not found' });
    res.json({ ...doc, id: doc._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

proposalsRouter.post('/', async (req, res) => {
  try {
    const doc = await Proposal.create(req.body);
    const o = doc.toObject();
    res.status(201).json({ ...o, id: o._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

proposalsRouter.patch('/:id', async (req, res) => {
  try {
    const doc = await Proposal.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Proposal not found' });
    res.json({ ...doc, id: doc._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

proposalsRouter.delete('/:id', async (req, res) => {
  try {
    const result = await Proposal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Proposal not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
