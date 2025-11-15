import { Router } from 'express';
import * as postReactionController from '../controllers/post-reaction.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { getUserReactionsQuerySchema } from '../validators/post-reaction.validator.js';

const router = Router();

/**
 * Post Reaction Routes
 * Endpoint for user's reactions across all posts
 */

/**
 * @route   GET /api/post-reactions
 * @desc    Get all reactions by authenticated user
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  validate(getUserReactionsQuerySchema, 'query'),
  postReactionController.getUserReactions
);

export default router;
