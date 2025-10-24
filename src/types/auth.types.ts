import { User, UserRole } from '@prisma/client';

/**
 * Authentication Types
 * Type definitions for authentication system
 */

// ==================== REQUEST TYPES ====================

/**
 * Check Email Request
 * Step 1: Check if email exists in the system
 */
export interface CheckEmailRequest {
  email: string;
}

/**
 * Check Email Response
 * Returns whether email exists and next action
 */
export interface CheckEmailResponse {
  exists: boolean;
  email: string;
  nextAction: 'login' | 'register';
  message: string;
}

/**
 * Register Request
 * Step 2 (if email doesn't exist): Complete registration
 */
export interface RegisterRequest {
  email: string;
  username: string;
  name: string;
  password: string;
  verificationToken: string; // 4-digit token sent to email
}

/**
 * Login Request
 * Step 2 (if email exists): Login with password
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Forgot Password Request
 * Request password reset via email
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset Password Request
 * Reset password with token from email
 */
export interface ResetPasswordRequest {
  email: string;
  token: string; // 4-digit token from email
  newPassword: string;
}

/**
 * Verify Email Request
 * Verify email with token
 */
export interface VerifyEmailRequest {
  email: string;
  token: string; // 4-digit token from email
}

/**
 * Resend Verification Email Request
 */
export interface ResendVerificationRequest {
  email: string;
}

/**
 * Change Password Request (for authenticated users)
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

// ==================== RESPONSE TYPES ====================

/**
 * Authentication Response
 * Standard response for login/register
 */
export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Token expiration in seconds
}

/**
 * User Response (without sensitive data)
 */
export interface UserResponse {
  id: string;
  email: string;
  username: string;
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
 * Token Payload for JWT
 */
export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
}

/**
 * Verification Token Stored in Database
 */
export interface VerificationTokenData {
  identifier: string; // Email
  token: string; // 4-digit code
  expires: Date;
  purpose: 'email_verification' | 'password_reset' | 'registration';
}

// ==================== UTILITY TYPES ====================

/**
 * User without password hash
 * Safe user object for responses
 */
export type SafeUser = Omit<User, 'passwordHash'>;

/**
 * OAuth Provider Types
 */
export type OAuthProvider = 'google' | 'github' | 'facebook';

/**
 * OAuth Callback Data
 */
export interface OAuthCallbackData {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}

// ==================== EMAIL TEMPLATE DATA ====================

/**
 * Verification Email Template Data
 */
export interface VerificationEmailData {
  email: string;
  name?: string;
  token: string; // 4-digit code
  expiresIn: number; // Minutes
}

/**
 * Password Reset Email Template Data
 */
export interface PasswordResetEmailData {
  email: string;
  name?: string;
  token: string; // 4-digit code
  expiresIn: number; // Minutes
}

/**
 * Welcome Email Template Data
 */
export interface WelcomeEmailData {
  email: string;
  name: string;
  username: string;
}

/**
 * Google OAuth Temporary Password Email Template Data
 */
export interface GoogleOAuthPasswordEmailData {
  email: string;
  name: string;
  tempPassword: string;
}

// ==================== GOOGLE OAUTH TYPES ====================

/**
 * Google OAuth Profile from Google
 */
export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

/**
 * Google OAuth User Data for Processing
 */
export interface GoogleOAuthUserData {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}
