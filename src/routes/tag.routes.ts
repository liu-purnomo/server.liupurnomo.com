import { Router } from 'express';
import { tagController } from '../controllers/index.js';
import { authenticate, requireRole, validate } from '../middlewares/index.js';
import {
  createTagValidator,
  updateTagValidator,
  getTagsQueryValidator,
  getTagByIdValidator,
  getTagBySlugValidator,
} from '../validators/index.js';

/**
 * Tag Routes
 * All routes for tag management operations
 */

const router = Router();

// ==================== PUBLIC ROUTES ====================
// No authentication required

/**
 * Get Tag by Slug
 * GET /api/tags/slug/:slug
 */
router.get(
  '/slug/:slug',
  validate(getTagBySlugValidator, 'params'),
  tagController.getTagBySlug
);

/**
 * Get All Tags (Paginated)
 * GET /api/tags
 */
router.get(
  '/',
  validate(getTagsQueryValidator, 'query'),
  tagController.getAllTags
);

/**
 * Get Tag by ID
 * GET /api/tags/:id
 */
router.get(
  '/:id',
  validate(getTagByIdValidator, 'params'),
  tagController.getTagById
);

// ==================== ADMIN/AUTHOR ROUTES ====================
// Requires authentication and ADMIN or AUTHOR role

/**
 * Create Tag
 * POST /api/tags
 * Requires ADMIN or AUTHOR role
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(createTagValidator),
  tagController.createTag
);

/**
 * Update Tag
 * PATCH /api/tags/:id
 * Requires ADMIN or AUTHOR role
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(updateTagValidator),
  tagController.updateTag
);

/**
 * Delete Tag
 * DELETE /api/tags/:id
 * Requires ADMIN or AUTHOR role
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getTagByIdValidator, 'params'),
  tagController.deleteTag
);

export default router;
