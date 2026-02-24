import mongoose from 'mongoose';

const types = ['tech_stack', 'category', 'tag', 'architecture', 'role', 'hosting', 'methodology', 'industry'];

const masterDataItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: types, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

masterDataItemSchema.index({ type: 1 });

export const MasterDataItem = mongoose.models.MasterDataItem || mongoose.model('MasterDataItem', masterDataItemSchema);
