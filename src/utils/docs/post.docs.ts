/**
 * Post Management API Documentation
 * OpenAPI paths for post CRUD endpoints
 */

export const postPaths = {
  // ==================== PUBLIC ENDPOINTS ====================

  '/api/posts': {
    get: {
      tags: ['Posts'],
      summary: 'Get all published posts (Paginated)',
      description: 'Get paginated list of published posts with filtering and sorting. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number',
          example: 1,
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Items per page',
          example: 10,
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search in title, excerpt, and content',
          example: 'typescript',
        },
        {
          name: 'categoryId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by category ID',
          example: 'clcat123abc456def',
        },
        {
          name: 'postType',
          in: 'query',
          schema: { type: 'string', enum: ['BLOG', 'TUTORIAL'] },
          description: 'Filter by post type',
          example: 'BLOG',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['publishedAt', 'title', 'viewCount'], default: 'publishedAt' },
          description: 'Sort field',
          example: 'publishedAt',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort order',
          example: 'desc',
        },
      ],
      responses: {
        200: {
          description: 'Posts retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Posts retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      posts: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/PostListItemResponse' },
                      },
                    },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 50 },
                      totalPages: { type: 'integer', example: 5 },
                    },
                  },
                },
              },
            },
          },
        },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },

    post: {
      tags: ['Posts'],
      summary: 'Create new post (Author/Admin only)',
      description: 'Create a new post. Requires AUTHOR or ADMIN role. JSON body with media library URL references.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreatePostRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Post created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      post: { $ref: '#/components/schemas/PostResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/posts/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get published post by ID',
      description: 'Get published post details by ID. No authentication required. View count is incremented automatically.',
      security: [],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post ID (CUID)',
          example: 'clpost123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Post retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      post: { $ref: '#/components/schemas/PostResponse' },
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

    put: {
      tags: ['Posts'],
      summary: 'Update post (Owner/Admin only)',
      description: 'Update post details. Requires AUTHOR or ADMIN role. ADMIN can update any post, AUTHORS can only update their own.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post ID (CUID)',
          example: 'clpost123abc456def',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdatePostRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Post updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      post: { $ref: '#/components/schemas/PostResponse' },
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
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },

    delete: {
      tags: ['Posts'],
      summary: 'Delete post - Soft delete (Owner/Admin only)',
      description: 'Soft delete post (sets deletedAt timestamp). Requires AUTHOR or ADMIN role. ADMIN can delete any post, AUTHORS can only delete their own.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post ID (CUID)',
          example: 'clpost123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Post deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post deleted successfully' },
                  data: { type: 'null' },
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
  },

  '/api/posts/slug/{slug}': {
    get: {
      tags: ['Posts'],
      summary: 'Get published post by slug',
      description: 'Get published post details by slug (URL-friendly identifier). No authentication required. View count is incremented automatically.',
      security: [],
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post slug (URL-friendly identifier)',
          example: 'getting-started-with-typescript',
        },
      ],
      responses: {
        200: {
          description: 'Post retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      post: { $ref: '#/components/schemas/PostResponse' },
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

  // ==================== ADMIN/AUTHOR ENDPOINTS ====================

  '/api/posts/admin/all': {
    get: {
      tags: ['Posts'],
      summary: 'Get all posts including drafts (Admin/Author)',
      description: 'Get paginated list of all posts including drafts. Requires AUTHOR or ADMIN role. ADMIN sees all posts, AUTHORS see only their own.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number',
          example: 1,
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Items per page',
          example: 10,
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search in title, excerpt, and content',
          example: 'typescript',
        },
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'] },
          description: 'Filter by post status',
          example: 'DRAFT',
        },
        {
          name: 'categoryId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by category ID',
          example: 'clcat123abc456def',
        },
        {
          name: 'postType',
          in: 'query',
          schema: { type: 'string', enum: ['BLOG', 'TUTORIAL'] },
          description: 'Filter by post type',
          example: 'BLOG',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['publishedAt', 'createdAt', 'updatedAt', 'title', 'viewCount'], default: 'publishedAt' },
          description: 'Sort field',
          example: 'createdAt',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort order',
          example: 'desc',
        },
      ],
      responses: {
        200: {
          description: 'Posts retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Posts retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      posts: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/PostListItemResponse' },
                      },
                    },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer', example: 1 },
                      limit: { type: 'integer', example: 10 },
                      total: { type: 'integer', example: 50 },
                      totalPages: { type: 'integer', example: 5 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/posts/admin/{id}': {
    get: {
      tags: ['Posts'],
      summary: 'Get post by ID including drafts (Admin/Author)',
      description: 'Get post details by ID including drafts. Requires AUTHOR or ADMIN role. ADMIN can view any post, AUTHORS can only view their own.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post ID (CUID)',
          example: 'clpost123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Post retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      post: { $ref: '#/components/schemas/PostResponse' },
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
  },

  '/api/posts/{id}/permanent': {
    delete: {
      tags: ['Posts'],
      summary: 'Permanently delete post (Admin only)',
      description: 'Permanently delete post from database. Requires ADMIN role only. This action cannot be undone.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post ID (CUID)',
          example: 'clpost123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Post permanently deleted',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Post permanently deleted' },
                  data: { type: 'null' },
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
  },
};
