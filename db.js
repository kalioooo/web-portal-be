import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/web-portal';

export async function connectDb() {
  await mongoose.connect(MONGODB_URI);
  console.log('[db] Connected to MongoDB');
}
