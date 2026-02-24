import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: '' },
    author: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    content: { type: String, default: '' },
    tags: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    publishDate: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
