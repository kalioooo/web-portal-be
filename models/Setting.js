import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'global' },
    portalName: { type: String, default: '' },
    adminEmail: { type: String, default: '' },
    emailNotifications: { type: Boolean, default: true },
    auditLogs: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
