import { Request, Response } from 'express';
import { categoryService } from '../services/index.js';
import {
  asyncHandler,
  logActivity,
  sendCreated,
  sendNoContent,
  sendSuccess,
} from '../utils/index.js';

/**
 * Category Controllers
 * Handle HTTP requests for category management operations
 */

// ==================== PUBLIC CATEGORY ENDPOINTS ====================

/**
 * Get All Categories (Paginated)
 * GET /api/categories
 * Public access - no authentication required
 */
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, search, parentId, sortBy, sortOrder } = req.query;

  const result = await categoryService.getAllCategories(
    page ? Number(page) : 1,
    limit ? Number(limit) : 10,
    search as string,
    parentId as string,
    sortBy as 'name' | 'orderPosition' | 'createdAt',
    sortOrder as 'asc' | 'desc'
  );

  return sendSuccess(
    res,
    200,
    'Categories retrieved successfully',
    { categories: result.data },
    result.pagination
  );
});

/**
 * Get Category Tree
 * GET /api/categories/tree
 * Public access - returns hierarchical category structure
 */
export const getCategoryTree = asyncHandler(async (_req: Request, res: Response) => {
  const tree = await categoryService.getCategoryTree();

  return sendSuccess(res, 200, 'Category tree retrieved successfully', { categories: tree });
});

/**
 * Get Category by ID
 * GET /api/categories/:id
 * Public access - no authentication required
 */
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(id!);

  return sendSuccess(res, 200, 'Category retrieved successfully', { category });
});

/**
 * Get Category by Slug
 * GET /api/categories/slug/:slug
 * Public access - no authentication required
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await categoryService.getCategoryBySlug(slug!);

  return sendSuccess(res, 200, 'Category retrieved successfully', { category });
});

// ==================== ADMIN/AUTHOR CATEGORY ENDPOINTS ====================

/**
 * Create Category
 * POST /api/categories
 * Requires authentication and ADMIN or AUTHOR role
 * Supports FormData with optional icon file upload
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const categoryData = req.body;
  const file = req.file;

  // Validate required fields
  if (!categoryData.name || !categoryData.slug) {
    return res.status(400).json({
      success: false,
      message: 'Name and slug are required',
    });
  }

  // Get base URL for image URLs
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Create category with optional icon
  const category = await categoryService.createCategory(
    categoryData,
    file?.buffer,
    baseUrl
  );

  // Log activity
  await logActivity({
    userId,
    action: 'CREATE',
    entity: 'Category',
    entityId: category.id,
    description: `Created category: ${category.name}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendCreated(res, 'Category created successfully', { category });
});

/**
 * Update Category
 * PATCH /api/categories/:id
 * Requires authentication and ADMIN or AUTHOR role
 * Supports FormData with optional icon file upload
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;
  const updateData = req.body;
  const file = req.file;

  // Get base URL for image URLs
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Update category with optional new icon
  const category = await categoryService.updateCategory(
    id!,
    updateData,
    file?.buffer,
    baseUrl
  );

  // Log activity
  await logActivity({
    userId,
    action: 'UPDATE',
    entity: 'Category',
    entityId: id!,
    description: `Updated category: ${category.name}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, 'Category updated successfully', { category });
});

/**
 * Delete Category
 * DELETE /api/categories/:id
 * Requires authentication and ADMIN or AUTHOR role
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  // Get category name before deletion for logging
  const category = await categoryService.getCategoryById(id!);

  await categoryService.deleteCategory(id!);

  // Log activity
  await logActivity({
    userId,
    action: 'DELETE',
    entity: 'Category',
    entityId: id!,
    description: `Deleted category: ${category.name}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendNoContent(res);
});

/**
 * Delete Category Icon
 * DELETE /api/categories/:id/icon
 * Requires authentication and ADMIN or AUTHOR role
 */
export const deleteCategoryIcon = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  const category = await categoryService.deleteCategoryIcon(id!);

  // Log activity
  await logActivity({
    userId,
    action: 'UPDATE',
    entity: 'Category',
    entityId: id!,
    description: `Deleted icon for category: ${category.name}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, 'Category icon deleted successfully', { category });
});
