import { createClient } from 'redis';

let redisClient: any = null;

export const connectRedis = async (): Promise<void> => {
  try {
    const redisUrl = process.env['REDIS_URL'] || 'redis://localhost:6379';
    
    redisClient = createClient({
      url: redisUrl,
    });

    redisClient.on('error', (err: any) => {
      console.log('❌ Redis connection error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    await redisClient.connect();
    
  } catch (error) {
    console.log('⚠️ Redis connection failed (optional for development):', error);
    // Redis is optional for development, so we don't exit
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
