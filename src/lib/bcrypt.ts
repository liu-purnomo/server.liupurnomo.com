import bcrypt from 'bcryptjs';

/**
 * Password Hashing Utilities
 * Secure password hashing using bcrypt with configurable salt rounds
 */

// Salt rounds for password hashing (default: 10)
// Higher = more secure but slower (10-12 recommended for production)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

/**
 * Hash Password (Async - Recommended)
 * Hash a plain text password using bcrypt
 *
 * @param plainPassword - Plain text password to hash
 * @returns Promise with hashed password
 *
 * @example
 * ```typescript
 * const hashed = await hashPassword('myPassword123');
 * ```
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  // Validate input
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  if (plainPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Generate salt and hash (non-blocking)
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Hash Password Sync (Use only if necessary)
 * Synchronous version - blocks the event loop
 *
 * @param plainPassword - Plain text password to hash
 * @returns Hashed password
 *
 * @deprecated Use async hashPassword() instead for better performance
 */
export function hashPasswordSync(plainPassword: string): string {
  // Validate input
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  if (plainPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Generate salt and hash (blocking)
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(plainPassword, salt);
}

/**
 * Compare Password (Async - Recommended)
 * Compare plain text password with hashed password
 *
 * @param plainPassword - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns Promise with true if match, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = await comparePassword('myPassword123', user.passwordHash);
 * if (isValid) {
 *   // Login successful
 * }
 * ```
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  // Validate inputs
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Plain password must be a non-empty string');
  }

  if (!hashedPassword || typeof hashedPassword !== 'string') {
    throw new Error('Hashed password must be a non-empty string');
  }

  // Compare passwords (non-blocking)
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Compare Password Sync (Use only if necessary)
 * Synchronous version - blocks the event loop
 *
 * @param plainPassword - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns true if match, false otherwise
 *
 * @deprecated Use async comparePassword() instead for better performance
 */
export function comparePasswordSync(
  plainPassword: string,
  hashedPassword: string
): boolean {
  // Validate inputs
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Plain password must be a non-empty string');
  }

  if (!hashedPassword || typeof hashedPassword !== 'string') {
    throw new Error('Hashed password must be a non-empty string');
  }

  // Compare passwords (blocking)
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

/**
 * Verify Password Strength
 * Check if password meets minimum security requirements
 *
 * @param password - Password to validate
 * @returns Object with isValid and errors
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
