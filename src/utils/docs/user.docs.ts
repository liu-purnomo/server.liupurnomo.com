/**
 * User Management API Documentation
 * OpenAPI paths for user management endpoints
 */

export const userPaths = {
  // ==================== PUBLIC ENDPOINTS ====================

  '/api/users/public/@{username}': {
    get: {
      tags: ['Users - Public'],
      summary: 'Get public user profile by username',
      description: 'Get limited user information by username. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'username',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Username (e.g., john_doe)',
          example: 'john_doe',
        },
      ],
      responses: {
        200: {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'User profile retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/PublicUserResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/users/public/{id}': {
    get: {
      tags: ['Users - Public'],
      summary: 'Get public user profile by ID',
      description: 'Get limited user information by user ID. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'User profile retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/PublicUserResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  // ==================== AUTHENTICATED USER ENDPOINTS ====================

  '/api/users/me': {
    get: {
      tags: ['Users - Profile'],
      summary: 'Get current user profile',
      description: 'Get full profile information for the authenticated user',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Profile retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/UserProfileResponse' },
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
    patch: {
      tags: ['Users - Profile'],
      summary: 'Update current user profile',
      description: 'Update profile information for the authenticated user, including username (must be unique and not reserved)',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Profile updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/UserProfileResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
    delete: {
      tags: ['Users - Profile'],
      summary: 'Delete current user account',
      description: 'Soft delete (deactivate) the current user account',
      security: [{ BearerAuth: [] }],
      responses: {
        204: {
          description: 'Account deleted successfully',
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  // ==================== ADMIN ENDPOINTS ====================

  '/api/users': {
    get: {
      tags: ['Users - Admin'],
      summary: 'Get all users (Admin only)',
      description: 'Get paginated list of users with filtering options. Requires admin role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Items per page',
        },
        {
          name: 'role',
          in: 'query',
          schema: { type: 'string', enum: ['ADMIN', 'AUTHOR', 'USER'] },
          description: 'Filter by user role',
        },
        {
          name: 'isActive',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by account status',
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by name, username, or email',
        },
      ],
      responses: {
        200: {
          description: 'Users retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Users retrieved successfully' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/UserListItemResponse' },
                  },
                  pagination: { $ref: '#/components/schemas/PaginationMeta' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },

  '/api/users/{id}': {
    get: {
      tags: ['Users - Admin'],
      summary: 'Get user by ID (Admin only)',
      description: 'Get full user information by ID. Requires admin role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'User retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'User retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/AdminUserResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
    patch: {
      tags: ['Users - Admin'],
      summary: 'Update user by ID (Admin only)',
      description: 'Update any user with extended permissions. Requires admin role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/AdminUpdateUserRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'User updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/AdminUserResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
    delete: {
      tags: ['Users - Admin'],
      summary: 'Delete user by ID (Admin only)',
      description: 'Permanently delete a user account. Requires admin role. Cannot delete admin users.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        204: {
          description: 'User deleted successfully',
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};
