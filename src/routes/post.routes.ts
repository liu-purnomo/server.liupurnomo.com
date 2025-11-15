import { Router } from 'express';
import {
  postController,
  postReactionController,
} from '../controllers/index.js';
import {
  authenticate,
  requireRole,
  validate,
  optionalAuth,
} from '../middlewares/index.js';
import {
  createPostValidator,
  updatePostValidator,
  getPostByIdValidator,
  getPostBySlugValidator,
  deletePostValidator,
  getPostsQueryValidator,
} from '../validators/index.js';

/**
 * Post Routes
 * All routes for post management operations
 */

const router = Router();

// ==================== PUBLIC ROUTES ====================
// No authentication required - returns only published posts

/**
 * Search Posts for Internal Link/Autocomplete
 * GET /api/posts/search
 * Query params: q (search query), limit (default 10)
 */
router.get('/search', postController.searchPosts);

/**
 * Get Post by Slug
 * GET /api/posts/slug/:slug
 * Returns only published posts
 * Optional auth: includes userBookmark if authenticated
 */
router.get(
  '/slug/:slug',
  optionalAuth,
  validate(getPostBySlugValidator, 'params'),
  postController.getPostBySlug
);

/**
 * Get All Posts (Paginated)
 * GET /api/posts
 * Returns only published posts
 */
router.get(
  '/',
  validate(getPostsQueryValidator, 'query'),
  postController.getAllPosts
);

/**
 * Get Post by ID
 * GET /api/posts/:id
 * Returns only published posts
 */
router.get(
  '/:id',
  validate(getPostByIdValidator, 'params'),
  postController.getPostById
);

// ==================== POST REACTION ROUTES ====================
// Public routes with optional authentication

/**
 * Add or Toggle Reaction on Post
 * POST /api/posts/:postId/reactions
 * Body: { reactionType: "LIKE" | "HELPFUL" | "LOVE" | "INSIGHTFUL" | "AMAZING" }
 * Supports both authenticated users and guests
 */
router.post(
  '/:postId/reactions',
  optionalAuth,
  postReactionController.addOrToggleReaction
);

/**
 * Get Reactions Summary for Post
 * GET /api/posts/:postId/reactions/summary
 * Returns aggregate counts and user's reactions (if authenticated)
 */
router.get(
  '/:postId/reactions/summary',
  optionalAuth,
  postReactionController.getReactionsSummary
);

/**
 * Get All Reactions for Post (Paginated)
 * GET /api/posts/:postId/reactions
 * Query params: reactionType (optional), page (default 1), limit (default 20)
 */
router.get(
  '/:postId/reactions',
  postReactionController.getPostReactions
);

/**
 * Remove Reaction from Post
 * DELETE /api/posts/:postId/reactions/:reactionType
 * Supports both authenticated users and guests
 */
router.delete(
  '/:postId/reactions/:reactionType',
  optionalAuth,
  postReactionController.removeReaction
);

// ==================== AUTHOR/ADMIN ROUTES ====================
// Requires authentication and AUTHOR or ADMIN role

/**
 * Get All Posts (Admin/Author View)
 * GET /api/posts/admin/all
 * Includes drafts and unpublished posts
 * ADMIN sees all posts, AUTHORS see only their own
 */
router.get(
  '/admin/all',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getPostsQueryValidator, 'query'),
  postController.getAllPostsAdmin
);

/**
 * Get Post by ID (Admin/Author View)
 * GET /api/posts/admin/:id
 * Includes drafts and unpublished posts
 * ADMIN can view any post, AUTHORS can only view their own
 */
router.get(
  '/admin/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getPostByIdValidator, 'params'),
  postController.getPostByIdAdmin
);

/**
 * Create Post
 * POST /api/posts
 * Requires ADMIN or AUTHOR role
 * JSON body with featuredImageUrl and ogImageUrl as strings (URLs from media library)
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(createPostValidator),
  postController.createPost
);

/**
 * Update Post
 * PUT /api/posts/:id
 * Requires ADMIN or AUTHOR role
 * ADMIN can update any post, AUTHORS can only update their own
 * JSON body with featuredImageUrl and ogImageUrl as strings (URLs from media library)
 */
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getPostByIdValidator, 'params'),
  validate(updatePostValidator),
  postController.updatePost
);

/**
 * Delete Post (Soft Delete)
 * DELETE /api/posts/:id
 * Requires ADMIN or AUTHOR role
 * ADMIN can delete any post, AUTHORS can only delete their own
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(deletePostValidator, 'params'),
  postController.deletePost
);

/**
 * Permanently Delete Post
 * DELETE /api/posts/:id/permanent
 * Requires ADMIN role only
 */
router.delete(
  '/:id/permanent',
  authenticate,
  requireRole('ADMIN'),
  validate(deletePostValidator, 'params'),
  postController.permanentlyDeletePost
);

export default router;
