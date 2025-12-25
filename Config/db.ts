import mongoose from 'mongoose';
import { getSecret } from './secretManager';

const connectDB = async () => {
  try {
    const MONGO_URI = await getSecret('MONGO_URI')
    await mongoose.connect(MONGO_URI as string);
    console.log('MongoDB Connected succesfully');
  } catch (error) {
    console.error('MongoDB connection   Error', error);
    process.exit(1);
  }
};

export default connectDB;
