/**
 * Authentication Schemas
 * OpenAPI schema definitions for authentication
 */

export const authSchemas = {
  AuthResponse: {
    type: 'object',
    properties: {
      user: { $ref: '#/components/schemas/User' },
      accessToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      refreshToken: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      expiresIn: {
        type: 'integer',
        example: 2592000,
        description: 'Token expiration in seconds (30 days)',
      },
    },
  },
  CheckEmailResponse: {
    type: 'object',
    properties: {
      exists: {
        type: 'boolean',
        example: false,
      },
      email: {
        type: 'string',
        example: 'user@example.com',
      },
      nextAction: {
        type: 'string',
        enum: ['login', 'register'],
        example: 'register',
      },
      message: {
        type: 'string',
        example: 'Verification code sent to user@example.com',
      },
    },
  },
};
