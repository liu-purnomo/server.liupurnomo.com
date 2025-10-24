import crypto from 'crypto';
import { hashPassword } from '../lib/bcrypt.js';
import { sendEmail } from '../lib/email.js';
import { encrypt } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import { AuthResponse, GitHubOAuthUserData } from '../types/index.js';
import { githubOAuthPasswordTemplate } from '../utils/emailTemplates.js';

/**
 * GitHub OAuth Service
 * Business logic for GitHub OAuth authentication
 */

/**
 * Generate Random Secure Password
 * Creates a strong random password for GitHub OAuth users
 */
function generateRandomPassword(): string {
  const length = 16;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const byte = randomBytes[i];
    if (byte !== undefined) {
      password += charset[byte % charset.length];
    }
  }

  // Ensure password has at least one of each required character type
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/.test(password);

  // If password doesn't meet requirements, generate new one (recursive)
  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
    return generateRandomPassword();
  }

  return password;
}

/**
 * Generate Username from GitHub Username or Email
 * Creates a unique username based on GitHub username or email
 */
async function generateUsernameFromGitHub(
  githubUsername: string,
  email: string
): Promise<string> {
  // Try to use GitHub username first
  let baseUsername = githubUsername.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  // If GitHub username is empty, use email
  if (!baseUsername || baseUsername.length < 3) {
    const emailPart = email.split('@')[0];
    if (!emailPart) {
      throw new Error('Invalid email format');
    }
    baseUsername = emailPart.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  }

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
 * Handle GitHub OAuth Authentication
 * Main logic for GitHub OAuth login/register flow
 *
 * Flow:
 * 1. User not registered: Auto-register → email verified → generate random password → send email
 * 2. User registered but email not verified: Auto-verify email
 * 3. User registered & verified: Normal login
 */
export async function handleGitHubOAuth(
  githubData: GitHubOAuthUserData
): Promise<AuthResponse> {
  const {
    githubId,
    email,
    name,
    username: githubUsername,
    avatarUrl,
    bio,
    location,
    accessToken,
    refreshToken
  } = githubData;

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email },
  });

  // CASE 1: User doesn't exist - Auto Register
  if (!user) {
    // Generate random secure password
    const tempPassword = generateRandomPassword();
    const passwordHash = await hashPassword(tempPassword);

    // Generate unique username from GitHub username or email
    const username = await generateUsernameFromGitHub(githubUsername, email);

    // Create user with verified email
    user = await prisma.user.create({
      data: {
        email,
        username,
        name: name || username,
        passwordHash,
        avatarUrl: avatarUrl || null,
        bio: bio || null,
        location: location || null,
        emailVerifiedAt: new Date(), // Auto-verify for GitHub OAuth
        accounts: {
          create: {
            type: 'oauth',
            provider: 'github',
            providerAccountId: githubId,
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
      html: githubOAuthPasswordTemplate(name || username, email, tempPassword),
    }).catch((error) => {
      console.error('Failed to send GitHub OAuth password email:', error);
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

  // Check if GitHub account is already linked
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: 'github',
        providerAccountId: githubId,
      },
    },
  });

  // Link GitHub account if not linked
  if (!existingAccount) {
    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'github',
        providerAccountId: githubId,
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
          provider: 'github',
          providerAccountId: githubId,
        },
      },
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  }

  // Update user info if not set
  if (avatarUrl && !user.avatarUrl) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        avatarUrl,
        bio: bio && !user.bio ? bio : user.bio,
        location: location && !user.location ? location : user.location,
      },
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
