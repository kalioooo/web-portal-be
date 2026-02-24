import mongoose from 'mongoose';

const contentItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'Page' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    thumbnail: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ContentItem = mongoose.models.ContentItem || mongoose.model('ContentItem', contentItemSchema);
