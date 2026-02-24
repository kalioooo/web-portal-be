import mongoose from 'mongoose';

const portalLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const PortalLink = mongoose.models.PortalLink || mongoose.model('PortalLink', portalLinkSchema);
