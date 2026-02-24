import { Router } from 'express';
import { MasterDataItem } from '../models/MasterDataItem.js';

export const masterDataRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

masterDataRouter.get('/', async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const list = await MasterDataItem.find(filter).sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

masterDataRouter.get('/:id', async (req, res) => {
  try {
    const doc = await MasterDataItem.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Master data item not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

masterDataRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await MasterDataItem.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

masterDataRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await MasterDataItem.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Master data item not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

masterDataRouter.delete('/:id', async (req, res) => {
  try {
    const result = await MasterDataItem.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Master data item not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
