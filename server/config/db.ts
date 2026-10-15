import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler
 * Connects to MongoDB Atlas using MONGO_URI from environment variables.
 * If MONGO_URI is missing or Atlas is unreachable, the app can serve its demo
 * preview, but account registration and login require persistent storage.
 */
let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn(
      'MongoDB is not configured. Account registration and sign-in are unavailable until MONGO_URI is set.'
    );
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
  } catch (error: unknown) {
    console.error(
      'MongoDB connection failed:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    console.error('Check the MONGO_URI value, network access rules, and database credentials.');
    isConnected = false;
    return false;
  }
}

export function getIsDbConnected(): boolean {
  return isConnected;
}
