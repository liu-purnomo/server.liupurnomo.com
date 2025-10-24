import crypto from 'crypto';

/**
 * Token Generation Utilities
 * Generate secure random tokens for various purposes
 */

/**
 * Generate 4-digit Verification Code
 * Used for email verification, password reset, etc.
 *
 * @returns 4-digit string (e.g., "1234")
 */
export function generate4DigitCode(): string {
  // Generate cryptographically secure random number
  const randomBytes = crypto.randomBytes(2);
  const randomNumber = randomBytes.readUInt16BE(0);

  // Convert to 4-digit code (0000-9999)
  const code = (randomNumber % 10000).toString().padStart(4, '0');

  return code;
}

/**
 * Generate Random Token
 * Generate a secure random token of specified length
 *
 * @param length - Length of the token in bytes (default: 32)
 * @returns Hexadecimal token string
 */
export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate UUID
 * Generate a UUID v4
 *
 * @returns UUID string
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}

/**
 * Hash Token
 * Hash a token for secure storage
 * Useful for storing tokens in database
 *
 * @param token - Token to hash
 * @returns SHA-256 hash of the token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Compare Token with Hash
 * Compare a plain token with its hashed version
 *
 * @param plainToken - Plain text token
 * @param hashedToken - Hashed token from database
 * @returns true if they match
 */
export function compareToken(plainToken: string, hashedToken: string): boolean {
  const hash = hashToken(plainToken);
  return hash === hashedToken;
}

/**
 * Get Token Expiration Date
 * Calculate expiration date from now
 *
 * @param minutes - Minutes until expiration (default: 15)
 * @returns Date object
 */
export function getTokenExpiration(minutes: number = 15): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
