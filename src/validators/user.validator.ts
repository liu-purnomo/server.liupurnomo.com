import { UserRole } from '@prisma/client';
import { z } from 'zod';

/**
 * User Validators
 * Zod schemas for validating user management requests
 */

// ==================== CONSTANTS ====================

/**
 * Reserved usernames that cannot be used
 * Prevents users from claiming system/admin-related usernames
 */
const RESERVED_USERNAMES = [
  'admin',
  'superadmin',
  'administrator',
  'root',
  'system',
  'support',
  'help',
  'info',
  'api',
  'www',
  'mail',
  'ftp',
  'localhost',
  'moderator',
  'mod',
] as const;

// ==================== REUSABLE SCHEMAS ====================

/**
 * Username Schema
 * Alphanumeric with underscores, 3-30 characters
 * Prevents reserved usernames from being used
 */
const usernameSchema = z
  .string({ message: 'Username must be a string' })
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be at most 30 characters long')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )
  .trim()
  .refine(
    (value) => !RESERVED_USERNAMES.includes(value.toLowerCase() as any),
    'This username is reserved and cannot be used'
  );

/**
 * Name Schema
 * User's display name
 */
const nameSchema = z
  .string({ message: 'Name must be a string' })
  .min(1, 'Name must not be empty')
  .max(100, 'Name must be at most 100 characters long')
  .trim();

/**
 * Email Schema
 * Validates email format
 */
const emailSchema = z.email('Invalid email format').toLowerCase().trim();

/**
 * Bio Schema
 * User biography/description
 */
const bioSchema = z
  .string({ message: 'Bio must be a string' })
  .max(500, 'Bio must be at most 500 characters long')
  .trim();

/**
 * Location Schema
 * User's location
 */
const locationSchema = z
  .string({ message: 'Location must be a string' })
  .max(100, 'Location must be at most 100 characters long')
  .trim();

/**
 * Avatar URL Schema
 * User's avatar image URL
 */
const avatarUrlSchema = z
  .string({ message: 'Avatar URL must be a string' })
  .url('Invalid avatar URL format')
  .trim();

/**
 * User Role Schema
 * Validates user role enum
 */
const userRoleSchema = z.nativeEnum(UserRole, {
  message: 'Invalid user role. Must be ADMIN, AUTHOR, or USER',
});

// ==================== REQUEST VALIDATORS ====================

/**
 * Update Profile Validator
 * For users updating their own profile
 */
export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  name: nameSchema.optional(),
  bio: bioSchema.optional(),
  location: locationSchema.optional(),
  avatarUrl: avatarUrlSchema.optional(),
});

/**
 * Admin Update User Validator
 * For admins updating any user
 */
export const adminUpdateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  bio: bioSchema.optional(),
  location: locationSchema.optional(),
  avatarUrl: avatarUrlSchema.optional(),
  role: userRoleSchema.optional(),
  isActive: z.boolean().optional(),
});

/**
 * Get Users Query Validator
 * For filtering and pagination
 */
export const getUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, 'Page must be at least 1')),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must be at most 100')
    ),
  role: userRoleSchema.optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return undefined;
      return val === 'true';
    })
    .pipe(z.boolean().optional()),
  search: z
    .string()
    .trim()
    .min(1, 'Search query must not be empty')
    .max(100, 'Search query must be at most 100 characters')
    .optional(),
});

/**
 * User ID Param Validator
 * For validating user ID in URL params
 */
export const userIdParamSchema = z.object({
  id: z.string().cuid('Invalid user ID format'),
});

/**
 * Username Param Validator
 * For validating username in URL params
 */
export const usernameParamSchema = z.object({
  username: usernameSchema,
});
