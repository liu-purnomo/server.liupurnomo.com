/**
 * Comment Validators
 * Zod schemas for comment validation
 * NO wrapper objects - middleware handles req[source] extraction
 */

import { z } from 'zod';

// ==================== REUSABLE SCHEMAS ====================

/**
 * Generic JSON content validation
 * Accepts any valid JSON object from any editor
 */
const contentSchema = z.any();

/**
 * Comment ID Schema
 */
const commentIdSchema = z.cuid('Invalid comment ID format');

/**
 * Post ID Schema
 */
const postIdSchema = z.cuid('Invalid post ID format');

/**
 * Author Name Schema (for guest comments)
 */
const authorNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .trim();

/**
 * Author Email Schema (for guest comments)
 */
const authorEmailSchema = z
  .email('Invalid email format')
  .trim();

/**
 * Author URL Schema (for guest comments)
 */
const authorUrlSchema = z
  .url('Invalid URL format')
  .trim()
  .optional()
  .or(z.literal(''));

// ==================== REQUEST VALIDATORS ====================

/**
 * Create comment (authenticated user)
 * POST /api/comments
 */
export const createCommentSchema = z.object({
  postId: postIdSchema,
  parentId: commentIdSchema.optional(),
  content: contentSchema,
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/**
 * Create guest comment (unauthenticated)
 * POST /api/comments/guest
 */
export const createGuestCommentSchema = z.object({
  postId: postIdSchema,
  parentId: commentIdSchema.optional(),
  authorName: authorNameSchema,
  authorEmail: authorEmailSchema,
  authorUrl: authorUrlSchema,
  content: contentSchema,
});

export type CreateGuestCommentInput = z.infer<typeof createGuestCommentSchema>;

/**
 * Update comment
 * PATCH /api/comments/:id
 */
export const updateCommentSchema = z.object({
  content: contentSchema,
});

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

/**
 * Moderate comment (approve/feature/pin)
 * PATCH /api/comments/:id/moderate
 */
export const moderateCommentSchema = z.object({
  isApproved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export type ModerateCommentInput = z.infer<typeof moderateCommentSchema>;

/**
 * Query params for listing comments
 * GET /api/comments
 */
export const commentQuerySchema = z.object({
  postId: z.cuid().optional(),
  userId: z.cuid().optional(),
  parentId: z
    .union([z.cuid(), z.literal('root')])
    .optional(),
  isApproved: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z
    .enum(['createdAt', 'helpfulCount', 'likeCount'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CommentQueryInput = z.infer<typeof commentQuerySchema>;

/**
 * Get comment by ID params
 * GET /api/comments/:id
 */
export const commentIdParamsSchema = z.object({
  id: commentIdSchema,
});

export type CommentIdInput = z.infer<typeof commentIdParamsSchema>;
