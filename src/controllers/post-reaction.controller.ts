/**
 * Post Reaction Controller
 * Handles HTTP requests for post-level reactions
 */

import { ReactionType } from '@prisma/client';
import { Request, Response } from 'express';
import { postReactionService } from '../services/index.js';
import { sendSuccess, sendPaginatedSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { GetUserReactionsQueryInput } from '../validators/post-reaction.validator.js';

/**
 * @route   POST /api/posts/:postId/reactions
 * @desc    Add or toggle reaction on a post
 * @access  Public (supports both authenticated and guest users)
 */
export const addOrToggleReaction = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { reactionType } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    // Validate reaction type
    if (!Object.values(ReactionType).includes(reactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type',
      });
    }

    const userId = req.user?.id; // From auth middleware (optional)
    const ipAddress = req.ip || req.socket.remoteAddress || '';
    const userAgent = req.get('user-agent');

    const result = await postReactionService.addOrToggleReaction(
      postId,
      reactionType,
      userId,
      ipAddress,
      userAgent
    );

    return sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * @route   GET /api/posts/:postId/reactions/summary
 * @desc    Get reaction summary for a post
 * @access  Public
 */
export const getReactionsSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const userId = req.user?.id;
    const ipAddress = req.ip || req.socket.remoteAddress || '';

    const result = await postReactionService.getPostReactionsSummary(
      postId,
      userId,
      ipAddress
    );

    return sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * @route   GET /api/posts/:postId/reactions
 * @desc    Get all reactions for a post (paginated)
 * @access  Public
 */
export const getPostReactions = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { reactionType, page, limit } = req.query;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    const result = await postReactionService.getPostReactions(
      postId,
      reactionType as ReactionType | undefined,
      page ? parseInt(page as string, 10) : undefined,
      limit ? parseInt(limit as string, 10) : undefined
    );

    return sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * @route   DELETE /api/posts/:postId/reactions/:reactionType
 * @desc    Remove a specific reaction from a post
 * @access  Public (supports both authenticated and guest users)
 */
export const removeReaction = asyncHandler(
  async (req: Request, res: Response) => {
    const { postId, reactionType } = req.params;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    // Validate reaction type
    if (!Object.values(ReactionType).includes(reactionType as ReactionType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type',
      });
    }

    const userId = req.user?.id;
    const ipAddress = req.ip || req.socket.remoteAddress || '';

    const result = await postReactionService.removeReaction(
      postId,
      reactionType as ReactionType,
      userId,
      ipAddress
    );

    return sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * @route   GET /api/post-reactions
 * @desc    Get all reactions by authenticated user (for profile page)
 * @access  Private
 */
export const getUserReactions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id; // From auth middleware
    const query = req.query as unknown as GetUserReactionsQueryInput;

    const result = await postReactionService.getUserReactions(userId, query);

    return sendPaginatedSuccess(
      res,
      'User reactions retrieved successfully',
      result.data,
      result.pagination
    );
  }
);
