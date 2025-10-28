import { Router } from 'express';
import { userController } from '../controllers/index.js';
import {
  authenticate,
  requireRole,
  validate,
  uploadAvatar,
  handleMulterError,
} from '../middlewares/index.js';
import {
  updateProfileSchema,
  adminUpdateUserSchema,
  getUsersQuerySchema,
  userIdParamSchema,
  usernameParamSchema,
} from '../validators/index.js';

/**
 * User Routes
 * All routes for user management operations
 */

const router = Router();

// ==================== PUBLIC ROUTES ====================
// No authentication required

/**
 * Get Public User Profile by Username
 * GET /api/users/public/@:username
 */
router.get(
  '/public/@:username',
  validate(usernameParamSchema, 'params'),
  userController.getPublicUserByUsername
);

/**
 * Get Public User Profile by ID
 * GET /api/users/public/:id
 */
router.get(
  '/public/:id',
  validate(userIdParamSchema, 'params'),
  userController.getPublicUserById
);

// ==================== AUTHENTICATED USER ROUTES ====================
// Requires authentication

/**
 * Get Current User Profile
 * GET /api/users/me
 */
router.get('/me', authenticate, userController.getCurrentUserProfile);

/**
 * Update Current User Profile
 * PATCH /api/users/me
 */
router.patch(
  '/me',
  authenticate,
  validate(updateProfileSchema),
  userController.updateCurrentUserProfile
);

/**
 * Delete Current User Account
 * DELETE /api/users/me
 */
router.delete('/me', authenticate, userController.deleteCurrentUserAccount);

/**
 * Upload/Update User Avatar
 * POST /api/users/me/avatar
 * Multipart/form-data with 'avatar' field
 */
router.post(
  '/me/avatar',
  authenticate,
  (req, res, next) => {
    uploadAvatar(req, res, (err) => {
      if (err) {
        handleMulterError(err, req);
      }
      next(err);
    });
  },
  userController.uploadAvatar
);

/**
 * Delete User Avatar
 * DELETE /api/users/me/avatar
 */
router.delete('/me/avatar', authenticate, userController.deleteAvatar);

// ==================== ADMIN ROUTES ====================
// Requires admin role

/**
 * Get All Users (Admin Only)
 * GET /api/users
 */
router.get(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(getUsersQuerySchema, 'query'),
  userController.getAllUsers
);

/**
 * Get User by ID (Admin Only)
 * GET /api/users/:id
 */
router.get(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(userIdParamSchema, 'params'),
  userController.getUserById
);

/**
 * Update User by ID (Admin Only)
 * PATCH /api/users/:id
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(userIdParamSchema, 'params'),
  validate(adminUpdateUserSchema),
  userController.updateUserById
);

/**
 * Delete User by ID (Admin Only)
 * DELETE /api/users/:id
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(userIdParamSchema, 'params'),
  userController.deleteUserById
);

export default router;
