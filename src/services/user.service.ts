import { User, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import {
  AdminUpdateUserRequest,
  AdminUserResponse,
  GetUsersQuery,
  PublicUserResponse,
  UpdateProfileRequest,
  UserListItemResponse,
  UserProfileResponse,
} from '../types/index.js';
import { PaginatedResult } from '../types/response.types.js';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.js';
import { calculatePagination } from '../utils/index.js';
import {
  processImage,
  deleteImageByFilename,
  extractFilenameFromUrl,
  generateImageUrls,
} from '../utils/imageProcessor.js';
import { comparePassword, hashPassword } from '../lib/bcrypt.js';
import path from 'path';

/**
 * User Service
 * Business logic for user management operations
 */

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert User to Public User Response
 * Limited information visible to everyone
 */
function toPublicUserResponse(user: User): PublicUserResponse {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * Convert User to User Profile Response
 * Full information for authenticated users viewing their own profile
 */
function toUserProfileResponse(user: User): UserProfileResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    role: user.role,
    isActive: user.isActive,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Convert User to Admin User Response
 * Extended information for admins
 */
function toAdminUserResponse(user: User): AdminUserResponse {
  return toUserProfileResponse(user);
}

/**
 * Convert User to User List Item Response
 * Compact information for user lists
 */
function toUserListItemResponse(user: User): UserListItemResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    isActive: user.isActive,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
  };
}

// ==================== PUBLIC USER OPERATIONS ====================

/**
 * Get Public User Profile by Username
 * Accessible to everyone (no authentication required)
 */
export async function getPublicUserByUsername(
  username: string
): Promise<PublicUserResponse> {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.isActive) {
    throw new NotFoundError('User account is inactive');
  }

  return toPublicUserResponse(user);
}

/**
 * Get Public User Profile by ID
 * Accessible to everyone (no authentication required)
 */
export async function getPublicUserById(
  userId: string
): Promise<PublicUserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.isActive) {
    throw new NotFoundError('User account is inactive');
  }

  return toPublicUserResponse(user);
}

// ==================== AUTHENTICATED USER OPERATIONS ====================

/**
 * Get Current User Profile
 * Users can view their own full profile
 */
export async function getCurrentUserProfile(
  userId: string
): Promise<UserProfileResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toUserProfileResponse(user);
}

/**
 * Update Current User Profile
 * Users can update their own profile (limited fields including username)
 */
export async function updateCurrentUserProfile(
  userId: string,
  data: UpdateProfileRequest
): Promise<UserProfileResponse> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  // Check for username conflict if username is being changed
  if (data.username && data.username !== existingUser.username) {
    const usernameExists = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (usernameExists) {
      throw new ConflictError('Username is already taken');
    }
  }

  // Update user profile
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      username: data.username,
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatarUrl: data.avatarUrl,
    },
  });

  return toUserProfileResponse(updatedUser);
}

/**
 * Delete Current User Account
 * Users can delete their own account (soft delete)
 */
export async function deleteCurrentUserAccount(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Soft delete by deactivating the account
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
}

/**
 * Update Current User Password
 * Allow user to change their password after verifying current password
 */
export async function updateCurrentUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  // Get user with password hash
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      passwordHash: true,
      email: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if user has a password (might be OAuth-only user)
  if (!user.passwordHash) {
    throw new UnauthorizedError(
      'Cannot update password for OAuth-only accounts. Please set a password first.'
    );
  }

  // Verify current password
  const isPasswordValid = await comparePassword(
    currentPassword,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password in database
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });
}

// ==================== ADMIN OPERATIONS ====================

/**
 * Get All Users (Admin Only)
 * Paginated list with filtering
 */
export async function getAllUsers(
  query: GetUsersQuery
): Promise<PaginatedResult<UserListItemResponse>> {
  const { page = 1, limit = 10, role, isActive, search } = query;

  // Ensure page and limit are numbers (defensive programming)
  const pageNum = typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum = typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 10;

  // Build where clause
  const where: any = {};

  if (role) {
    where.role = role;
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get total count
  const totalItems = await prisma.user.count({ where });

  // Calculate pagination
  const pagination = calculatePagination(totalItems, pageNum, limitNum);

  // Get users
  const users = await prisma.user.findMany({
    where,
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    orderBy: { createdAt: 'desc' },
  });

  return {
    data: users.map(toUserListItemResponse),
    pagination,
  };
}

/**
 * Get User by ID (Admin Only)
 * Full user information for admins
 */
export async function getUserById(userId: string): Promise<AdminUserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toAdminUserResponse(user);
}

/**
 * Update User by ID (Admin Only)
 * Admins can update any user with extended permissions
 */
export async function updateUserById(
  userId: string,
  data: AdminUpdateUserRequest
): Promise<AdminUserResponse> {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  // Check for conflicts if email or username is being changed
  if (data.email && data.email !== existingUser.email) {
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (emailExists) {
      throw new ConflictError('Email is already in use');
    }
  }

  if (data.username && data.username !== existingUser.username) {
    const usernameExists = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (usernameExists) {
      throw new ConflictError('Username is already taken');
    }
  }

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      username: data.username,
      bio: data.bio,
      location: data.location,
      avatarUrl: data.avatarUrl,
      role: data.role,
      isActive: data.isActive,
    },
  });

  return toAdminUserResponse(updatedUser);
}

/**
 * Delete User by ID (Admin Only)
 * Permanently delete user account
 */
export async function deleteUserById(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Prevent deleting admin users (optional security measure)
  if (user.role === UserRole.ADMIN) {
    throw new ForbiddenError('Cannot delete admin users');
  }

  // Hard delete user
  await prisma.user.delete({
    where: { id: userId },
  });
}

// ==================== AVATAR UPLOAD OPERATIONS ====================

/**
 * Upload/Update User Avatar
 * Process image, save in multiple sizes, delete old avatar
 */
export async function uploadUserAvatar(
  userId: string,
  fileBuffer: Buffer,
  baseUrl: string
): Promise<UserProfileResponse> {
  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Delete old avatar if exists
  if (user.avatarUrl) {
    const oldFilename = extractFilenameFromUrl(user.avatarUrl);
    if (oldFilename) {
      const avatarDir = path.join('storages', 'avatars');
      await deleteImageByFilename(avatarDir, oldFilename);
    }
  }

  // Process and save new avatar
  const avatarDir = path.join('storages', 'avatars');
  const processedImages = await processImage(fileBuffer, {
    baseDir: avatarDir,
    quality: 90,
  });

  // Generate URLs
  const imageUrls = generateImageUrls(processedImages, baseUrl);

  // Update user with new avatar URL (use medium size as primary)
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: imageUrls.medium, // Use medium size as default avatar
    },
  });

  return toUserProfileResponse(updatedUser);
}

/**
 * Delete User Avatar
 * Remove avatar and all its sizes
 */
export async function deleteUserAvatar(userId: string): Promise<UserProfileResponse> {
  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.avatarUrl) {
    throw new NotFoundError('User has no avatar to delete');
  }

  // Delete avatar files
  const filename = extractFilenameFromUrl(user.avatarUrl);
  if (filename) {
    const avatarDir = path.join('storages', 'avatars');
    await deleteImageByFilename(avatarDir, filename);
  }

  // Update user - remove avatar URL
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: null,
    },
  });

  return toUserProfileResponse(updatedUser);
}
