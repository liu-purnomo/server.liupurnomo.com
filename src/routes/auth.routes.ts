import { Router } from 'express';
import { authController, googleAuthController } from '../controllers/index.js';
import { authenticate, optionalAuth, validate } from '../middlewares/index.js';
import {
  checkEmailSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../validators/index.js';

/**
 * Authentication Routes
 * All routes for authentication operations
 */

const router = Router();

/**
 * Public Routes (No authentication required)
 */

// Step 1: Check if email exists
router.post(
  '/check-email',
  validate(checkEmailSchema),
  authController.checkEmail
);

// Step 2a: Register new user (if email doesn't exist)
router.post('/register', validate(registerSchema), authController.register);

// Step 2b: Login (if email exists)
router.post('/login', validate(loginSchema), authController.login);

// Forgot password - request reset code
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// Reset password with code
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Verify email with code
router.post(
  '/verify-email',
  validate(verifyEmailSchema),
  authController.verifyEmail
);

// Resend verification code
router.post(
  '/resend-verification',
  validate(resendVerificationSchema),
  authController.resendVerification
);

// Refresh access token
router.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  authController.refreshToken
);

/**
 * Google OAuth Routes
 */

// Initiate Google OAuth
router.get('/google', googleAuthController.initiateGoogleOAuth);

// Google OAuth callback
router.get('/google/callback', ...googleAuthController.googleOAuthCallback);

/**
 * Protected Routes (Authentication required)
 */

// Get current user info
router.get('/me', authenticate, authController.getCurrentUser);

// Change password (for logged-in users)
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// Logout (just for logging, client should delete tokens)
router.post('/logout', optionalAuth, authController.logout);

export default router;
