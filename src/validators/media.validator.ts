import { z } from 'zod';

/**
 * Media Validators
 * Zod schemas for validating media management requests
 */

// ==================== REUSABLE SCHEMAS ====================

/**
 * Alt Text Schema
 */
const altTextSchema = z
  .string({ message: 'Alt text must be a string' })
  .max(255, 'Alt text must be at most 255 characters long')
  .trim()
  .optional();

/**
 * Caption Schema
 */
const captionSchema = z
  .string({ message: 'Caption must be a string' })
  .max(1000, 'Caption must be at most 1000 characters long')
  .trim()
  .optional();

// ==================== REQUEST VALIDATORS ====================

/**
 * Upload Media Validator
 * Validates request for uploading media (metadata only, file handled by multer)
 */
export const uploadMediaValidator = z.object({
  altText: altTextSchema,
  caption: captionSchema,
});

/**
 * Update Media Validator
 */
export const updateMediaValidator = z.object({
  altText: altTextSchema,
  caption: captionSchema,
});

/**
 * Get Media by ID Validator
 */
export const getMediaByIdValidator = z.object({
  id: z.cuid('Invalid media ID format'),
});

/**
 * Delete Media Validator
 */
export const deleteMediaValidator = z.object({
  id: z.cuid('Invalid media ID format'),
});

/**
 * Get Media Query Validator
 */
export const getMediaQueryValidator = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  mimeType: z.string().trim().optional(), // e.g., 'image/jpeg'
  mimeTypePrefix: z.string().trim().optional(), // e.g., 'image', 'video'
  userId: z.cuid().optional(),
  sortBy: z.enum(['createdAt', 'fileName', 'fileSize']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ==================== TYPE EXPORTS ====================

export type UploadMediaInput = z.infer<typeof uploadMediaValidator>;
export type UpdateMediaInput = z.infer<typeof updateMediaValidator>;
export type GetMediaByIdInput = z.infer<typeof getMediaByIdValidator>;
export type DeleteMediaInput = z.infer<typeof deleteMediaValidator>;
export type GetMediaQueryInput = z.infer<typeof getMediaQueryValidator>;
