import { Router } from 'express';
import { Setting } from '../models/Setting.js';

const SETTINGS_ID = 'global';

export const settingsRouter = Router();

settingsRouter.get('/', async (req, res) => {
  try {
    let doc = await Setting.findById(SETTINGS_ID).lean();
    if (!doc) {
      await Setting.create({ _id: SETTINGS_ID });
      doc = await Setting.findById(SETTINGS_ID).lean();
    }
    res.json({ id: doc._id, ...doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

settingsRouter.patch('/', async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.id;
    delete body._id;
    const doc = await Setting.findByIdAndUpdate(
      SETTINGS_ID,
      { $set: body },
      { new: true, upsert: true }
    ).lean();
    res.json({ id: doc._id, ...doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
