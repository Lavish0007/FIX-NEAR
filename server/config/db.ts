import mongoose from 'mongoose';

/**
 * MongoDB Connection Handler
 * Connects to MongoDB Atlas using MONGO_URI from environment variables.
 * If MONGO_URI is missing or unreachable, automatically spins up an in-memory
 * MongoDB instance so that signup, login, and civic issue tracking work seamlessly.
 */
let isConnected = false;
let memoryServer: { getUri: () => string; stop: () => Promise<boolean> } | null = null;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGO_URI?.trim();

  // If a non-placeholder MONGO_URI is supplied, try connecting to it first
  if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log('----------------------------------------------------');
      console.log(`MongoDB Atlas connected successfully: ${conn.connection.host}`);
      console.log('----------------------------------------------------');
      return true;
    } catch (error: unknown) {
      console.error(
        'MongoDB Atlas connection failed:',
        error instanceof Error ? error.name : 'UnknownError'
      );
      console.log('Falling back to local in-memory MongoDB for development...');
    }
  }

  // Fallback: Start an in-memory MongoDB server for instant local dev & demo preview
  try {
    console.log('Initializing in-memory MongoDB for local development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'fixnear' },
    });
    const memoryUri = memoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    isConnected = true;
    console.log('----------------------------------------------------');
    console.log(`In-memory MongoDB connected successfully: ${conn.connection.host}`);
    console.log('Account registration, sign-in, and issue tracking are now active.');
    console.log('----------------------------------------------------');
    return true;
  } catch (error: unknown) {
    console.error(
      'In-memory MongoDB startup failed:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    isConnected = false;
    return false;
  }
}

export function getIsDbConnected(): boolean {
  return isConnected;
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
  isConnected = false;
}

