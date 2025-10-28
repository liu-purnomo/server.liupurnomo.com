import { Prisma } from '@prisma/client';
import path from 'path';
import { prisma } from '../lib/prisma.js';
import type {
  CategoryListItemResponse,
  CategoryResponse,
  CategoryTreeResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/index.js';
import { PaginatedResult } from '../types/response.types.js';
import {
  deleteImageByFilename,
  extractFilenameFromUrl,
  generateImageUrls,
  processImage,
} from '../utils/imageProcessor.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../utils/index.js';

/**
 * Category Service
 * Handles all category-related business logic
 */

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert Prisma Category to CategoryResponse
 */
function toCategoryResponse(category: any): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    metaTitle: category.metaTitle,
    metaDescription: category.metaDescription,
    iconUrl: category.iconUrl,
    orderPosition: category.orderPosition,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    parent: category.parent ? toCategoryResponse(category.parent) : null,
    children: category.children
      ? category.children.map(toCategoryResponse)
      : undefined,
    _count: category._count,
  };
}

/**
 * Convert to CategoryListItemResponse
 */
function toCategoryListItem(category: any): CategoryListItemResponse {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    iconUrl: category.iconUrl,
    orderPosition: category.orderPosition,
    createdAt: category.createdAt,
    _count: category._count || { posts: 0, children: 0 },
  };
}

/**
 * Convert to CategoryTreeResponse
 */
function toCategoryTree(category: any): CategoryTreeResponse {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    iconUrl: category.iconUrl,
    orderPosition: category.orderPosition,
    children: category.children ? category.children.map(toCategoryTree) : [],
    _count: {
      posts: category._count?.posts || 0,
    },
  };
}

// ==================== CRUD OPERATIONS ====================

/**
 * Create Category
 * Creates a new category with optional icon upload
 */
export async function createCategory(
  data: CreateCategoryRequest,
  fileBuffer?: Buffer,
  baseUrl?: string
): Promise<CategoryResponse> {
  // Check if slug already exists
  const existingSlug = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (existingSlug) {
    throw new ConflictError('Category with this slug already exists');
  }

  // Validate parent if provided
  if (data.parentId) {
    const parent = await prisma.category.findUnique({
      where: { id: data.parentId },
    });

    if (!parent) {
      throw new NotFoundError('Parent category not found');
    }
  }

  let iconUrl: string | null = null;

  // Process icon if provided
  if (fileBuffer && baseUrl) {
    const iconDir = path.join('storages', 'category-icons');
    const processedImages = await processImage(fileBuffer, {
      baseDir: iconDir,
      quality: 90,
    });

    const imageUrls = generateImageUrls(processedImages, baseUrl);
    iconUrl = imageUrls.medium;
  }

  // Prepare category data with proper type conversion
  const categoryData = {
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    parentId: data.parentId || null,
    metaTitle: data.metaTitle || null,
    metaDescription: data.metaDescription || null,
    orderPosition: data.orderPosition ? Number(data.orderPosition) : 0,
    iconUrl,
  };

  // Create category
  const category = await prisma.category.create({
    data: categoryData,
    include: {
      parent: true,
      _count: {
        select: {
          posts: true,
          children: true,
        },
      },
    },
  });

  return toCategoryResponse(category);
}

/**
 * Get All Categories (Paginated)
 * Retrieves categories with optional filtering and pagination
 */
export async function getAllCategories(
  page: number = 1,
  limit: number = 10,
  search?: string,
  parentId?: string,
  sortBy: 'name' | 'orderPosition' | 'createdAt' = 'orderPosition',
  sortOrder: 'asc' | 'desc' = 'asc'
): Promise<PaginatedResult<CategoryListItemResponse>> {
  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.CategoryWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (parentId !== undefined) {
    where.parentId = parentId === 'null' || parentId === '' ? null : parentId;
  }

  // Get total count
  const totalItems = await prisma.category.count({ where });

  // Get categories
  const categories = await prisma.category.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      _count: {
        select: {
          posts: true,
          children: true,
        },
      },
    },
  });

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: categories.map(toCategoryListItem),
    pagination: {
      currentPage: page,
      perPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

/**
 * Get Category by ID
 * Retrieves a single category with full details
 */
export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: {
        orderBy: { orderPosition: 'asc' },
      },
      _count: {
        select: {
          posts: true,
          children: true,
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return toCategoryResponse(category);
}

/**
 * Get Category by Slug
 * Retrieves a single category by its slug
 */
export async function getCategoryBySlug(
  slug: string
): Promise<CategoryResponse> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: {
        orderBy: { orderPosition: 'asc' },
      },
      _count: {
        select: {
          posts: true,
          children: true,
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  return toCategoryResponse(category);
}

/**
 * Get Category Tree
 * Retrieves hierarchical category structure
 */
export async function getCategoryTree(): Promise<CategoryTreeResponse[]> {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { orderPosition: 'asc' },
    include: {
      children: {
        orderBy: { orderPosition: 'asc' },
        include: {
          children: {
            orderBy: { orderPosition: 'asc' },
            include: {
              _count: {
                select: { posts: true },
              },
            },
          },
          _count: {
            select: { posts: true },
          },
        },
      },
      _count: {
        select: { posts: true },
      },
    },
  });

  return categories.map(toCategoryTree);
}

/**
 * Update Category
 * Updates an existing category with optional icon upload
 */
export async function updateCategory(
  id: string,
  data: UpdateCategoryRequest,
  fileBuffer?: Buffer,
  baseUrl?: string
): Promise<CategoryResponse> {
  // Check if category exists
  const existing = await prisma.category.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError('Category not found');
  }

  // Check slug uniqueness if changing slug
  if (data.slug && data.slug !== existing.slug) {
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new ConflictError('Category with this slug already exists');
    }
  }

  // Validate parent if changing parent
  if (data.parentId !== undefined) {
    if (data.parentId) {
      // Check parent exists
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new NotFoundError('Parent category not found');
      }

      // Prevent circular reference
      if (data.parentId === id) {
        throw new BadRequestError('Category cannot be its own parent');
      }
    }
  }

  let iconUrl: string | undefined = undefined;

  // Process new icon if provided
  if (fileBuffer && baseUrl) {
    // Delete old icon if exists
    if (existing.iconUrl) {
      const oldFilename = extractFilenameFromUrl(existing.iconUrl);
      if (oldFilename) {
        const iconDir = path.join('storages', 'category-icons');
        await deleteImageByFilename(iconDir, oldFilename);
      }
    }

    // Process and save new icon
    const iconDir = path.join('storages', 'category-icons');
    const processedImages = await processImage(fileBuffer, {
      baseDir: iconDir,
      quality: 90,
    });

    const imageUrls = generateImageUrls(processedImages, baseUrl);
    iconUrl = imageUrls.medium;
  }

  // Prepare update data with proper type conversion
  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.parentId !== undefined) updateData.parentId = data.parentId || null;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle || null;
  if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription || null;
  if (data.orderPosition !== undefined) updateData.orderPosition = Number(data.orderPosition);
  if (iconUrl !== undefined) updateData.iconUrl = iconUrl;

  // Update category
  const category = await prisma.category.update({
    where: { id },
    data: updateData,
    include: {
      parent: true,
      children: {
        orderBy: { orderPosition: 'asc' },
      },
      _count: {
        select: {
          posts: true,
          children: true,
        },
      },
    },
  });

  return toCategoryResponse(category);
}

/**
 * Delete Category
 * Deletes a category and its icon
 */
export async function deleteCategory(id: string): Promise<void> {
  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          children: true,
          posts: true,
        },
      },
    },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  // Check if category has children
  if (category._count.children > 0) {
    throw new BadRequestError(
      'Cannot delete category with subcategories. Delete or reassign subcategories first.'
    );
  }

  // Check if category has posts
  if (category._count.posts > 0) {
    throw new BadRequestError(
      'Cannot delete category with posts. Reassign or delete posts first.'
    );
  }

  // Delete icon if exists
  if (category.iconUrl) {
    const filename = extractFilenameFromUrl(category.iconUrl);
    if (filename) {
      const iconDir = path.join('storages', 'category-icons');
      await deleteImageByFilename(iconDir, filename);
    }
  }

  // Delete category
  await prisma.category.delete({
    where: { id },
  });
}

/**
 * Delete Category Icon
 * Remove icon from category
 */
export async function deleteCategoryIcon(
  id: string
): Promise<CategoryResponse> {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new NotFoundError('Category not found');
  }

  if (!category.iconUrl) {
    throw new NotFoundError('Category has no icon to delete');
  }

  // Delete icon files
  const filename = extractFilenameFromUrl(category.iconUrl);
  if (filename) {
    const iconDir = path.join('storages', 'category-icons');
    await deleteImageByFilename(iconDir, filename);
  }

  // Update category - remove icon URL
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      iconUrl: null,
    },
    include: {
      parent: true,
      children: {
        orderBy: { orderPosition: 'asc' },
      },
      _count: {
        select: {
          posts: true,
          children: true,
        },
      },
    },
  });

  return toCategoryResponse(updatedCategory);
}
