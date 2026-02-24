import { Router } from 'express';
import { User } from '../models/User.js';

export const usersRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

usersRouter.get('/', async (req, res) => {
  try {
    const list = await User.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

usersRouter.get('/:id', async (req, res) => {
  try {
    const doc = await User.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'User not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

usersRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await User.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

usersRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await User.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'User not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

usersRouter.delete('/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
