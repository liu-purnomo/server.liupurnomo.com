/**
 * User Types
 * Type definitions for user management system
 */

import { UserRole } from '@prisma/client';

// ==================== REQUEST TYPES ====================

/**
 * Update User Profile Request
 * Allows users to update their own profile information
 */
export interface UpdateProfileRequest {
  username?: string;
  name?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

/**
 * Admin Update User Request
 * Allows admins to update any user with extended permissions
 */
export interface AdminUpdateUserRequest {
  name?: string;
  email?: string;
  username?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  role?: UserRole;
  isActive?: boolean;
}

/**
 * Get Users Query Parameters
 * Filtering and pagination for user list
 */
export interface GetUsersQuery {
  page?: number;
  limit?: number;
  role?: UserRole;
  isActive?: boolean;
  search?: string; // Search by name, username, or email
}

// ==================== RESPONSE TYPES ====================

/**
 * Public User Response
 * Limited user information visible to everyone
 */
export interface PublicUserResponse {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  role: UserRole;
  createdAt: Date;
}

/**
 * User Profile Response
 * Full user information for authenticated users viewing their own profile
 */
export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Admin User Response
 * Extended user information for admins
 */
export interface AdminUserResponse extends UserProfileResponse {
  // Includes all UserProfileResponse fields plus:
  // (Currently same as UserProfileResponse, but can be extended)
}

/**
 * User List Item Response
 * Compact user information for lists
 */
export interface UserListItemResponse {
  id: string;
  username: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}
