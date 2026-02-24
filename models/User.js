import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Editor', 'Contributor', 'Viewer'], default: 'Viewer' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    joinDate: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
