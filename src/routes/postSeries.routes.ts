/**
 * Post Series Routes
 * API routes for tutorial series management
 */

import { Router } from 'express';
import { postSeriesController } from '../controllers/index.js';
import { authenticate, requireRole } from '../middlewares/index.js';

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * Get All Post Series
 * GET /api/post-series
 * Returns all series with basic info
 */
router.get('/', postSeriesController.getAllPostSeries);

/**
 * Get Post Series by Slug
 * GET /api/post-series/slug/:slug
 */
router.get('/slug/:slug', postSeriesController.getPostSeriesBySlug);

/**
 * Get Post Series by ID
 * GET /api/post-series/:id
 */
router.get('/:id', postSeriesController.getPostSeriesById);

// ==================== PROTECTED ROUTES (AUTHOR/ADMIN) ====================

/**
 * Create Post Series
 * POST /api/post-series
 * Requires AUTHOR or ADMIN role
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  postSeriesController.createPostSeries
);

/**
 * Update Post Series
 * PUT /api/post-series/:id
 * Requires AUTHOR or ADMIN role
 */
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  postSeriesController.updatePostSeries
);

/**
 * Delete Post Series
 * DELETE /api/post-series/:id
 * Requires ADMIN role only
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  postSeriesController.deletePostSeries
);

export default router;
