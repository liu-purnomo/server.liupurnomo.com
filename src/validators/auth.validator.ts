import { z } from 'zod';

/**
 * Authentication Validators
 * Zod schemas for validating authentication requests
 */

// ==================== REUSABLE SCHEMAS ====================

/**
 * Email Schema
 * Validates email format
 */
const emailSchema = z.email('Invalid email format').toLowerCase().trim();

/**
 * Password Schema
 * Strong password validation
 */
const passwordSchema = z
  .string({ message: 'Password must be a string' })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/,
    'Password must contain at least one special character'
  );

/**
 * Username Schema
 * Alphanumeric with underscores, 3-30 characters
 */
const usernameSchema = z
  .string({ message: 'Username must be a string' })
  .min(3, 'Username must be at least 3 characters long')
  .max(30, 'Username must be at most 30 characters long')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )
  .trim();

/**
 * Name Schema
 * User's display name
 */
const nameSchema = z
  .string({ message: 'Name must be a string' })
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name must be at most 100 characters long')
  .trim();

/**
 * Verification Token Schema
 * 4-digit code sent to email
 */
const tokenSchema = z
  .string({ message: 'Verification token must be a string' })
  .length(4, 'Token must be exactly 4 digits')
  .regex(/^[0-9]{4}$/, 'Token must be 4 digits');

// ==================== REQUEST VALIDATORS ====================

/**
 * Check Email Validator
 * POST /api/auth/check-email
 */
export const checkEmailSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

/**
 * Register Validator
 * POST /api/auth/register
 */
export const registerSchema = z.object({
  body: z.object({
    email: emailSchema,
    username: usernameSchema,
    name: nameSchema,
    password: passwordSchema,
    verificationToken: tokenSchema,
  }),
});

/**
 * Login Validator
 * POST /api/auth/login
 */
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string({ message: 'Password is required' }),
  }),
});

/**
 * Forgot Password Validator
 * POST /api/auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

/**
 * Reset Password Validator
 * POST /api/auth/reset-password
 */
export const resetPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
    token: tokenSchema,
    newPassword: passwordSchema,
  }),
});

/**
 * Verify Email Validator
 * POST /api/auth/verify-email
 */
export const verifyEmailSchema = z.object({
  body: z.object({
    email: emailSchema,
    token: tokenSchema,
  }),
});

/**
 * Resend Verification Validator
 * POST /api/auth/resend-verification
 */
export const resendVerificationSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

/**
 * Change Password Validator (for authenticated users)
 * POST /api/auth/change-password
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string({ message: 'Current password is required' }),
    newPassword: passwordSchema,
  }),
});

/**
 * Refresh Token Validator
 * POST /api/auth/refresh-token
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ message: 'Refresh token is required' }),
  }),
});

// ==================== TYPE EXPORTS ====================

export type CheckEmailInput = z.infer<typeof checkEmailSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
