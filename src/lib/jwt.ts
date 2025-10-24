/**
 * JWT Utilities
 * Simple JWT token encryption and decryption
 */

import jwt from 'jsonwebtoken';

// JWT secret key and expiration from environment variables
const SECRET_KEY = process.env.JWT_SECRET as string;
const EXPIRATION_TIME: any = process.env.JWT_EXPIRATION || '30d';

/**
 * Encrypt payload into JWT token
 */
export const encrypt = (payload: string | object | Buffer): string => {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
};

/**
 * Decrypt JWT token into original payload
 */
export const decrypt = (token: string): any => {
  if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return jwt.verify(token, SECRET_KEY);
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7).trim() || null;
};
