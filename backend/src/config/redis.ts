import { createClient } from 'redis';

let redisClient: any = null;

export const connectRedis = async (): Promise<void> => {
  try {
    // Only try to connect if REDIS_URL is explicitly set
    if (!process.env['REDIS_URL']) {
      console.log('⚠️ No REDIS_URL set, skipping Redis connection');
      return;
    }
    
    const redisUrl = process.env['REDIS_URL'];
    
    // Clean up existing client if any
    if (redisClient) {
      try {
        await redisClient.quit();
      } catch (e) {
        // Ignore cleanup errors
      }
      redisClient = null;
    }
    
    redisClient = createClient({
      url: redisUrl,
    });

    // Remove any existing listeners to prevent duplicates
    redisClient.removeAllListeners();

    redisClient.on('error', (err: any) => {
      console.log('❌ Redis connection error:', err.message);
      // Don't let Redis errors crash the app
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    // Set a timeout for Redis connection
    const connectionPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Redis connection timeout')), 5000);
    });

    await Promise.race([connectionPromise, timeoutPromise]);
    
  } catch (error) {
    console.log('⚠️ Redis connection failed (optional for development):', error);
    // Redis is optional for development, so we don't exit
    redisClient = null;
  }
};

export const getRedisClient = () => redisClient;

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('Redis disconnected');
  }
};

// Utility functions for common Redis operations
export const setCache = async (key: string, value: any, ttl?: number): Promise<void> => {
  try {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    
    if (ttl) {
      await client.setEx(key, ttl, serializedValue);
    } else {
      await client.set(key, serializedValue);
    }
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    
    if (value) {
      return JSON.parse(value) as T;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Error deleting cache:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.flushDb();
    console.log('Cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
