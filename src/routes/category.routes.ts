import { Router } from 'express';
import { categoryController } from '../controllers/index.js';
import {
  authenticate,
  requireRole,
  validate,
  uploadCategoryIcon,
  handleMulterError,
} from '../middlewares/index.js';
import {
  getCategoriesQueryValidator,
  getCategoryByIdValidator,
  getCategoryBySlugValidator,
} from '../validators/index.js';

/**
 * Category Routes
 * All routes for category management operations
 */

const router = Router();

// ==================== PUBLIC ROUTES ====================
// No authentication required

/**
 * Get Category Tree
 * GET /api/categories/tree
 * Returns hierarchical category structure
 */
router.get('/tree', categoryController.getCategoryTree);

/**
 * Get Category by Slug
 * GET /api/categories/slug/:slug
 */
router.get(
  '/slug/:slug',
  validate(getCategoryBySlugValidator, 'params'),
  categoryController.getCategoryBySlug
);

/**
 * Get All Categories (Paginated)
 * GET /api/categories
 */
router.get(
  '/',
  validate(getCategoriesQueryValidator, 'query'),
  categoryController.getAllCategories
);

/**
 * Get Category by ID
 * GET /api/categories/:id
 */
router.get(
  '/:id',
  validate(getCategoryByIdValidator, 'params'),
  categoryController.getCategoryById
);

// ==================== ADMIN/AUTHOR ROUTES ====================
// Requires authentication and ADMIN or AUTHOR role

/**
 * Create Category
 * POST /api/categories
 * Requires ADMIN or AUTHOR role
 * Multipart/form-data with optional 'icon' field
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  (req, res, next) => {
    uploadCategoryIcon(req, res, (err) => {
      if (err) {
        handleMulterError(err, req);
      }
      next(err);
    });
  },
  categoryController.createCategory
);

/**
 * Update Category
 * PATCH /api/categories/:id
 * Requires ADMIN or AUTHOR role
 * Multipart/form-data with optional 'icon' field
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getCategoryByIdValidator, 'params'),
  (req, res, next) => {
    uploadCategoryIcon(req, res, (err) => {
      if (err) {
        handleMulterError(err, req);
      }
      next(err);
    });
  },
  categoryController.updateCategory
);

/**
 * Delete Category Icon
 * DELETE /api/categories/:id/icon
 * Requires ADMIN or AUTHOR role
 */
router.delete(
  '/:id/icon',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getCategoryByIdValidator, 'params'),
  categoryController.deleteCategoryIcon
);

/**
 * Delete Category
 * DELETE /api/categories/:id
 * Requires ADMIN or AUTHOR role
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getCategoryByIdValidator, 'params'),
  categoryController.deleteCategory
);

export default router;
