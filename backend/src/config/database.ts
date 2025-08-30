import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env['MONGODB_URI'];
    
    if (!mongoURI) {
      console.log('⚠️ MONGODB_URI is not defined, skipping MongoDB connection');
      return;
    }

    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      if (isConnected) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
      }
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    console.log('⚠️ Continuing without MongoDB (development mode)');
    isConnected = false;
    // Don't exit the process for development
  }
};

export const isDBConnected = (): boolean => isConnected;

export const disconnectDB = async (): Promise<void> => {
  try {
    if (isConnected) {
      await mongoose.connection.close();
      isConnected = false;
      console.log('MongoDB disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};
