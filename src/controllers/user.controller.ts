import { Request, Response } from 'express';
import { userService } from '../services/index.js';
import {
  asyncHandler,
  logActivity,
  sendSuccess,
  sendNoContent,
} from '../utils/index.js';

/**
 * User Controllers
 * Handle HTTP requests for user management operations
 */

// ==================== PUBLIC USER ENDPOINTS ====================

/**
 * Get Public User Profile by Username
 * GET /api/users/public/@:username
 * Public access - no authentication required
 */
export const getPublicUserByUsername = asyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.params;

    if (!username) {
      throw new Error('Username parameter is required');
    }

    const user = await userService.getPublicUserByUsername(username);

    return sendSuccess(res, 200, 'User profile retrieved successfully', {
      user,
    });
  }
);

/**
 * Get Public User Profile by ID
 * GET /api/users/public/:id
 * Public access - no authentication required
 */
export const getPublicUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error('User ID parameter is required');
    }

    const user = await userService.getPublicUserById(id);

    return sendSuccess(res, 200, 'User profile retrieved successfully', {
      user,
    });
  }
);

// ==================== AUTHENTICATED USER ENDPOINTS ====================

/**
 * Get Current User Profile
 * GET /api/users/me
 * Requires authentication
 */
export const getCurrentUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const user = await userService.getCurrentUserProfile(userId);

    return sendSuccess(res, 200, 'Profile retrieved successfully', { user });
  }
);

/**
 * Update Current User Profile
 * PATCH /api/users/me
 * Requires authentication
 */
export const updateCurrentUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const updateData = req.body;

    const user = await userService.updateCurrentUserProfile(userId, updateData);

    // Log activity
    await logActivity({
      userId,
      action: 'UPDATE',
      entity: 'User',
      entityId: userId,
      description: `User updated their profile: ${user.username}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Profile updated successfully', { user });
  }
);

/**
 * Delete Current User Account
 * DELETE /api/users/me
 * Requires authentication
 */
export const deleteCurrentUserAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const username = req.user!.username;

    await userService.deleteCurrentUserAccount(userId);

    // Log activity
    await logActivity({
      userId,
      action: 'DELETE',
      entity: 'User',
      entityId: userId,
      description: `User deleted their account: ${username}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendNoContent(res);
  }
);

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get All Users
 * GET /api/users
 * Requires admin role
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await userService.getAllUsers(query);

  return sendSuccess(
    res,
    200,
    'Users retrieved successfully',
    result.data,
    result.pagination
  );
});

/**
 * Get User by ID
 * GET /api/users/:id
 * Requires admin role
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new Error('User ID parameter is required');
  }

  const user = await userService.getUserById(id);

  return sendSuccess(res, 200, 'User retrieved successfully', { user });
});

/**
 * Update User by ID
 * PATCH /api/users/:id
 * Requires admin role
 */
export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    const adminId = req.user!.userId;

    if (!id) {
      throw new Error('User ID parameter is required');
    }

    const user = await userService.updateUserById(id, updateData);

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      description: `Admin updated user: ${user.username}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'User updated successfully', { user });
  }
);

/**
 * Delete User by ID
 * DELETE /api/users/:id
 * Requires admin role
 */
export const deleteUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const adminId = req.user!.userId;

    if (!id) {
      throw new Error('User ID parameter is required');
    }

    await userService.deleteUserById(id);

    // Log activity
    await logActivity({
      userId: adminId,
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      description: `Admin deleted user: ${id}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendNoContent(res);
  }
);

// ==================== AVATAR UPLOAD ENDPOINTS ====================

/**
 * Upload/Update User Avatar
 * POST /api/users/me/avatar
 * Requires authentication
 * Accepts multipart/form-data with 'avatar' field
 */
export const uploadAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    // Check if file exists
    if (!req.file) {
      throw new Error('No file uploaded. Please provide an avatar image');
    }

    // Get base URL from request
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Upload avatar
    const user = await userService.uploadUserAvatar(
      userId,
      req.file.buffer,
      baseUrl
    );

    // Log activity
    await logActivity({
      userId,
      action: 'UPDATE',
      entity: 'User',
      entityId: userId,
      description: `User uploaded new avatar: ${user.username}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Avatar uploaded successfully', { user });
  }
);

/**
 * Delete User Avatar
 * DELETE /api/users/me/avatar
 * Requires authentication
 */
export const deleteAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const username = req.user!.username;

    // Delete avatar
    const user = await userService.deleteUserAvatar(userId);

    // Log activity
    await logActivity({
      userId,
      action: 'DELETE',
      entity: 'User',
      entityId: userId,
      description: `User deleted their avatar: ${username}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Avatar deleted successfully', { user });
  }
);
