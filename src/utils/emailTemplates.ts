/**
 * Email Templates
 * HTML templates for various email types
 */

/**
 * Base Email Template
 * Wraps content in a responsive HTML email layout
 */
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liu Purnomo</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .code-box {
      background-color: #f8f9fa;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 36px;
      font-weight: 700;
      color: #667eea;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6c757d;
      border-top: 1px solid #e9ecef;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px;
      }
      .content {
        padding: 30px 20px;
      }
      .code {
        font-size: 28px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 Liu Purnomo</h1>
    </div>
    ${content}
    <div class="footer">
      <p>This is an automated email from Liu Purnomo.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>&copy; ${new Date().getFullYear()} Liu Purnomo. All rights reserved.</p>
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
      <p>Thank you for starting your registration with Liu Purnomo.</p>
      <p>To complete your registration, please use the verification code below:</p>

      <div class="code-box">
        <div class="code">${token}</div>
        <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">
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
        <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">
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
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

  const content = `
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">
          Reset Password
        </a>
      </p>

      <p style="font-size: 14px; color: #6c757d;">
        This link will expire in ${expiresIn} minutes. If the button doesn't work, copy and paste this link into your browser:
      </p>

      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin: 20px 0; word-break: break-all; font-size: 12px; color: #667eea;">
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
export function welcomeEmailTemplate(
  name: string,
  username: string
): string {
  const content = `
    <div class="content">
      <h2>Welcome to Liu Purnomo! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Congratulations! Your account has been successfully created.</p>

      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">Your Account Details</h3>
        <p style="margin: 5px 0;"><strong>Username:</strong> @${username}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> Verified ✓</p>
      </div>

      <p>You're now ready to:</p>
      <ul style="line-height: 1.8;">
        <li>Write and publish blog posts</li>
        <li>Create tutorials and guides</li>
        <li>Engage with the community</li>
        <li>Bookmark your favorite content</li>
      </ul>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">
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
      <p>This email confirms that your password was changed successfully.</p>

      <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
        <strong style="color: #155724;">Security Confirmed:</strong>
        <p style="margin: 10px 0 0 0; color: #155724;">Your password has been updated and your account is secure.</p>
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
  email: string,
  tempPassword: string
): string {
  const content = `
    <div class="content">
      <h2>Welcome! Your Account is Ready</h2>
      <p>Hi ${name},</p>
      <p>You've successfully signed in with Google. Your account has been created and your email is verified.</p>

      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">Your Account Details</h3>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Email Status:</strong> Verified ✓</p>
      </div>

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #856404;">Temporary Password</h3>
        <p style="margin: 5px 0;">A temporary password has been generated for your account:</p>
        <div class="code-box">
          <div class="code" style="font-size: 24px;">${tempPassword}</div>
        </div>
      </div>

      <div class="warning">
        <strong>Security Notice:</strong> Please change this temporary password immediately after your first login.
        <ul style="margin: 10px 0 0 0;">
          <li>Log in with your Google account or use this temporary password</li>
          <li>Navigate to your profile settings</li>
          <li>Change your password to something secure and memorable</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/change-password" class="button">
          Change Password Now
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
  email: string,
  tempPassword: string
): string {
  const content = `
    <div class="content">
      <h2>Welcome! Your Account is Ready</h2>
      <p>Hi ${name},</p>
      <p>You've successfully signed in with GitHub. Your account has been created and your email is verified.</p>

      <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #667eea;">Your Account Details</h3>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Email Status:</strong> Verified ✓</p>
      </div>

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #856404;">Temporary Password</h3>
        <p style="margin: 5px 0;">A temporary password has been generated for your account:</p>
        <div class="code-box">
          <div class="code" style="font-size: 24px;">${tempPassword}</div>
        </div>
      </div>

      <div class="warning">
        <strong>Security Notice:</strong> Please change this temporary password immediately after your first login.
        <ul style="margin: 10px 0 0 0;">
          <li>Log in with your GitHub account or use this temporary password</li>
          <li>Navigate to your profile settings</li>
          <li>Change your password to something secure and memorable</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/change-password" class="button">
          Change Password Now
        </a>
      </p>
    </div>
  `;

  return baseTemplate(content);
}
