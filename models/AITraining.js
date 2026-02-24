import mongoose from 'mongoose';

const aiTrainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: '' },
    fileSize: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    status: { type: String, enum: ['processed', 'processing', 'failed'], default: 'processing' },
  },
  { timestamps: true }
);

export const AITraining = mongoose.models.AITraining || mongoose.model('AITraining', aiTrainingSchema);
