import mongoose from 'mongoose';

const clientInfoSchema = new mongoose.Schema(
  {
    paymentVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    location: { type: String, default: '' },
    lastActiveAt: { type: String, default: '' },
    jobsPosted: { type: Number, default: 0 },
    hireRatePercent: { type: Number, default: 0 },
    openJobs: { type: Number, default: 0 },
    totalSpent: { type: String, default: '$0' },
    hiresCount: { type: Number, default: 0 },
    activeHires: { type: Number, default: 0 },
    memberSince: { type: String, default: '' },
  },
  { _id: false }
);

const proposalHistoryItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    at: { type: String, required: true },
    type: { type: String, enum: ['created', 'status_change', 'client_updated', 'note', 'sent'], required: true },
    fromStatus: { type: String, default: '' },
    toStatus: { type: String, default: '' },
    note: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const proposalSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    clientName: { type: String, default: '' },
    jobUrl: { type: String, default: '' },
    budget: { type: String, default: '' },
    jobPostedAt: { type: String, required: true },
    proposalSentAt: { type: String, default: null },
    status: {
      type: String,
      enum: ['draft', 'preparing', 'submitted', 'viewed', 'interview', 'offered', 'hired', 'declined', 'withdrawn'],
      default: 'draft',
    },
    notes: { type: String, default: '' },
    proposedRate: { type: String, default: '' },
    client: { type: clientInfoSchema, default: null },
    history: [proposalHistoryItemSchema],
  },
  { timestamps: true }
);

proposalSchema.index({ status: 1 });

export const Proposal = mongoose.models.Proposal || mongoose.model('Proposal', proposalSchema);

