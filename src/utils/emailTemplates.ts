/**
 * Email Templates
 * HTML templates for various email types
 */

/**
 * Base Email Template
 * Wraps content in a responsive HTML email layout
 */
function baseTemplate(content: string): string {
  // Modern, clean system font stack
  const fontStack =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liu Purnomo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: ${fontStack};
      background-color: #f4f4f7; /* Lighter, cleaner background */
      color: #1f2937; /* Darker text for better contrast */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px; /* Slightly more rounded */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e5e7eb; /* Subtle border */
    }
    .header {
      /* Removed gradient for a cleaner, solid look */
      background-color: #ffffff;
      padding: 32px 36px;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #111827; /* Dark text */
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 36px;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #374151;
    }
    .content ul {
      margin-bottom: 20px;
      padding-left: 20px;
    }
    .code-box {
      background-color: #f3f4f6; /* Lighter grey */
      border: 1px solid #e5e7eb; /* Solid, light border */
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 32px;
      font-weight: 700;
      color: #4f46e5; /* Modern indigo */
      letter-spacing: 6px;
      /* Better monospace font stack */
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      /* Solid, modern color */
      background-color: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.2s ease;
    }
    /* Note: :hover works in some, but not all, email clients */
    .button:hover {
      background-color: #4338ca;
    }
    .footer {
      background-color: #f9fafb; /* Light footer bg */
      padding: 32px 36px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 500;
    }
    .warning {
      background-color: #fefce8; /* Lighter yellow */
      border-left: 4px solid #facc15; /* Brighter yellow */
      padding: 16px;
      margin: 24px 0;
      font-size: 14px;
      color: #713f12; /* Darker text for contrast */
      border-radius: 0 4px 4px 0;
    }
    .warning strong {
      color: #713f12;
    }
    .info-box {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #4f46e5;
    }
    .info-box p {
      margin: 5px 0 0 0;
      color: #374151;
      font-size: 15px;
    }
    .link-box {
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      word-break: break-all;
      font-size: 12px;
      color: #4f46e5;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    }

    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px;
        width: auto !important;
      }
      .content {
        padding: 30px 20px;
      }
      .code {
        font-size: 24px;
        letter-spacing: 4px;
      }
      .header {
        padding: 24px 20px;
      }
      .footer {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Liu Purnomo</h1>
    </div>
    ${content}
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Liu Purnomo. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Registration Verification Email Template
 * Sent when user checks email and it doesn't exist
 */
export function registrationVerificationTemplate(
  token: string,
  expiresIn: number = 15
): string {
  const content = `
    <div class="content">
      <h2>Welcome! Verify Your Email</h2>
      <p>Thank you for starting your registration with Liu Purnomo. To complete the process, please use the verification code below:</p>

      <div class="code-box">
        <div class="code">${token}</div>
        <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
          This code expires in ${expiresIn} minutes
        </p>
      </div>

      <p>Enter this code on the registration page to continue setting up your account.</p>

      <div class="warning">
        <strong>Security Notice:</strong> Never share this code with anyone. Liu Purnomo staff will never ask for this code.
      </div>
    </div>
  `;

  return baseTemplate(content);
}

/**
 * Email Verification Template
 * Sent when user needs to verify their email address
 */
export function emailVerificationTemplate(
  name: string,
  token: string,
  expiresIn: number = 15
): string {
  const content = `
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email address to activate your account and start using Liu Purnomo.</p>

      <div class="code-box">
        <div class="code">${token}</div>
        <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
          This code expires in ${expiresIn} minutes
        </p>
      </div>

      <p>Enter this code on the verification page to confirm your email address.</p>

      <div class="warning">
        <strong>Security Notice:</strong> If you didn't create this account, please ignore this email.
      </div>
    </div>
  `;

  return baseTemplate(content);
}

/**
 * Password Reset Email Template
 * Sent when user requests password reset with link
 */
export function passwordResetTemplate(
  name: string,
  email: string,
  token: string,
  expiresIn: number = 15
): string {
  const resetUrl = `${
    process.env.FRONTEND_URL || 'http://localhost:3000'
  }/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  const content = `
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password. This link is valid for ${expiresIn} minutes.</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">
          Reset Password
        </a>
      </p>

      <p style="font-size: 14px; color: #6b7280;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <div class="link-box">
        ${resetUrl}
      </div>

      <div class="warning">
        <strong>Important:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure.
      </div>
    </div>
  `;

  return baseTemplate(content);
}

/**
 * Welcome Email Template
 * Sent after successful registration
 */
export function welcomeEmailTemplate(name: string, username: string): string {
  const content = `
    <div class="content">
      <h2>Welcome to Liu Purnomo! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Congratulations! Your account has been successfully created. We're excited to have you on board.</p>

      <div class="info-box">
        <h3>Your Account Details</h3>
        <p><strong>Username:</strong> @${username}</p>
        <p><strong>Email:</strong> Verified ✓</p>
      </div>

      <p>You're now ready to:</p>
      <ul style="line-height: 1.8; color: #374151;">
        <li>Write and publish blog posts</li>
        <li>Create tutorials and guides</li>
        <li>Engage with the community</li>
        <li>Bookmark your favorite content</li>
      </ul>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${
          process.env.FRONTEND_URL || 'http://localhost:3000'
        }" class="button">
          Get Started
        </a>
      </p>
    </div>
  `;

  return baseTemplate(content);
}

/**
 * Password Changed Notification Template
 * Sent when user successfully changes password
 */
export function passwordChangedTemplate(name: string): string {
  const content = `
    <div class="content">
      <h2>Password Changed Successfully</h2>
      <p>Hi ${name},</p>
      <p>This email confirms that your password for your Liu Purnomo account was changed successfully.</p>

      <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0; border-radius: 0 4px 4px 0;">
        <strong style="color: #15803d;">Security Confirmed:</strong>
        <p style="margin: 10px 0 0 0; color: #166534; font-size: 15px;">Your password has been updated and your account is secure.</p>
      </div>

      <div class="warning">
        <strong>Important:</strong> If you didn't make this change, please contact our support team immediately and secure your account.
      </div>
    </div>
  `;

  return baseTemplate(content);
}

/**
 * Google OAuth Temporary Password Template
 * Sent when user registers via Google OAuth
 */
export function googleOAuthPasswordTemplate(
  name: string,
  email: string
): string {
  const content = `
    <div class="content">
      <h2>Welcome! Your Account is Ready</h2>
      <p>Hi ${name},</p>
      <p>You've successfully signed in with Google. Your account has been created and your email is verified.</p>

      <div class="info-box">
        <h3>Your Account Details</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Email Status:</strong> Verified ✓ (via Google)</p>
      </div>

      <div class="warning">
        <strong>Security Notice:</strong> For future reference, you can always log in using Google. If you wish to set a password for standard login, please use the "Forgot Password" feature or set one in your profile settings.
      </div>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${
          process.env.FRONTEND_URL || 'http://localhost:3000'
        }" class="button">
          Go to Dashboard
        </a>
      </p>
    </div>
  `;

  return baseTemplate(content);
}

/**
 * GitHub OAuth Temporary Password Template
 * Sent when user registers via GitHub OAuth
 */
export function githubOAuthPasswordTemplate(
  name: string,
  email: string
): string {
  const content = `
    <div class="content">
      <h2>Welcome! Your Account is Ready</h2>
      <p>Hi ${name},</p>
      <p>You've successfully signed in with GitHub. Your account has been created. Since GitHub doesn't always provide a public email, please note your details below.</p>

      <div class="info-box">
        <h3>Your Account Details</h3>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Login:</strong> You can log in via GitHub.</p>
      </div>

     <div class="warning">
        <strong>Security Notice:</strong> For future reference, you can always log in using Github. If you wish to set a password for standard login, please use the "Forgot Password" feature or set one in your profile settings.
      </div>

      <p style="text-align: center; margin-top: 30px;">
        <a href="${
          process.env.FRONTEND_URL || 'http://localhost:3000'
        }/auth/change-password" class="button">
          Change Password Now
        </a>
      </p>
    </div>
  `;

  return baseTemplate(content);
}
