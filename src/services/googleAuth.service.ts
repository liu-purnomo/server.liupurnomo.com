import { hashPassword } from '../lib/bcrypt.js';
import { sendEmail } from '../lib/email.js';
import { encrypt } from '../lib/jwt.js';
import { generateRandomPassword } from '../lib/passwordGenerator.js';
import { prisma } from '../lib/prisma.js';
import { AuthResponse, GoogleOAuthUserData } from '../types/index.js';
import { googleOAuthPasswordTemplate } from '../utils/emailTemplates.js';

/**
 * Google OAuth Service
 * Business logic for Google OAuth authentication
 */

/**
 * Generate Username from Email
 * Creates a unique username based on email
 */
async function generateUsernameFromEmail(email: string): Promise<string> {
  // Extract base username from email
  const emailPart = email.split('@')[0];
  if (!emailPart) {
    throw new Error('Invalid email format');
  }
  const baseUsername = emailPart.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  // Check if username exists
  let username = baseUsername;
  let counter = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      break;
    }

    // Append counter if username exists
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
}

/**
 * Handle Google OAuth Authentication
 * Main logic for Google OAuth login/register flow
 *
 * Flow:
 * 1. User not registered: Auto-register → email verified → generate random password → send email
 * 2. User registered but email not verified: Auto-verify email
 * 3. User registered & verified: Normal login
 */
export async function handleGoogleOAuth(
  googleData: GoogleOAuthUserData
): Promise<AuthResponse> {
  const { googleId, email, name, avatarUrl, accessToken, refreshToken } = googleData;

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // CASE 1: User doesn't exist - Auto Register
  if (!user) {
    // Generate random secure password
    const tempPassword = generateRandomPassword();
    const passwordHash = await hashPassword(tempPassword);

    // Generate unique username from email
    const username = await generateUsernameFromEmail(email);

    // Create user with verified email
    user = await prisma.user.create({
      data: {
        email,
        username,
        name: name || username,
        passwordHash,
        avatarUrl: avatarUrl || null,
        emailVerifiedAt: new Date(), // Auto-verify for Google OAuth
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: googleId,
            access_token: accessToken,
            refresh_token: refreshToken,
            token_type: 'Bearer',
          },
        },
      },
    });

    // Send temporary password to email (don't await, send in background)
    sendEmail({
      to: email,
      subject: 'Your Account is Ready - Temporary Password',
      html: googleOAuthPasswordTemplate(name || username, email, tempPassword),
    }).catch((error) => {
      console.error('Failed to send Google OAuth password email:', error);
    });

    // Return auth response
    return generateAuthResponse(user);
  }

  // CASE 2: User exists but email not verified - Auto Verify
  if (!user.emailVerifiedAt) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date() },
    });
  }

  // Check if Google account is already linked
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'google',
        providerAccountId: googleId,
      },
    },
  });

  // Link Google account if not linked
  if (!existingAccount) {
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'google',
        providerAccountId: googleId,
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      },
    });
  } else {
    // Update existing account tokens
    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId: googleId,
        },
      },
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }

  // Update user avatar if not set
  if (avatarUrl && !user.avatarUrl) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    });
  }

  // CASE 3: Normal login for existing user
  return generateAuthResponse(user);
}

/**
 * Generate Auth Response with Tokens
 * Reuse from auth.service.ts
 */
function generateAuthResponse(user: any): AuthResponse {
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const accessToken = encrypt(tokenPayload);
  const refreshToken = encrypt(tokenPayload);

  return {
    user: {
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
    },
    accessToken,
    refreshToken,
    expiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
  };
}
