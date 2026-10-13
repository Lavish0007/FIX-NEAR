import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler
 * Connects to MongoDB Atlas using MONGO_URI from environment variables.
 * If MONGO_URI is missing or Atlas is unreachable, provides clear beginner-friendly
 * feedback and activates in-memory fallback so the application keeps running smoothly.
 */
let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log('----------------------------------------------------');
    console.log('FixNear Backend: No MONGO_URI provided in .env');
    console.log('Running in local memory-backed mode for instant preview.');
    console.log('To connect MongoDB Atlas, set MONGO_URI in your server/.env');
    console.log('----------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('----------------------------------------------------');
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    console.log('----------------------------------------------------');
    return true;
  } catch (error: any) {
    console.error('----------------------------------------------------');
    console.error('MongoDB Atlas connection failed:', error.message);
    console.error('Check your IP whitelist (0.0.0.0/0) and credentials in MONGO_URI.');
    console.error('Activating local memory store so you can test FixNear right now.');
    console.error('----------------------------------------------------');
    isConnected = false;
    return false;
  }
}

export function getIsDbConnected(): boolean {
  return isConnected;
}
