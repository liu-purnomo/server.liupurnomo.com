import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors.js';
import type {
  CreateTagInput,
  GetTagsQuery,
  UpdateTagInput,
} from '../validators/tag.validator.js';

/**
 * Tag Service
 * Handles all tag-related business logic
 */

// ==================== CREATE ====================

/**
 * Create a new tag
 */
export async function createTag(data: CreateTagInput) {
  // Check for duplicate slug
  const existingTag = await prisma.tag.findUnique({
    where: { slug: data.slug },
  });

  if (existingTag) {
    throw new ConflictError('Tag with this slug already exists');
  }

  // Create tag
  const tag = await prisma.tag.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    },
    include: {
      _count: {
        select: {
          postTags: true,
        },
      },
    },
  });

  return tag;
}

// ==================== READ ====================

/**
 * Get all tags with pagination and search
 */
export async function getAllTags(query: GetTagsQuery = {}) {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = 'name',
    sortOrder = 'asc',
  } = query;

  // Ensure page and limit are numbers (defensive programming)
  const pageNum = typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum = typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 10;

  const skip = (pageNum - 1) * limitNum;

  // Build where clause for search
  const where: Prisma.TagWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const total = await prisma.tag.count({ where });

  const tags = await prisma.tag.findMany({
    where,
    skip,
    take: limitNum,
    orderBy: { [sortBy]: sortOrder },
    include: {
      _count: {
        select: {
          postTags: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(total / limitNum);

  return {
    tags,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalItems: total,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  };
}

/**
 * Get tag by ID
 */
export async function getTagById(id: string) {
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          postTags: true,
        },
      },
    },
  });

  if (!tag) {
    throw new NotFoundError('Tag not found');
  }

  return tag;
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string) {
  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          postTags: true,
        },
      },
    },
  });

  if (!tag) {
    throw new NotFoundError('Tag not found');
  }

  return tag;
}

// ==================== UPDATE ====================

/**
 * Update a tag
 */
export async function updateTag(id: string, data: UpdateTagInput) {
  // Check if tag exists
  const existingTag = await prisma.tag.findUnique({
    where: { id },
  });

  if (!existingTag) {
    throw new NotFoundError('Tag not found');
  }

  // Check for slug conflict if slug is being updated
  if (data.slug && data.slug !== existingTag.slug) {
    const slugConflict = await prisma.tag.findUnique({
      where: { slug: data.slug },
    });

    if (slugConflict) {
      throw new ConflictError('Tag with this slug already exists');
    }
  }

  // Update tag
  const updatedTag = await prisma.tag.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description:
        data.description !== undefined ? data.description : undefined,
      metaTitle: data.metaTitle !== undefined ? data.metaTitle : undefined,
      metaDescription:
        data.metaDescription !== undefined ? data.metaDescription : undefined,
    },
    include: {
      _count: {
        select: {
          postTags: true,
        },
      },
    },
  });

  return updatedTag;
}

// ==================== DELETE ====================

/**
 * Delete a tag
 */
export async function deleteTag(id: string) {
  // Check if tag exists
  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          postTags: true,
        },
      },
    },
  });

  if (!tag) {
    throw new NotFoundError('Tag not found');
  }

  // Check if tag is being used
  if (tag._count.postTags > 0) {
    throw new ValidationError('Cannot delete tag that is assigned to posts', [
      {
        field: 'id',
        message: `This tag is used by ${tag._count.postTags} post(s). Remove the tag from all posts before deleting.`,
      },
    ]);
  }

  // Delete tag
  await prisma.tag.delete({
    where: { id },
  });

  return { message: 'Tag deleted successfully' };
}
