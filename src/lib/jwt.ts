import * as jwt from 'jsonwebtoken';
import { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

/**
 * JWT Utilities
 * Secure JWT token generation and verification with proper error handling
 */

// JWT secret key from environment variable
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION: SignOptions['expiresIn'] = (process.env.JWT_EXPIRATION || '30d') as SignOptions['expiresIn'];

/**
 * Validate JWT Secret
 * Throws error if JWT_SECRET is not configured
 */
function validateSecret(): string {
  if (!JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not configured in environment variables. Please set JWT_SECRET in .env file.'
    );
  }

  if (JWT_SECRET.length < 32) {
    console.warn(
      '⚠️ WARNING: JWT_SECRET is too short. Use at least 32 characters for security.'
    );
  }

  return JWT_SECRET;
}

/**
 * JWT Token Payload Interface
 * Extend this interface with your custom payload
 */
export interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * JWT Result Interface
 */
export interface JWTResult<T = TokenPayload> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Generate JWT Token
 * Creates a signed JWT token with the provided payload
 *
 * @param payload - Data to encode in the token
 * @param options - Optional JWT sign options (expiresIn, audience, etc)
 * @returns Signed JWT token string
 *
 * @example
 * ```typescript
 * const token = generateToken({
 *   userId: user.id,
 *   email: user.email,
 *   role: user.role
 * });
 * ```
 */
export function generateToken(
  payload: TokenPayload,
  options?: SignOptions
): string {
  const secret = validateSecret();

  // Sign the token with merged options
  return jwt.sign(payload, secret, {
    expiresIn: JWT_EXPIRATION,
    ...options, // Override default if provided
  });
}

/**
 * Verify JWT Token
 * Verifies and decodes a JWT token
 *
 * @param token - JWT token to verify
 * @param options - Optional JWT verify options
 * @returns Result object with decoded payload or error
 *
 * @example
 * ```typescript
 * const result = verifyToken(token);
 * if (result.success) {
 *   console.log('User ID:', result.data.userId);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export function verifyToken<T = TokenPayload>(
  token: string,
  options?: VerifyOptions
): JWTResult<T> {
  try {
    const secret = validateSecret();

    // Verify and decode token
    const decoded = jwt.verify(token, secret, options) as T;

    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: 'Token has expired',
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        error: 'Invalid token',
      };
    }

    if (error instanceof jwt.NotBeforeError) {
      return {
        success: false,
        error: 'Token not active yet',
      };
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Token verification failed',
    };
  }
}

/**
 * Decode JWT Token (Without Verification)
 * Decodes a JWT token without verifying the signature
 * ⚠️ WARNING: Only use this for debugging or inspection, not for authentication!
 *
 * @param token - JWT token to decode
 * @returns Decoded payload or null
 *
 * @example
 * ```typescript
 * const payload = decodeToken(token);
 * console.log('Token expires at:', payload?.exp);
 * ```
 */
export function decodeToken<T = TokenPayload>(token: string): T | null {
  try {
    return jwt.decode(token) as T;
  } catch {
    return null;
  }
}

/**
 * Generate Refresh Token
 * Creates a long-lived refresh token (typically 7-30 days)
 *
 * @param payload - Data to encode in the refresh token
 * @param expiresIn - Expiration time (default: 7d)
 * @returns Signed refresh token string
 *
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken({
 *   userId: user.id
 * }, '7d');
 * ```
 */
export function generateRefreshToken(
  payload: TokenPayload,
  expiresIn: SignOptions['expiresIn'] = '7d'
): string {
  return generateToken(payload, { expiresIn });
}

/**
 * Extract Token from Authorization Header
 * Extracts JWT token from "Bearer <token>" format
 *
 * @param authHeader - Authorization header value
 * @returns Extracted token or null
 *
 * @example
 * ```typescript
 * const token = extractTokenFromHeader(req.headers.authorization);
 * if (token) {
 *   const result = verifyToken(token);
 * }
 * ```
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  // Extract token part
  const token = authHeader.substring(7); // Remove "Bearer " prefix

  return token.trim() || null;
}

/**
 * Check if Token is Expired
 * Checks if a token is expired without throwing an error
 *
 * @param token - JWT token to check
 * @returns true if expired, false if valid
 *
 * @example
 * ```typescript
 * if (isTokenExpired(token)) {
 *   // Request new token
 * }
 * ```
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeToken<JwtPayload>(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Get Token Expiration Date
 * Returns the expiration date of a token
 *
 * @param token - JWT token
 * @returns Date object or null
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = decodeToken<JwtPayload>(token);
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Legacy Support: encrypt (deprecated)
 * @deprecated Use generateToken() instead
 */
export const encrypt = generateToken;

/**
 * Legacy Support: decrypt (deprecated)
 * @deprecated Use verifyToken() instead
 */
export function decrypt(token: string): any {
  const result = verifyToken(token);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}
