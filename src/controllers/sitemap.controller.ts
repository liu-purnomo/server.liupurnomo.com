/**
 * Sitemap Controller
 * Handles sitemap data requests
 */

import { Request, Response } from 'express';
import { CachePrefix, CacheService, CacheTTL } from '../services/cache.service.js';
import * as sitemapService from '../services/sitemap.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/sitemap
 * @desc    Get all public content for sitemap.xml generation
 * @access  Public
 */
export const getSitemapData = asyncHandler(
  async (_req: Request, res: Response) => {
    // Try to get from cache, or fetch from database and cache it
    const data = await CacheService.getOrSet(
      CachePrefix.SITEMAP,
      () => sitemapService.getSitemapData(),
      CacheTTL.ONE_HOUR // Cache for 1 hour
    );

    return sendSuccess(res, 200, 'Sitemap data retrieved successfully', data);
  }
);
