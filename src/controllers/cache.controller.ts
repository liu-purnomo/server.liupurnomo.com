/**
 * Cache Controller
 * Handles cache management operations (admin only)
 */

import { Request, Response } from 'express';
import { CacheService } from '../services/cache.service.js';
import { asyncHandler, logActivity, sendSuccess } from '../utils/index.js';

/**
 * Clear All Cache
 * DELETE /api/cache/clear
 * Admin only - clears all cached data to force fresh data from database
 */
export const clearAllCache = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    // Clear all cache
    const success = await CacheService.clear();

    if (!success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to clear cache. Redis might not be available.',
      });
    }

    // Log activity
    await logActivity({
      userId,
      action: 'DELETE',
      entity: 'Cache',
      description: 'Cleared all cache data',
      ipAddress,
      userAgent,
    });

    return sendSuccess(
      res,
      200,
      'All cache cleared successfully. Fresh data will be loaded from database.',
      {
        cleared: true,
        timestamp: new Date().toISOString(),
      }
    );
  }
);

/**
 * Get Cache Stats
 * GET /api/cache/stats
 * Admin only - returns cache statistics
 */
export const getCacheStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await CacheService.getStats();

    if (!stats.connected) {
      return res.status(500).json({
        success: false,
        message:
          'Failed to retrieve cache stats. Redis might not be available.',
        data: {
          connected: false,
        },
      });
    }

    return sendSuccess(res, 200, 'Cache stats retrieved successfully', {
      connected: stats.connected,
      memory: stats.memory,
      totalKeys: stats.totalKeys,
      keysByPrefix: stats.keysByPrefix,
      timestamp: new Date().toISOString(),
    });
  }
);
