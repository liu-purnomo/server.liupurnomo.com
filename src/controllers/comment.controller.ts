/**
 * Comment Controller
 * HTTP handlers for comment endpoints
 */

import { Request, Response } from 'express';
import { commentService } from '../services/index.js';
import {
  asyncHandler,
  logActivity,
  sendSuccess,
} from '../utils/index.js';
import type {
  CreateCommentInput,
  CreateGuestCommentInput,
  UpdateCommentInput,
  ModerateCommentInput,
  CommentQueryParams,
} from '../types/index.js';

/**
 * Create comment (authenticated user)
 * POST /api/comments
 */
export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as CreateCommentInput;
    const userId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await commentService.createComment(
      data,
      userId,
      ipAddress,
      userAgent
    );

    // Log activity
    await logActivity({
      userId,
      action: 'CREATE',
      entity: 'Comment',
      entityId: result.data?.comment.id,
      description: `Created comment on post ${data.postId}`,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, 201, result.message, result.data);
  }
);

/**
 * Create guest comment (unauthenticated)
 * POST /api/comments/guest
 */
export const createGuestComment = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as CreateGuestCommentInput;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');
    const referrer = req.get('referer');

    const result = await commentService.createGuestComment(
      data,
      ipAddress,
      userAgent,
      referrer
    );

    // Log activity (no userId for guest)
    await logActivity({
      action: 'CREATE',
      entity: 'Comment',
      entityId: result.data?.comment.id,
      description: `Guest comment created by ${data.authorName} on post ${data.postId}`,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, 201, result.message, result.data);
  }
);

/**
 * Get comments with pagination and filtering
 * GET /api/comments
 * Public endpoint but can use authentication to show user's own pending comments
 */
export const getComments = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as CommentQueryParams;
    const requestingUserId = req.user?.id; // Optional - may be undefined for guests

    const result = await commentService.getComments(query, requestingUserId);

    sendSuccess(res, 200, result.message, result.data?.data, result.data?.pagination);
  }
);

/**
 * Get comment by ID
 * GET /api/comments/:id
 */
export const getCommentById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await commentService.getCommentById(id!);

    sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * Update comment
 * PATCH /api/comments/:id
 */
export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateCommentInput;
    const userId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await commentService.updateComment(id!, data, userId);

    // Log activity
    await logActivity({
      userId,
      action: 'UPDATE',
      entity: 'Comment',
      entityId: id,
      description: `Updated comment ${id}`,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * Moderate comment (approve/feature/pin)
 * PATCH /api/comments/:id/moderate
 */
export const moderateComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as ModerateCommentInput;
    const userId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await commentService.moderateComment(id!, data, userId);

    // Log activity
    await logActivity({
      userId,
      action: 'UPDATE',
      entity: 'Comment',
      entityId: id,
      description: `Moderated comment ${id}`,
      newData: data,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, 200, result.message, result.data);
  }
);

/**
 * Delete comment
 * DELETE /api/comments/:id
 */
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('user-agent');

    const result = await commentService.deleteComment(id!, userId);

    // Log activity
    await logActivity({
      userId,
      action: 'DELETE',
      entity: 'Comment',
      entityId: id,
      description: `Deleted comment ${id}`,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, 200, result.message);
  }
);
