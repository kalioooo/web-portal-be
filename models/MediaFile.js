import mongoose from 'mongoose';

const mediaFileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, default: 0 },
    url: { type: String, default: '' },
    mimeType: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MediaFile = mongoose.models.MediaFile || mongoose.model('MediaFile', mediaFileSchema);
