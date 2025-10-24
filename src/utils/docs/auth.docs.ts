/**
 * Authentication API Documentation
 * OpenAPI paths for authentication endpoints
 */

export const authPaths = {
  '/api/auth/check-email': {
    post: {
      tags: ['Authentication'],
      summary: 'Check if email exists',
      description: 'Step 1: Check if email is registered. If not, sends 4-digit verification code.',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email check successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/CheckEmailResponse' },
                },
              },
            },
          },
        },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register new user',
      description: 'Step 2: Complete registration with 4-digit token from email',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'username', 'name', 'password', 'verificationToken'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                username: { type: 'string', example: 'john_doe' },
                name: { type: 'string', example: 'John Doe' },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'MyP@ssw0rd!',
                  description: 'Min 8 chars, must include uppercase, lowercase, number, special char',
                },
                verificationToken: {
                  type: 'string',
                  example: '1234',
                  description: '4-digit code from email',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Registration successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Registration successful' },
                  data: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        409: {
          description: 'Conflict - Email or username already exists',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login user',
      description: 'Authenticate with email and password',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                password: { type: 'string', format: 'password', example: 'MyP@ssw0rd!' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Login successful' },
                  data: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/forgot-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Request password reset',
      description: 'Send 4-digit reset code to email',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Reset code sent (if email exists)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'If the email exists, a password reset code has been sent.',
                  },
                },
              },
            },
          },
        },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/reset-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Reset password',
      description: 'Reset password with 4-digit code from email',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'token', 'newPassword'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                token: { type: 'string', example: '1234', description: '4-digit code from email' },
                newPassword: {
                  type: 'string',
                  format: 'password',
                  example: 'NewP@ssw0rd!',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Password has been reset successfully' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/verify-email': {
    post: {
      tags: ['Authentication'],
      summary: 'Verify email address',
      description: 'Verify email with 4-digit code',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'token'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
                token: { type: 'string', example: '1234' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email verified successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/resend-verification': {
    post: {
      tags: ['Authentication'],
      summary: 'Resend verification code',
      description: 'Resend verification email with new 4-digit code',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', format: 'email', example: 'user@example.com' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verification code sent',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'If the email exists, a new verification code has been sent.',
                  },
                },
              },
            },
          },
        },
        409: {
          description: 'Email already verified',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/refresh-token': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description: 'Get new access token using refresh token',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Token refreshed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      accessToken: { type: 'string' },
                      expiresIn: { type: 'integer', example: 2592000 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Authentication'],
      summary: 'Get current user',
      description: 'Get authenticated user information',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'User retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },
  '/api/auth/change-password': {
    post: {
      tags: ['Authentication'],
      summary: 'Change password',
      description: 'Change password for authenticated user',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: { type: 'string', format: 'password' },
                newPassword: {
                  type: 'string',
                  format: 'password',
                  description: 'Min 8 chars, must include uppercase, lowercase, number, special char',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Password changed successfully' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
  '/api/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout user',
      description: 'Logout user (client should delete tokens)',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Logout successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Logout successful. Please remove tokens from client.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/auth/google': {
    get: {
      tags: ['Authentication', 'OAuth'],
      summary: 'Initiate Google OAuth',
      description: 'Redirects user to Google OAuth consent screen',
      security: [],
      responses: {
        302: {
          description: 'Redirect to Google OAuth',
        },
      },
    },
  },
  '/api/auth/google/callback': {
    get: {
      tags: ['Authentication', 'OAuth'],
      summary: 'Google OAuth callback',
      description:
        'Handles Google OAuth callback. Auto-registers new users with verified email and sends temporary password. Auto-verifies existing unverified users.',
      security: [],
      parameters: [
        {
          in: 'query',
          name: 'code',
          required: true,
          schema: { type: 'string' },
          description: 'Authorization code from Google',
        },
        {
          in: 'query',
          name: 'state',
          schema: { type: 'string' },
          description: 'State parameter for CSRF protection',
        },
      ],
      responses: {
        302: {
          description: 'Redirect to frontend with auth tokens',
          headers: {
            Location: {
              schema: {
                type: 'string',
                example:
                  'http://localhost:3000/auth/callback?accessToken=xxx&refreshToken=xxx&isNewUser=true',
              },
              description:
                'Frontend URL with accessToken, refreshToken, and isNewUser query parameters',
            },
          },
        },
      },
    },
  },
  '/api/auth/github': {
    get: {
      tags: ['Authentication', 'OAuth'],
      summary: 'Initiate GitHub OAuth',
      description: 'Redirects user to GitHub OAuth consent screen',
      security: [],
      responses: {
        302: {
          description: 'Redirect to GitHub OAuth',
        },
      },
    },
  },
  '/api/auth/github/callback': {
    get: {
      tags: ['Authentication', 'OAuth'],
      summary: 'GitHub OAuth callback',
      description:
        'Handles GitHub OAuth callback. Auto-registers new users with verified email and sends temporary password. Auto-verifies existing unverified users.',
      security: [],
      parameters: [
        {
          in: 'query',
          name: 'code',
          required: true,
          schema: { type: 'string' },
          description: 'Authorization code from GitHub',
        },
        {
          in: 'query',
          name: 'state',
          schema: { type: 'string' },
          description: 'State parameter for CSRF protection',
        },
      ],
      responses: {
        302: {
          description: 'Redirect to frontend with auth tokens',
          headers: {
            Location: {
              schema: {
                type: 'string',
                example:
                  'http://localhost:3000/auth/callback?accessToken=xxx&refreshToken=xxx&isNewUser=true',
              },
              description:
                'Frontend URL with accessToken, refreshToken, and isNewUser query parameters',
            },
          },
        },
      },
    },
  },
};
