import { Request, Response } from 'express';
import passport from '../config/passport.config.js';
import { googleAuthService } from '../services/index.js';
import { GoogleOAuthUserData } from '../types/index.js';
import { logActivity } from '../utils/activityLogger.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Google OAuth Controllers
 * Handle HTTP requests for Google OAuth authentication
 */

/**
 * Initiate Google OAuth
 * GET /api/auth/google
 */
export const initiateGoogleOAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

/**
 * Google OAuth Callback
 * GET /api/auth/google/callback
 */
export const googleOAuthCallback = [
  // Step 1: Passport handles OAuth callback
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=google_auth_failed`,
  }),

  // Step 2: Process the authenticated user
  asyncHandler(async (req: Request, res: Response) => {
    const googleUserData = req.user as unknown as GoogleOAuthUserData;

    if (!googleUserData) {
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=no_user_data`
      );
    }

    try {
      // Handle Google OAuth (register or login)
      const result = await googleAuthService.handleGoogleOAuth(googleUserData);

      // Determine if this was a new registration or existing login
      const isNewUser = !result.user.createdAt ||
        new Date().getTime() - new Date(result.user.createdAt).getTime() < 5000;

      // Log activity
      await logActivity({
        userId: result.user.id,
        action: isNewUser ? 'REGISTER' : 'LOGIN',
        entity: 'User',
        entityId: result.user.id,
        description: isNewUser
          ? `User registered via Google OAuth: ${result.user.username}`
          : `User logged in via Google OAuth: ${result.user.username}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // Redirect to frontend with tokens
      const redirectUrl = new URL(
        '/auth/callback',
        process.env.FRONTEND_URL || 'http://localhost:3000'
      );
      redirectUrl.searchParams.set('accessToken', result.accessToken);
      redirectUrl.searchParams.set('refreshToken', result.refreshToken);
      redirectUrl.searchParams.set('isNewUser', isNewUser.toString());

      res.redirect(redirectUrl.toString());
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=authentication_failed`
      );
    }
  }),
];
