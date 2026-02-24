import { Router } from 'express';
import { PortalLink } from '../models/PortalLink.js';

export const portalLinksRouter = Router();

function toResponse(o) {
  return { ...o, id: o._id.toString() };
}

portalLinksRouter.get('/', async (req, res) => {
  try {
    const list = await PortalLink.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(toResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

portalLinksRouter.get('/:id', async (req, res) => {
  try {
    const doc = await PortalLink.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Portal link not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

portalLinksRouter.post('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await PortalLink.create(body);
    const o = doc.toObject();
    res.status(201).json(toResponse(o));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

portalLinksRouter.patch('/:id', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await PortalLink.findByIdAndUpdate(req.params.id, { $set: body }, { new: true }).lean();
    if (!doc) return res.status(404).json({ error: 'Portal link not found' });
    res.json(toResponse(doc));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

portalLinksRouter.delete('/:id', async (req, res) => {
  try {
    const result = await PortalLink.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Portal link not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
