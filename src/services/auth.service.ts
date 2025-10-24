import { User } from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/bcrypt.js';
import { sendEmail } from '../lib/email.js';
import { encrypt, decrypt } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import {
  AuthResponse,
  CheckEmailResponse,
  TokenPayload,
  UserResponse,
} from '../types/index.js';
import {
  registrationVerificationTemplate,
  emailVerificationTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate,
  passwordChangedTemplate,
} from '../utils/emailTemplates.js';
import { AppError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors.js';
import {
  generate4DigitCode,
  getTokenExpiration,
} from '../utils/token.js';

/**
 * Authentication Service
 * Business logic for authentication operations
 */

const TOKEN_EXPIRATION_MINUTES = 15;

/**
 * Convert User to User Response
 */
function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    role: user.role,
    isActive: user.isActive,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Generate Auth Response with Tokens
 */
function generateAuthResponse(user: User): AuthResponse {
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const accessToken = encrypt(tokenPayload);
  const refreshToken = encrypt(tokenPayload);

  return {
    user: toUserResponse(user),
    accessToken,
    refreshToken,
    expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
  };
}

/**
 * Check if Email Exists
 * Step 1: Check if email is registered
 */
export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      exists: true,
      email,
      nextAction: 'login',
      message: 'Email is registered. Please login with your password.',
    };
  }

  // Email doesn't exist, send verification code for registration
  const verificationToken = generate4DigitCode();
  const expires = getTokenExpiration(TOKEN_EXPIRATION_MINUTES);

  // Store verification token in database
  await prisma.verificationToken.upsert({
    where: {
      identifier_token: {
        identifier: email,
        token: verificationToken,
      },
    },
    update: {
      expires,
    },
    create: {
      identifier: email,
      token: verificationToken,
      expires,
    },
  });

  // Send verification email
  const emailResult = await sendEmail({
    to: email,
    subject: 'Verify Your Email - Liu Purnomo',
    html: registrationVerificationTemplate(
      verificationToken,
      TOKEN_EXPIRATION_MINUTES
    ),
  });

  if (!emailResult.success) {
    throw new AppError('Failed to send verification email. Please try again.', 500);
  }

  return {
    exists: false,
    email,
    nextAction: 'register',
    message: `Verification code sent to ${email}. Please check your email and complete registration.`,
  };
}

/**
 * Register New User
 * Step 2 (if email doesn't exist): Complete registration
 */
export async function register(data: {
  email: string;
  username: string;
  name: string;
  password: string;
  verificationToken: string;
}): Promise<AuthResponse> {
  const { email, username, name, password, verificationToken } = data;

  // Verify token
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token: verificationToken,
      },
    },
  });

  if (!tokenRecord) {
    throw new UnauthorizedError('Invalid or expired verification code');
  }

  if (tokenRecord.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: verificationToken,
        },
      },
    });
    throw new UnauthorizedError('Verification code has expired. Please request a new one.');
  }

  // Check if email already exists
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new ConflictError('Email is already registered');
  }

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new ConflictError('Username is already taken');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      name,
      passwordHash,
      emailVerifiedAt: new Date(), // Auto-verify since they used the token
    },
  });

  // Delete verification token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token: verificationToken,
      },
    },
  });

  // Send welcome email (don't await, send in background)
  sendEmail({
    to: email,
    subject: 'Welcome to Liu Purnomo! 🎉',
    html: welcomeEmailTemplate(name, username),
  }).catch((error) => {
    console.error('Failed to send welcome email:', error);
  });

  // Return auth response with tokens
  return generateAuthResponse(user);
}

/**
 * Login User
 * Step 2 (if email exists): Login with password
 */
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Return auth response with tokens
  return generateAuthResponse(user);
}

/**
 * Forgot Password
 * Send password reset code to email
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return {
      message: 'If the email exists, a password reset code has been sent.',
    };
  }

  // Generate reset token
  const resetToken = generate4DigitCode();
  const expires = getTokenExpiration(TOKEN_EXPIRATION_MINUTES);

  // Store reset token
  await prisma.verificationToken.upsert({
    where: {
      identifier_token: {
        identifier: email,
        token: resetToken,
      },
    },
    update: {
      expires,
    },
    create: {
      identifier: email,
      token: resetToken,
      expires,
    },
  });

  // Send reset email
  const emailResult = await sendEmail({
    to: email,
    subject: 'Reset Your Password - Liu Purnomo',
    html: passwordResetTemplate(
      user.name || user.username,
      resetToken,
      TOKEN_EXPIRATION_MINUTES
    ),
  });

  if (!emailResult.success) {
    throw new AppError('Failed to send password reset email. Please try again.', 500);
  }

  return {
    message: 'If the email exists, a password reset code has been sent.',
  };
}

/**
 * Reset Password
 * Reset password with token from email
 */
export async function resetPassword(data: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const { email, token, newPassword } = data;

  // Verify token
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  if (!tokenRecord) {
    throw new UnauthorizedError('Invalid or expired reset code');
  }

  if (tokenRecord.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });
    throw new UnauthorizedError('Reset code has expired. Please request a new one.');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Delete reset token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  // Send confirmation email (don't await)
  sendEmail({
    to: email,
    subject: 'Password Changed - Liu Purnomo',
    html: passwordChangedTemplate(user.name || user.username),
  }).catch((error) => {
    console.error('Failed to send password changed email:', error);
  });

  return {
    message: 'Password has been reset successfully. You can now login with your new password.',
  };
}

/**
 * Verify Email
 * Verify email address with token
 */
export async function verifyEmail(data: {
  email: string;
  token: string;
}): Promise<{ message: string; user: UserResponse }> {
  const { email, token } = data;

  // Verify token
  const tokenRecord = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  if (!tokenRecord) {
    throw new UnauthorizedError('Invalid or expired verification code');
  }

  if (tokenRecord.expires < new Date()) {
    // Delete expired token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });
    throw new UnauthorizedError('Verification code has expired. Please request a new one.');
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update email verified status
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date() },
  });

  // Delete verification token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: email,
        token,
      },
    },
  });

  return {
    message: 'Email verified successfully',
    user: toUserResponse(updatedUser),
  };
}

/**
 * Resend Verification Email
 */
export async function resendVerification(email: string): Promise<{ message: string }> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if email exists
    return {
      message: 'If the email exists, a new verification code has been sent.',
    };
  }

  if (user.emailVerifiedAt) {
    throw new ConflictError('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = generate4DigitCode();
  const expires = getTokenExpiration(TOKEN_EXPIRATION_MINUTES);

  // Store verification token
  await prisma.verificationToken.upsert({
    where: {
      identifier_token: {
        identifier: email,
        token: verificationToken,
      },
    },
    update: {
      expires,
    },
    create: {
      identifier: email,
      token: verificationToken,
      expires,
    },
  });

  // Send verification email
  const emailResult = await sendEmail({
    to: email,
    subject: 'Verify Your Email - Liu Purnomo',
    html: emailVerificationTemplate(
      user.name || user.username,
      verificationToken,
      TOKEN_EXPIRATION_MINUTES
    ),
  });

  if (!emailResult.success) {
    throw new AppError('Failed to send verification email. Please try again.', 500);
  }

  return {
    message: 'If the email exists, a new verification code has been sent.',
  };
}

/**
 * Change Password (for authenticated users)
 */
export async function changePassword(
  userId: string,
  data: { currentPassword: string; newPassword: string }
): Promise<{ message: string }> {
  const { currentPassword, newPassword } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Send confirmation email (don't await)
  sendEmail({
    to: user.email,
    subject: 'Password Changed - Liu Purnomo',
    html: passwordChangedTemplate(user.name || user.username),
  }).catch((error) => {
    console.error('Failed to send password changed email:', error);
  });

  return {
    message: 'Password changed successfully',
  };
}

/**
 * Refresh Access Token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  // Verify refresh token
  const decoded = decrypt(refreshToken) as TokenPayload;

  // Find user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  // Generate new access token
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const accessToken = encrypt(tokenPayload);

  return {
    accessToken,
    expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
  };
}

/**
 * Get Current User
 */
export async function getCurrentUser(userId: string): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toUserResponse(user);
}

