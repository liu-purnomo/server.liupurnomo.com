import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../utils/errors.js';

/**
 * Rate Limiter Configuration
 * Prevents abuse and ensures fair usage
 */

/**
 * General API Rate Limiter
 * 1000 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Authentication Rate Limiter
 * 50 login attempts per 15 minutes per IP
 * Prevents brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 login attempts per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Registration Rate Limiter
 * 30 registrations per hour per IP
 * Prevents spam account creation
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 registrations per hour
  message: 'Too many accounts created from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Password Reset Rate Limiter
 * 30 password reset requests per hour per IP
 * Prevents spam and abuse
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 password resets per hour
  message: 'Too many password reset requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Email Verification Rate Limiter
 * 50 verification emails per hour per IP
 * Prevents email spam
 */
export const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 verification emails per hour
  message: 'Too many verification emails sent, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * File Upload Rate Limiter
 * 100 uploads per 15 minutes per IP
 * Prevents upload abuse
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 uploads per windowMs
  message: 'Too many file uploads, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Comment Rate Limiter
 * 200 comments per 15 minutes per IP
 * Prevents comment spam
 */
export const commentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 comments per windowMs
  message: 'Too many comments posted, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Search Rate Limiter
 * 300 searches per minute per IP
 * Prevents search abuse
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 searches per minute
  message: 'Too many search requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Strict Rate Limiter
 * 100 requests per minute per IP
 * For sensitive operations
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, _next, options) => {
    throw new RateLimitError(options.message as string);
  },
});

/**
 * Create Custom Rate Limiter
 * Factory function for custom rate limiters
 */
export const createRateLimiter = (
  windowMs: number,
  max: number,
  message?: string
) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, _next, options) => {
      throw new RateLimitError(options.message as string);
    },
  });
};
