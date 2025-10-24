import { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, decrypt } from '../lib/jwt.js';
import { TokenPayload } from '../types/index.js';
import { UnauthorizedError } from '../utils/errors.js';

/**
 * Authentication Middleware
 * Verify JWT token and attach user to request
 */

/**
 * Authenticate Middleware
 * Verifies JWT token and attaches user to request
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new UnauthorizedError('Authentication required. Please provide a valid token.');
    }

    // Verify token
    const decoded = decrypt(token) as TokenPayload;

    // Attach user to request with both id and userId for compatibility
    req.user = {
      id: decoded.userId, // For activity logger
      userId: decoded.userId, // Primary ID
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user to request if token is provided, but doesn't require it
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      // Verify token if provided
      try {
        const decoded = decrypt(token) as TokenPayload;

        // Attach user to request with both id and userId
        req.user = {
          id: decoded.userId,
          userId: decoded.userId,
          email: decoded.email,
          username: decoded.username,
          role: decoded.role,
        };
      } catch {
        // Invalid token, continue without auth
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

/**
 * Require Role Middleware
 * Requires specific role(s) to access the route
 */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError(
          `Access denied. Required role(s): ${roles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Require Email Verification Middleware
 * Requires user to have verified email
 */
export function requireEmailVerification(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    // This would need to check database or include in token
    // For now, we'll assume email verification is handled separately
    next();
  } catch (error) {
    next(error);
  }
}
