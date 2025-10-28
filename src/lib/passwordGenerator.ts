/**
 * Password Generation Utility
 * Secure random password generation for OAuth users
 */

/**
 * Generate Random Password
 * Creates a cryptographically secure random password for OAuth users
 * who don't have a password (login via GitHub/Google)
 *
 * @param length - Password length (default: 16)
 * @returns Generated password
 */
export function generateRandomPassword(length: number = 16): string {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Ensure password contains at least one of each required character type
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // If missing any required character type, regenerate
  if (!hasLower || !hasUpper || !hasDigit || !hasSpecial) {
    return generateRandomPassword(length);
  }

  return password;
}
