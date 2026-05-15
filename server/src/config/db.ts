import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Disable buffering so we see errors immediately
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${(error as Error).message}`);
    // Don't exit process in dev mode to allow for retries or debugging
    // process.exit(1); 
  }
};

export default connectDB;
