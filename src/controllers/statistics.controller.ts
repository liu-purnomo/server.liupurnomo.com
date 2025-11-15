/**
 * Statistics Controller
 * Handles HTTP requests for blog statistics
 */

import { Request, Response } from 'express';
import * as statisticsService from '../services/statistics.service.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @route   GET /api/statistics
 * @desc    Get comprehensive blog statistics for dashboard
 * @access  Private (Admin only)
 */
export const getBlogStatistics = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await statisticsService.getBlogStatistics();

    return sendSuccess(res, 200, result.message, result.data);
  }
);
