import { Redis } from '@upstash/redis';

// Initialize Redis from Environment Variables
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});
