import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local to ensure environment variables are available
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Redis from Environment Variables
// It automatically picks up UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// Wait, the user has KV_REST_API_URL and KV_REST_API_TOKEN.
// Redis.fromEnv() expects UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN by default.
// Let's pass the URL and Token explicitly to be safe.

let redisClient: Redis | null = null;

try {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (url && token) {
    redisClient = new Redis({
      url: url,
      token: token,
    });
    console.log('✅ Redis client initialized');
  } else {
    console.warn('⚠️ Redis configuration missing. Redis caching is disabled.');
  }
} catch (error) {
  console.warn('⚠️ Redis client failed to initialize. Falling back to DB only.', error);
}

/**
 * Safely get an item from Redis
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get<T>(key);
    return data;
  } catch (error) {
    console.warn(`Redis GET error for key ${key}:`, error);
    return null;
  }
}

/**
 * Safely set an item in Redis
 * @param key The cache key
 * @param value The value to store
 * @param ex Expiration in seconds (default 3600s / 1 hour)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setCached(key: string, value: any, ex: number = 3600): Promise<void> {
  if (!redisClient) return;
  try {
    await redisClient.set(key, value, { ex });
  } catch (error) {
    console.warn(`Redis SET error for key ${key}:`, error);
  }
}

/**
 * Safely delete an item from Redis
 */
export async function delCached(key: string): Promise<void> {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.warn(`Redis DEL error for key ${key}:`, error);
  }
}

export default redisClient;
