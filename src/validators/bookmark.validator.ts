import { z } from 'zod';

/**
 * Bookmark Validators
 * NO wrapper objects - middleware handles req[source] extraction
 */

// ==================== CREATE BOOKMARK ====================

export const createBookmarkSchema = z.object({
  postId: z.string({ message: 'Post ID is required' }),

  note: z
    .string()
    .max(5000, 'Note must be 5000 characters or less')
    .optional(),

  tags: z
    .array(z.string().max(50, 'Tag must be 50 characters or less'))
    .max(20, 'Maximum 20 tags')
    .default([]),

  isFavorite: z.boolean().default(false),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;

// ==================== UPDATE BOOKMARK ====================

export const updateBookmarkSchema = z.object({
  note: z
    .string()
    .max(5000, 'Note must be 5000 characters or less')
    .optional(),

  tags: z
    .array(z.string().max(50, 'Tag must be 50 characters or less'))
    .max(20, 'Maximum 20 tags')
    .optional(),

  isFavorite: z.boolean().optional(),

  isRead: z.boolean().optional(),
});

export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;

// ==================== PARAMS SCHEMAS ====================

export const bookmarkIdParamsSchema = z.object({
  id: z.string({ message: 'Bookmark ID is required' }),
});

export type BookmarkIdInput = z.infer<typeof bookmarkIdParamsSchema>;

export const postIdParamsSchema = z.object({
  postId: z.string({ message: 'Post ID is required' }),
});

export type PostIdInput = z.infer<typeof postIdParamsSchema>;

// ==================== GET ALL BOOKMARKS ====================

export const bookmarkQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  isFavorite: z.coerce.boolean().optional(),

  isRead: z.coerce.boolean().optional(),

  tags: z.string().optional(), // Comma-separated tags

  search: z.string().optional(), // Search in post title and note

  sortBy: z
    .enum(['createdAt', 'updatedAt', 'readAt'])
    .default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type BookmarkQueryInput = z.infer<typeof bookmarkQuerySchema>;
