/**
 * Post Series Controller
 * Handles HTTP requests for tutorial series management
 */

import { Request, Response } from 'express';
import { postSeriesService } from '../services/index.js';
import {
  asyncHandler,
  logActivity,
  sendCreated,
  sendSuccess,
} from '../utils/index.js';

// ==================== PUBLIC ENDPOINTS ====================

/**
 * Get All Post Series (Public)
 * GET /api/post-series
 * Returns all series with basic info
 */
export const getAllPostSeries = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', limit = '10', search, sortBy = 'orderPosition', sortOrder = 'asc' } = req.query;

  const result = await postSeriesService.getAllPostSeries({
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
    search: search as string,
    sortBy: sortBy as 'title' | 'orderPosition' | 'createdAt',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  return sendSuccess(res, 200, 'Post series retrieved successfully', result);
});

/**
 * Get Post Series by ID
 * GET /api/post-series/:id
 */
export const getPostSeriesById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const series = await postSeriesService.getPostSeriesById(id);
  return sendSuccess(res, 200, 'Post series retrieved successfully', { series });
});

/**
 * Get Post Series by Slug
 * GET /api/post-series/slug/:slug
 */
export const getPostSeriesBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const series = await postSeriesService.getPostSeriesBySlug(slug);
  return sendSuccess(res, 200, 'Post series retrieved successfully', { series });
});

// ==================== ADMIN/AUTHOR ENDPOINTS ====================

/**
 * Create Post Series
 * POST /api/post-series
 * Requires AUTHOR or ADMIN role
 */
export const createPostSeries = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const series = await postSeriesService.createPostSeries(req.body);

  // Log activity
  await logActivity({
    userId,
    action: 'CREATE',
    entity: 'POST_SERIES',
    entityId: series.id,
    description: `Created post series: ${series.title}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendCreated(res, 'Post series created successfully', { series });
});

/**
 * Update Post Series
 * PUT /api/post-series/:id
 * Requires AUTHOR or ADMIN role
 */
export const updatePostSeries = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  const series = await postSeriesService.updatePostSeries(id, req.body);

  // Log activity
  await logActivity({
    userId,
    action: 'UPDATE',
    entity: 'POST_SERIES',
    entityId: id,
    description: `Updated post series: ${series.title}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, 'Post series updated successfully', { series });
});

/**
 * Delete Post Series
 * DELETE /api/post-series/:id
 * Requires ADMIN role
 */
export const deletePostSeries = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  await postSeriesService.deletePostSeries(id);

  // Log activity
  await logActivity({
    userId,
    action: 'DELETE',
    entity: 'POST_SERIES',
    entityId: id,
    description: `Deleted post series`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, 'Post series deleted successfully', null);
});
