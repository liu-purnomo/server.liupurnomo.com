import { z } from 'zod';

/**
 * Bookmark Validators
 */

// ==================== CREATE BOOKMARK ====================

export const createBookmarkSchema = z.object({
  body: z.object({
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
  }),
});

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;

// ==================== UPDATE BOOKMARK ====================

export const updateBookmarkSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Bookmark ID is required' }),
  }),
  body: z.object({
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
  }),
});

export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;

// ==================== GET BOOKMARK BY ID ====================

export const getBookmarkByIdSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Bookmark ID is required' }),
  }),
});

export type GetBookmarkByIdInput = z.infer<typeof getBookmarkByIdSchema>;

// ==================== GET ALL BOOKMARKS ====================

export const getAllBookmarksSchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .or(z.number())
      .default(1),

    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .or(z.number())
      .default(10),

    isFavorite: z
      .string()
      .transform((val) => val === 'true')
      .or(z.boolean())
      .optional(),

    isRead: z
      .string()
      .transform((val) => val === 'true')
      .or(z.boolean())
      .optional(),

    tags: z.string().optional(), // Comma-separated tags

    search: z.string().optional(), // Search in post title and note

    sortBy: z
      .enum(['createdAt', 'updatedAt', 'readAt'])
      .default('createdAt'),

    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type GetAllBookmarksInput = z.infer<typeof getAllBookmarksSchema>;

// ==================== DELETE BOOKMARK ====================

export const deleteBookmarkSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Bookmark ID is required' }),
  }),
});

export type DeleteBookmarkInput = z.infer<typeof deleteBookmarkSchema>;

// ==================== TOGGLE READ STATUS ====================

export const toggleReadStatusSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Bookmark ID is required' }),
  }),
});

export type ToggleReadStatusInput = z.infer<typeof toggleReadStatusSchema>;

// ==================== TOGGLE FAVORITE ====================

export const toggleFavoriteSchema = z.object({
  params: z.object({
    id: z.string({ message: 'Bookmark ID is required' }),
  }),
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
