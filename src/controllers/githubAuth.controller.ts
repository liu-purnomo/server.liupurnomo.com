import { Request, Response } from 'express';
import passport from '../config/passport.config.js';
import { githubAuthService } from '../services/index.js';
import { GitHubOAuthUserData } from '../types/index.js';
import { logActivity } from '../utils/activityLogger.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * GitHub OAuth Controllers
 * Handle HTTP requests for GitHub OAuth authentication
 */

/**
 * Initiate GitHub OAuth
 * GET /api/auth/github
 */
export const initiateGitHubOAuth = passport.authenticate('github', {
  scope: ['user:email', 'read:user'],
  session: false,
});

/**
 * GitHub OAuth Callback
 * GET /api/auth/github/callback
 */
export const githubOAuthCallback = [
  // Step 1: Passport handles OAuth callback
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=github_auth_failed`,
  }),

  // Step 2: Process the authenticated user
  asyncHandler(async (req: Request, res: Response) => {
    const githubUserData = req.user as unknown as GitHubOAuthUserData;

    if (!githubUserData) {
      return res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=no_user_data`
      );
    }

    try {
      // Handle GitHub OAuth (register or login)
      const result = await githubAuthService.handleGitHubOAuth(githubUserData);

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
          ? `User registered via GitHub OAuth: ${result.user.username}`
          : `User logged in via GitHub OAuth: ${result.user.username}`,
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
      console.error('GitHub OAuth error:', error);
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login?error=authentication_failed`
      );
    }
  }),
];
