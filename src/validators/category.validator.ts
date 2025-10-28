import { z } from 'zod';

/**
 * Category Validators
 * Zod schemas for validating category management requests
 */

// ==================== REUSABLE SCHEMAS ====================

/**
 * Category Name Schema
 * Display name for the category
 */
const categoryNameSchema = z
  .string({ message: 'Name must be a string' })
  .min(1, 'Name must not be empty')
  .max(100, 'Name must be at most 100 characters long')
  .trim();

/**
 * Category Slug Schema
 * URL-friendly identifier
 */
const categorySlugSchema = z
  .string({ message: 'Slug must be a string' })
  .min(1, 'Slug must not be empty')
  .max(100, 'Slug must be at most 100 characters long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens'
  )
  .trim();

/**
 * Category Description Schema
 * Optional description for the category
 */
const categoryDescriptionSchema = z
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

/**
 * Parent ID Schema
 * Optional reference to parent category
 */
const parentIdSchema = z
  .string({ message: 'Parent ID must be a string' })
  .cuid('Invalid parent ID format')
  .optional();

// ==================== REQUEST VALIDATORS ====================

/**
 * Create Category Validator
 * Validates request for creating a new category (with FormData)
 * File upload handled separately by multer middleware
 */
export const createCategoryValidator = z
  .object({
    name: categoryNameSchema,
    slug: categorySlugSchema,
    description: categoryDescriptionSchema.optional(),
    parentId: parentIdSchema.optional(),
    metaTitle: metaTitleSchema.optional(),
    metaDescription: metaDescriptionSchema.optional(),
    orderPosition: z.coerce.number().int().min(0).optional(),
  })
  .passthrough(); // Allow additional fields from FormData

/**
 * Update Category Validator
 * Validates request for updating an existing category (with FormData)
 * File upload handled separately by multer middleware
 */
export const updateCategoryValidator = z
  .object({
    name: categoryNameSchema.optional(),
    slug: categorySlugSchema.optional(),
    description: categoryDescriptionSchema.optional(),
    parentId: parentIdSchema.optional(),
    metaTitle: metaTitleSchema.optional(),
    metaDescription: metaDescriptionSchema.optional(),
    orderPosition: z.coerce.number().int().min(0).optional(),
  })
  .passthrough(); // Allow additional fields from FormData

/**
 * Delete Category Validator
 * Validates request for deleting a category
 * NOTE: Not used in routes - getCategoryByIdValidator is used instead
 */
export const deleteCategoryValidator = z.object({
  id: z.cuid('Invalid category ID format'),
});

/**
 * Get Category by ID Validator (for params only)
 * Validates request for getting a single category
 * Use this when validating params with validate(schema, 'params')
 */
export const getCategoryByIdValidator = z.object({
  id: z.cuid('Invalid category ID format'),
});

/**
 * Get Category by Slug Validator (for params only)
 * Validates request for getting a category by slug
 * Use this when validating params with validate(schema, 'params')
 */
export const getCategoryBySlugValidator = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

/**
 * Get Categories Query Validator
 * Validates query parameters for listing categories
 */
export const getCategoriesQueryValidator = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    search: z.string().trim().optional(),
    parentId: z.string().optional(),
    sortBy: z.enum(['name', 'orderPosition', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .optional();

/**
 * Upload Category Icon Validator (for params only)
 * Validates request for uploading category icon
 * Use this when validating params with validate(schema, 'params')
 */
export const uploadCategoryIconValidator = z.object({
  id: z.string().cuid('Invalid category ID format'),
});

// ==================== TYPE EXPORTS ====================

export type CreateCategoryInput = z.infer<typeof createCategoryValidator>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryValidator>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQueryValidator>;
