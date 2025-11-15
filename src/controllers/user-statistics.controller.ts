/**
 * User Statistics Controller
 * Public user statistics endpoints
 */

import { Request, Response } from 'express';
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

    const data = await userStatisticsService.getUserStatisticsByUsername(
      username as string
    );

    return sendSuccess(
      res,
      200,
      'User statistics retrieved successfully',
      data
    );
  }
);
