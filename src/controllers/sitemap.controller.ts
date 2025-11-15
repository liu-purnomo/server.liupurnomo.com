/**
 * Sitemap Controller
 * Handles sitemap data requests
 */

import { Request, Response } from 'express';
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
    const data = await sitemapService.getSitemapData();

    return sendSuccess(res, 200, 'Sitemap data retrieved successfully', data);
  }
);
