import { z } from 'zod';
import { PostType, PostStatus, DifficultyLevel } from '@prisma/client';

/**
 * Post Validators
 * Zod schemas for validating post management requests
 */

// ==================== REUSABLE SCHEMAS ====================

/**
 * Post Title Schema
 */
const postTitleSchema = z
  .string({ message: 'Title must be a string' })
  .min(1, 'Title must not be empty')
  .max(200, 'Title must be at most 200 characters long')
  .trim();

/**
 * Post Slug Schema
 */
const postSlugSchema = z
  .string({ message: 'Slug must be a string' })
  .min(1, 'Slug must not be empty')
  .max(200, 'Slug must be at most 200 characters long')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug can only contain lowercase letters, numbers, and hyphens'
  )
  .trim();

/**
 * Post Excerpt Schema
 */
const postExcerptSchema = z
  .string({ message: 'Excerpt must be a string' })
  .max(500, 'Excerpt must be at most 500 characters long')
  .trim()
  .optional();

/**
 * Post Content Schema (JSON)
 */
const postContentSchema = z.any(); // JSON content blocks from editor

/**
 * Category ID Schema
 */
const categoryIdSchema = z
  .string({ message: 'Category ID must be a string' })
  .cuid('Invalid category ID format');

/**
 * Tags Schema
 */
const tagsSchema = z
  .array(z.string().trim().min(1))
  .max(10, 'Maximum 10 tags allowed')
  .optional();

/**
 * Post Type Schema
 */
const postTypeSchema = z
  .enum([PostType.BLOG, PostType.TUTORIAL])
  .default(PostType.BLOG);

/**
 * Post Status Schema
 */
const postStatusSchema = z
  .enum([
    PostStatus.DRAFT,
    PostStatus.PUBLISHED,
    PostStatus.SCHEDULED,
    PostStatus.ARCHIVED,
  ])
  .default(PostStatus.DRAFT);

/**
 * Difficulty Level Schema
 */
const difficultyLevelSchema = z
  .enum([
    DifficultyLevel.BEGINNER,
    DifficultyLevel.INTERMEDIATE,
    DifficultyLevel.ADVANCED,
  ])
  .optional();

/**
 * Meta Title Schema
 */
const metaTitleSchema = z
  .string({ message: 'Meta title must be a string' })
  .max(60, 'Meta title must be at most 60 characters long')
  .trim()
  .optional();

/**
 * Meta Description Schema
 */
const metaDescriptionSchema = z
  .string({ message: 'Meta description must be a string' })
  .max(160, 'Meta description must be at most 160 characters long')
  .trim()
  .optional();

/**
 * Meta Keywords Schema
 */
const metaKeywordsSchema = z
  .string({ message: 'Meta keywords must be a string' })
  .max(255, 'Meta keywords must be at most 255 characters long')
  .trim()
  .optional();

/**
 * Featured Image URL Schema
 */
const featuredImageUrlSchema = z
  .string({ message: 'Featured image URL must be a string' })
  .url('Invalid featured image URL format')
  .trim()
  .optional();

/**
 * OG Image URL Schema
 */
const ogImageUrlSchema = z
  .string({ message: 'OG image URL must be a string' })
  .url('Invalid OG image URL format')
  .trim()
  .optional();

/**
 * Canonical URL Schema
 */
const canonicalUrlSchema = z
  .string({ message: 'Canonical URL must be a string' })
  .url('Invalid canonical URL format')
  .trim()
  .optional();

/**
 * Reading Time Schema (in minutes)
 */
const readingTimeSchema = z
  .number({ message: 'Reading time must be a number' })
  .int('Reading time must be an integer')
  .min(1, 'Reading time must be at least 1 minute')
  .max(999, 'Reading time must be at most 999 minutes')
  .optional();

/**
 * Datetime String Schema
 */
const datetimeStringSchema = z
  .string({ message: 'Date must be a string' })
  .datetime('Invalid datetime format. Use ISO 8601 format')
  .optional();

// ==================== REQUEST VALIDATORS ====================

/**
 * Create Post Validator
 * Validates request for creating a new post
 * Images are URLs (from media library), not file uploads
 */
export const createPostValidator = z
  .object({
    title: postTitleSchema,
    slug: postSlugSchema,
    excerpt: postExcerptSchema,
    content: postContentSchema,
    featuredImageUrl: featuredImageUrlSchema,
    categoryId: categoryIdSchema,
    tags: tagsSchema,
    postType: postTypeSchema,
    status: postStatusSchema,
    difficultyLevel: difficultyLevelSchema,

    // SEO fields
    metaTitle: metaTitleSchema,
    metaDescription: metaDescriptionSchema,
    metaKeywords: metaKeywordsSchema,
    ogImageUrl: ogImageUrlSchema,
    canonicalUrl: canonicalUrlSchema,

    // Publishing
    publishedAt: datetimeStringSchema,
    scheduledAt: datetimeStringSchema,
    readingTime: readingTimeSchema,
  })
  .refine(
    (data) => {
      // If postType is TUTORIAL, difficultyLevel is required
      if (data.postType === PostType.TUTORIAL && !data.difficultyLevel) {
        return false;
      }
      return true;
    },
    {
      message: 'Difficulty level is required for tutorial posts',
      path: ['difficultyLevel'],
    }
  )
  .refine(
    (data) => {
      // If status is SCHEDULED, scheduledAt is required
      if (data.status === PostStatus.SCHEDULED && !data.scheduledAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Scheduled date is required for scheduled posts',
      path: ['scheduledAt'],
    }
  )
  .refine(
    (data) => {
      // If status is PUBLISHED, publishedAt should be set
      if (
        data.status === PostStatus.PUBLISHED &&
        !data.publishedAt &&
        !data.scheduledAt
      ) {
        // Will be auto-set to now() in service if not provided
        return true;
      }
      return true;
    },
    {
      message: 'Published date required for published posts',
      path: ['publishedAt'],
    }
  );

/**
 * Update Post Validator
 * Validates request for updating an existing post
 */
export const updatePostValidator = z
  .object({
    title: postTitleSchema.optional(),
    slug: postSlugSchema.optional(),
    excerpt: postExcerptSchema,
    content: postContentSchema.optional(),
    featuredImageUrl: featuredImageUrlSchema,
    categoryId: categoryIdSchema.optional(),
    tags: tagsSchema,
    postType: postTypeSchema.optional(),
    status: postStatusSchema.optional(),
    difficultyLevel: difficultyLevelSchema,

    // SEO fields
    metaTitle: metaTitleSchema,
    metaDescription: metaDescriptionSchema,
    ogImageUrl: ogImageUrlSchema,
    metaKeywords: metaKeywordsSchema,
    canonicalUrl: canonicalUrlSchema,

    // Publishing
    publishedAt: datetimeStringSchema,
    scheduledAt: datetimeStringSchema,
    readingTime: readingTimeSchema,
  })
  .refine(
    (data) => {
      // If postType is TUTORIAL, difficultyLevel must be provided
      if (data.postType === PostType.TUTORIAL && !data.difficultyLevel) {
        return false;
      }
      return true;
    },
    {
      message: 'Difficulty level is required for tutorial posts',
      path: ['difficultyLevel'],
    }
  )
  .refine(
    (data) => {
      // If status is SCHEDULED, scheduledAt is required
      if (data.status === PostStatus.SCHEDULED && !data.scheduledAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Scheduled date is required for scheduled posts',
      path: ['scheduledAt'],
    }
  );

/**
 * Get Post by ID Validator
 */
export const getPostByIdValidator = z.object({
  id: z.string().cuid('Invalid post ID format'),
});

/**
 * Get Post by Slug Validator
 */
export const getPostBySlugValidator = z.object({
  slug: postSlugSchema,
});

/**
 * Delete Post Validator
 */
export const deletePostValidator = z.object({
  id: z.string().cuid('Invalid post ID format'),
});

/**
 * Get Posts Query Validator
 */
export const getPostsQueryValidator = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  categoryId: z.string().cuid().optional(),
  categorySlug: z.string().trim().optional(),
  tagId: z.string().cuid().optional(),
  tagSlug: z.string().trim().optional(),
  authorId: z.string().cuid().optional(),
  authorUsername: z.string().trim().optional(),
  status: z.enum([
    PostStatus.DRAFT,
    PostStatus.PUBLISHED,
    PostStatus.SCHEDULED,
    PostStatus.ARCHIVED,
  ]).optional(),
  postType: z.enum([PostType.BLOG, PostType.TUTORIAL]).optional(),
  difficultyLevel: z.enum([
    DifficultyLevel.BEGINNER,
    DifficultyLevel.INTERMEDIATE,
    DifficultyLevel.ADVANCED,
  ]).optional(),
  sortBy: z.enum(['publishedAt', 'createdAt', 'updatedAt', 'viewCount', 'title']).default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ==================== TYPE EXPORTS ====================

export type CreatePostInput = z.infer<typeof createPostValidator>;
export type UpdatePostInput = z.infer<typeof updatePostValidator>;
export type GetPostByIdInput = z.infer<typeof getPostByIdValidator>;
export type GetPostBySlugInput = z.infer<typeof getPostBySlugValidator>;
export type DeletePostInput = z.infer<typeof deletePostValidator>;
export type GetPostsQueryInput = z.infer<typeof getPostsQueryValidator>;
