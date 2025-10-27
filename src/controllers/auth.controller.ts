import { Request, Response } from 'express';
import { authService } from '../services/index.js';
import { asyncHandler, logActivity, sendSuccess, sendCreated } from '../utils/index.js';

/**
 * Authentication Controllers
 * Handle HTTP requests for authentication operations
 */

/**
 * Check Email
 * POST /api/auth/check-email
 */
export const checkEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const result = await authService.checkEmail(email);

  return sendSuccess(res, 200, result.message, result);
});

/**
 * Register New User
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, name, password, verificationToken } = req.body;

  const result = await authService.register({
    email,
    username,
    name,
    password,
    verificationToken,
  });

  // Log activity
  await logActivity({
    userId: result.user.id,
    action: 'REGISTER',
    entity: 'User',
    entityId: result.user.id,
    description: `User registered: ${username}`,


    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],

  });

  return sendCreated(res, 'Registration successful. Welcome to Liu Purnomo!', result);
});

/**
 * Login User
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  // Log activity
  await logActivity({
    userId: result.user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: result.user.id,
    description: `User logged in: ${result.user.username}`,


    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],

  });

  return sendSuccess(res, 200, 'Login successful. Welcome back!', result);
});

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await authService.forgotPassword(email);

    return sendSuccess(res, 200, result.message);
  }
);

/**
 * Reset Password
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, token, newPassword } = req.body;

    const result = await authService.resetPassword({
      email,
      token,
      newPassword,
    });

    return sendSuccess(res, 200, result.message);
  }
);

/**
 * Verify Email
 * POST /api/auth/verify-email
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, token } = req.body;

  const result = await authService.verifyEmail({ email, token });

  // Log activity
  await logActivity({
    userId: result.user.id,
    action: 'VERIFY_EMAIL',
    entity: 'User',
    entityId: result.user.id,
    description: `Email verified: ${email}`,


    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],

  });

  return sendSuccess(res, 200, result.message, {
    user: result.user,
  });
});

/**
 * Resend Verification Email
 * POST /api/auth/resend-verification
 */
export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await authService.resendVerification(email);

    return sendSuccess(res, 200, result.message);
  }
);

/**
 * Change Password (for authenticated users)
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId; // From auth middleware
    const { currentPassword, newPassword } = req.body;

    const result = await authService.changePassword(userId, {
      currentPassword,
      newPassword,
    });

    // Log activity
    await logActivity({
      userId,
      action: 'RESET_PASSWORD',
      entity: 'User',
      entityId: userId,
      description: 'User changed password',


      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],

    });

    return sendSuccess(res, 200, result.message);
  }
);

/**
 * Refresh Access Token
 * POST /api/auth/refresh-token
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    return sendSuccess(res, 200, 'Token refreshed successfully', result);
  }
);

/**
 * Get Current User
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId; // From auth middleware

    const user = await authService.getCurrentUser(userId);

    return sendSuccess(res, 200, 'User retrieved successfully', {
      user,
    });
  }
);

/**
 * Logout (Client-side token deletion)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (userId) {
    // Log activity
    await logActivity({
      userId,
      action: 'LOGOUT',
      entity: 'User',
      entityId: userId,
      description: 'User logged out',


      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],

    });
  }

  return sendSuccess(res, 200, 'Logout successful. Please remove tokens from client.');
});
