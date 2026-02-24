import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
  },
  { timestamps: true }
);

pageSchema.index({ slug: 1 }, { unique: true });

export const Page = mongoose.models.Page || mongoose.model('Page', pageSchema);
