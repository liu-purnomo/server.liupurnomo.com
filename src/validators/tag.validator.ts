import { z } from 'zod';

/**
 * Tag Validators
 * Zod schemas for validating tag management requests
 */

// ==================== REUSABLE SCHEMAS ====================

/**
 * Tag Name Schema
 * Display name for the tag
 */
const tagNameSchema = z
  .string({ message: 'Name must be a string' })
  .min(1, 'Name must not be empty')
  .max(50, 'Name must be at most 50 characters long')
  .trim();

/**
 * Tag Slug Schema
 * URL-friendly identifier
 */
const tagSlugSchema = z
  .string({ message: 'Slug must be a string' })
  .min(1, 'Slug must not be empty')
  .max(50, 'Slug must be at most 50 characters long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens'
  )
  .trim();

/**
 * Tag Description Schema
 * Optional description for the tag
 */
const tagDescriptionSchema = z
  .string({ message: 'Description must be a string' })
  .max(500, 'Description must be at most 500 characters long')
  .trim()
  .optional();

/**
 * Meta Title Schema
 * SEO meta title
 */
const metaTitleSchema = z
  .string({ message: 'Meta title must be a string' })
  .max(60, 'Meta title must be at most 60 characters long')
  .trim()
  .optional();

/**
 * Meta Description Schema
 * SEO meta description
 */
const metaDescriptionSchema = z
  .string({ message: 'Meta description must be a string' })
  .max(160, 'Meta description must be at most 160 characters long')
  .trim()
  .optional();

// ==================== REQUEST VALIDATORS ====================

/**
 * Create Tag Validator
 * Validates request for creating a new tag
 */
export const createTagValidator = z.object({
  name: tagNameSchema,
  slug: tagSlugSchema,
  description: tagDescriptionSchema,
  metaTitle: metaTitleSchema,
  metaDescription: metaDescriptionSchema,
});

/**
 * Update Tag Validator
 * Validates request for updating an existing tag
 */
export const updateTagValidator = z.object({
  name: tagNameSchema.optional(),
  slug: tagSlugSchema.optional(),
  description: tagDescriptionSchema,
  metaTitle: metaTitleSchema,
  metaDescription: metaDescriptionSchema,
});

/**
 * Delete Tag Validator
 * Validates request for deleting a tag
 * NOTE: Not used in routes - getTagByIdValidator is used instead
 */
export const deleteTagValidator = z.object({
  id: z.cuid('Invalid tag ID format'),
});

/**
 * Get Tag by ID Validator (for params only)
 * Validates request for getting a single tag
 * Use this when validating params with validate(schema, 'params')
 */
export const getTagByIdValidator = z.object({
  id: z.cuid('Invalid tag ID format'),
});

/**
 * Get Tag by Slug Validator (for params only)
 * Validates request for getting a tag by slug
 * Use this when validating params with validate(schema, 'params')
 */
export const getTagBySlugValidator = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

/**
 * Get Tags Query Validator
 * Validates query parameters for listing tags
 */
export const getTagsQueryValidator = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(['name', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .optional();

// ==================== TYPE EXPORTS ====================

export type CreateTagInput = z.infer<typeof createTagValidator>;
export type UpdateTagInput = z.infer<typeof updateTagValidator>;
export type GetTagsQuery = z.infer<typeof getTagsQueryValidator>;
