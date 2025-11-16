/**
 * User Statistics Controller
 * Public user statistics endpoints
 */

import { Request, Response } from 'express';
import { CachePrefix, CacheService, CacheTTL } from '../services/cache.service.js';
import * as userStatisticsService from '../services/user-statistics.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/users/@:username/statistics
 * @desc    Get public user statistics by username
 * @access  Public
 */
export const getUserStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    // Build cache key with username
    const cacheKey = CacheService.buildKey(
      CachePrefix.USER_STATS,
      username as string
    );

    const data = await CacheService.getOrSet(
      cacheKey,
      () => userStatisticsService.getUserStatisticsByUsername(username as string),
      CacheTTL.THIRTY_MINUTES // Heavy query, cache for 30 minutes
    );

    return sendSuccess(
      res,
      200,
      'User statistics retrieved successfully',
      data
    );
  }
);
