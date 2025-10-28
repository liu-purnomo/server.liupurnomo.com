/**
 * User Schemas
 * OpenAPI schema definitions for user management
 */

export const userSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  UpdateProfileRequest: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: '^[a-zA-Z0-9_]+$',
        example: 'john_doe',
        description: 'Unique username (3-30 characters, letters, numbers, and underscores only). Reserved usernames like "admin", "superadmin", etc. are not allowed.',
      },
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        example: 'John Doe',
      },
      bio: {
        type: 'string',
        maxLength: 500,
        example: 'Software developer and tech enthusiast',
      },
      location: {
        type: 'string',
        maxLength: 100,
        example: 'San Francisco, CA',
      },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://example.com/avatar.jpg',
      },
    },
  },

  AdminUpdateUserRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        example: 'John Doe',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'newemail@example.com',
      },
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: '^[a-zA-Z0-9_]+$',
        example: 'john_doe',
      },
      bio: {
        type: 'string',
        maxLength: 500,
        example: 'Software developer and tech enthusiast',
      },
      location: {
        type: 'string',
        maxLength: 100,
        example: 'San Francisco, CA',
      },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://example.com/avatar.jpg',
      },
      role: {
        type: 'string',
        enum: ['ADMIN', 'AUTHOR', 'USER'],
        example: 'AUTHOR',
      },
      isActive: {
        type: 'boolean',
        example: true,
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  PublicUserResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      username: {
        type: 'string',
        example: 'john_doe',
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
        example: 'Software developer and tech enthusiast',
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
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
    },
  },

  UserProfileResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
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
        example: 'Software developer and tech enthusiast',
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
        example: '2025-01-15T10:30:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
    },
  },

  AdminUserResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
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
        example: 'Software developer and tech enthusiast',
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
        example: '2025-01-15T10:30:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
    },
  },

  UserListItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
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
        example: '2025-01-15T10:30:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
    },
  },
};
