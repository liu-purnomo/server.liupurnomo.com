/**
 * Comment Routes
 * Endpoints for comment management
 */

import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createCommentSchema,
  createGuestCommentSchema,
  updateCommentSchema,
  moderateCommentSchema,
  commentQuerySchema,
  commentIdParamsSchema,
} from '../validators/comment.validator.js';

const router = Router();

/**
 * Public routes (no authentication required, but can use optional auth)
 */

// Get comments with filtering (public can see approved comments, authenticated users see their own too)
router.get('/', optionalAuth, validate(commentQuerySchema, 'query'), commentController.getComments);

// Get comment by ID
router.get('/:id', validate(commentIdParamsSchema, 'params'), commentController.getCommentById);

// Create guest comment (unauthenticated)
router.post('/guest', validate(createGuestCommentSchema), commentController.createGuestComment);

/**
 * Protected routes (authentication required)
 */

// Create comment (authenticated user)
router.post('/', authenticate, validate(createCommentSchema), commentController.createComment);

// Update comment (comment author only)
router.patch('/:id', authenticate, validate(commentIdParamsSchema, 'params'), validate(updateCommentSchema), commentController.updateComment);

// Moderate comment (post author only)
router.patch('/:id/moderate', authenticate, validate(commentIdParamsSchema, 'params'), validate(moderateCommentSchema), commentController.moderateComment);

// Delete comment (comment author or post author)
router.delete('/:id', authenticate, validate(commentIdParamsSchema, 'params'), commentController.deleteComment);

export default router;
