import { schemas } from './schemas/index.js';
import { paths } from '../utils/docs/index.js';

/**
 * OpenAPI Configuration
 * Main configuration for API documentation
 */

export const openapiConfig = {
  openapi: '3.1.0',
  info: {
    title: 'Liu Purnomo Blog API',
    version: '0.4.0',
    description: `
A modern, scalable blog platform backend with advanced content management,
interactive commenting system, and comprehensive SEO optimization built with
TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **Authentication**: Modern auth flow with 4-digit email verification
- 📝 **Content Management**: Posts, Categories, Tags, Series
- 💬 **Comment System**: Threading, Moderation, Reactions
- 🔔 **Notifications**: In-app & Email alerts
- 📊 **Analytics**: Post views, User activity logging, Bookmarks
- 🎨 **Media**: File uploads with Sharp optimization
- 🔍 **SEO**: Meta tags, Schema.org, Redirects

## Getting Started

All endpoints require authentication unless specified otherwise.
Use the \`Authorization\` header with Bearer token:

\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Authentication Flow

1. **Check Email**: POST /api/auth/check-email
   - If exists → Login
   - If new → Sends 4-digit code to email

2. **Register** (new users): POST /api/auth/register
   - Provide: email, username, name, password, verificationToken (4-digit)

3. **Login** (existing users): POST /api/auth/login
   - Provide: email, password
   - Returns: accessToken, refreshToken
    `.trim(),
    contact: {
      name: 'Liu Purnomo',
      email: 'liu@drone.co.id',
      url: 'https://liupurnomo.com',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/liu-purnomo/server.liupurnomo.com/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: process.env.BASE_URL || 'http://localhost:4000',
      description: 'Development server',
    },
    {
      url: 'https://server.liupurnomo.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Users',
      description: 'User management and profile operations',
    },
    {
      name: 'Posts',
      description: 'Blog posts and tutorials management',
    },
    {
      name: 'Categories',
      description: 'Content categorization with hierarchical structure',
    },
    {
      name: 'Tags',
      description: 'Flexible content tagging system',
    },
    {
      name: 'Comments',
      description: 'Comment system with threading and moderation',
    },
    {
      name: 'Notifications',
      description: 'User notifications and preferences',
    },
    {
      name: 'Media',
      description: 'File upload and media management',
    },
    {
      name: 'Analytics',
      description: 'Statistics and activity tracking',
    },
    {
      name: 'Series',
      description: 'Post series for multi-part content',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token obtained from login endpoint',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Operation successful',
          },
          data: {
            type: 'object',
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            example: 100,
          },
          page: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 10,
          },
          totalPages: {
            type: 'integer',
            example: 10,
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clx1y2z3a0000qwerty12345',
          },
          username: {
            type: 'string',
            example: 'john_doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          name: {
            type: 'string',
            nullable: true,
            example: 'John Doe',
          },
          avatarUrl: {
            type: 'string',
            nullable: true,
            example: 'https://example.com/avatar.jpg',
          },
          bio: {
            type: 'string',
            nullable: true,
            example: 'Software developer and blogger',
          },
          location: {
            type: 'string',
            nullable: true,
            example: 'San Francisco, CA',
          },
          role: {
            type: 'string',
            enum: ['ADMIN', 'AUTHOR', 'USER'],
            example: 'USER',
          },
          isActive: {
            type: 'boolean',
            example: true,
          },
          emailVerifiedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string', nullable: true },
          content: { type: 'object' },
          featuredImageUrl: { type: 'string', nullable: true },
          postType: {
            type: 'string',
            enum: ['BLOG', 'TUTORIAL'],
          },
          status: {
            type: 'string',
            enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
          },
          viewCount: { type: 'integer' },
          readingTime: { type: 'integer', nullable: true },
          difficultyLevel: {
            type: 'string',
            enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
            nullable: true,
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      // Merge additional schemas from schemas/index.ts
      ...schemas,
    },
    responses: {
      Unauthorized: {
        description: 'Unauthorized - Invalid or missing token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Unauthorized',
            },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden - Insufficient permissions',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Forbidden',
            },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Resource not found',
            },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              message: 'Validation failed',
              errors: [
                {
                  field: 'email',
                  message: 'Invalid email format',
                },
              ],
            },
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  // Merge all paths from utils/docs/index.ts
  paths,
};
