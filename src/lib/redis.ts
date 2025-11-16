/**
 * Redis Client Configuration
 * Handles Redis connection and provides singleton instance
 */

import { Redis } from 'ioredis';

class RedisClient {
  private static instance: Redis | null = null;
  private static isConnected: boolean = false;

  /**
   * Get Redis instance (singleton pattern)
   */
  static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB || '0'),
        retryStrategy: (times: number) => {
          // Reconnect after
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true, // Don't connect immediately
      });

      const isDev = process.env.NODE_ENV === 'development';

      // Connection event handlers
      this.instance.on('connect', () => {
        if (isDev) console.log('✅ Redis: Connecting...');
      });

      this.instance.on('ready', () => {
        this.isConnected = true;
        console.log('✅ Redis: Connected successfully');
      });

      this.instance.on('error', (error: Error) => {
        this.isConnected = false;
        console.error('❌ Redis Error:', error.message);
      });

      this.instance.on('close', () => {
        this.isConnected = false;
        if (isDev) console.log('⚠️  Redis: Connection closed');
      });

      this.instance.on('reconnecting', () => {
        if (isDev) console.log('🔄 Redis: Reconnecting...');
      });
    }

    return this.instance;
  }

  /**
   * Connect to Redis
   */
  static async connect(): Promise<void> {
    const instance = this.getInstance();
    const isDev = process.env.NODE_ENV === 'development';

    if (!this.isConnected) {
      try {
        await instance.connect();
        if (isDev) console.log('✅ Redis: Connection established');
      } catch (error) {
        console.error('❌ Redis: Failed to connect:', error);
        throw error;
      }
    }
  }

  /**
   * Disconnect from Redis
   */
  static async disconnect(): Promise<void> {
    const isDev = process.env.NODE_ENV === 'development';

    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
      this.isConnected = false;
      if (isDev) console.log('✅ Redis: Disconnected');
    }
  }

  /**
   * Check if Redis is connected
   */
  static isReady(): boolean {
    return this.isConnected && this.instance !== null;
  }

  /**
   * Get Redis info
   */
  static async getInfo(): Promise<{ connected: boolean; memory?: string; keys?: number }> {
    if (!this.isReady() || !this.instance) {
      return { connected: false };
    }

    try {
      const info = await this.instance.info('memory');
      const dbSize = await this.instance.dbsize();
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      const memory = memoryMatch?.[1]?.trim() || 'unknown';

      return {
        connected: true,
        memory,
        keys: dbSize,
      };
    } catch (error) {
      console.error('Redis getInfo error:', error);
      return { connected: false };
    }
  }
}

// Export singleton instance getter
export const redis = RedisClient.getInstance();

// Export class methods
export const connectRedis = () => RedisClient.connect();
export const disconnectRedis = () => RedisClient.disconnect();
export const isRedisReady = () => RedisClient.isReady();
export const getRedisInfo = () => RedisClient.getInfo();
