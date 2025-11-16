/**
 * Cache Service
 * Provides high-level caching utilities with Redis
 */

import { redis, isRedisReady } from '../lib/redis.js';

/**
 * Cache TTL constants (in seconds)
 */
export const CacheTTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  FIFTEEN_MINUTES: 900,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  SIX_HOURS: 21600,
  TWELVE_HOURS: 43200,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
} as const;

/**
 * Cache key prefixes for different data types
 */
export const CachePrefix = {
  SITEMAP: 'sitemap',
  POST: 'post',
  POST_LIST: 'post:list',
  CATEGORY: 'category',
  CATEGORY_LIST: 'category:list',
  TAG: 'tag',
  TAG_LIST: 'tag:list',
  USER: 'user',
  USER_STATS: 'user:stats',
  EVENT: 'event',
  EVENT_LIST: 'event:list',
  MEDIA: 'media',
} as const;

export class CacheService {
  private static isDev = process.env.NODE_ENV === 'development';

  /**
   * Get value from cache
   */
  static async get<T>(key: string): Promise<T | null> {
    if (!isRedisReady()) {
      if (this.isDev) console.warn('⚠️  Cache: Redis not ready, skipping cache get');
      return null;
    }

    try {
      const cached = await redis.get(key);
      if (!cached) return null;

      return JSON.parse(cached) as T;
    } catch (error) {
      console.error(`❌ Cache get error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  static async set(key: string, value: any, ttl: number = CacheTTL.FIVE_MINUTES): Promise<boolean> {
    if (!isRedisReady()) {
      if (this.isDev) console.warn('⚠️  Cache: Redis not ready, skipping cache set');
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      await redis.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      console.error(`❌ Cache set error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Delete specific key from cache
   */
  static async delete(key: string): Promise<boolean> {
    if (!isRedisReady()) {
      return false;
    }

    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`❌ Cache delete error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Delete all keys matching a pattern
   */
  static async deletePattern(pattern: string): Promise<number> {
    if (!isRedisReady()) {
      return 0;
    }

    try {
      const keys = await redis.keys(pattern);
      if (keys.length === 0) return 0;

      await redis.del(...keys);
      return keys.length;
    } catch (error) {
      console.error(`❌ Cache deletePattern error for pattern "${pattern}":`, error);
      return 0;
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<boolean> {
    if (!isRedisReady()) {
      return false;
    }

    try {
      await redis.flushdb();
      if (this.isDev) console.log('✅ Cache: All cache cleared');
      return true;
    } catch (error) {
      console.error('❌ Cache clear error:', error);
      return false;
    }
  }

  /**
   * Check if key exists in cache
   */
  static async exists(key: string): Promise<boolean> {
    if (!isRedisReady()) {
      return false;
    }

    try {
      const exists = await redis.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(`❌ Cache exists error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  static async ttl(key: string): Promise<number> {
    if (!isRedisReady()) {
      return -2;
    }

    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error(`❌ Cache TTL error for key "${key}":`, error);
      return -2;
    }
  }

  /**
   * Wrapper function: Get from cache or execute function and cache result
   */
  static async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number = CacheTTL.FIVE_MINUTES
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      if (this.isDev) console.log(`✅ Cache HIT: ${key}`);
      return cached;
    }

    // Cache miss - execute function
    if (this.isDev) console.log(`⚠️  Cache MISS: ${key}`);
    const result = await fetchFunction();

    // Store in cache for next time
    await this.set(key, result, ttl);

    return result;
  }

  /**
   * Build cache key with prefix
   */
  static buildKey(prefix: string, ...parts: (string | number)[]): string {
    return [prefix, ...parts].join(':');
  }

  /**
   * Invalidate cache for specific entity type
   * Example: invalidateEntity('post', '123') deletes post:123 and all post:list:*
   */
  static async invalidateEntity(prefix: string, id?: string | number): Promise<void> {
    if (!isRedisReady()) {
      return;
    }

    try {
      // Delete specific item cache
      if (id) {
        await this.delete(`${prefix}:${id}`);
      }

      // Delete list caches (with pagination)
      await this.deletePattern(`${prefix}:list:*`);

      if (this.isDev) {
        console.log(`✅ Cache invalidated for entity: ${prefix}${id ? `:${id}` : ''}`);
      }
    } catch (error) {
      console.error(`❌ Cache invalidation error for ${prefix}:`, error);
    }
  }

  /**
   * Get cache statistics
   * Returns detailed cache stats including memory usage, key counts by prefix
   */
  static async getStats(): Promise<{
    connected: boolean;
    memory?: string;
    totalKeys?: number;
    keysByPrefix?: Record<string, number>;
  }> {
    if (!isRedisReady()) {
      return { connected: false };
    }

    try {
      const info = await redis.info('memory');
      const dbSize = await redis.dbsize();
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memory = memoryMatch?.[1]?.trim() || 'unknown';

      // Count keys by prefix
      const keysByPrefix: Record<string, number> = {};

      // Get all cache prefixes
      const prefixes = Object.values(CachePrefix);

      for (const prefix of prefixes) {
        const keys = await redis.keys(`${prefix}*`);
        keysByPrefix[prefix] = keys.length;
      }

      return {
        connected: true,
        memory,
        totalKeys: dbSize,
        keysByPrefix,
      };
    } catch (error) {
      console.error('❌ Cache stats error:', error);
      return { connected: false };
    }
  }
}
