import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/oceanguard';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected ');
  } catch (error) {
    console.error('MongoDB  error:', error);
    process.exit(1);
  }
};

