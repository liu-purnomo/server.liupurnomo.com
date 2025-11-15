/**
 * Bookmark API Documentation
 * OpenAPI path definitions for Bookmark endpoints
 */

export const bookmarkPaths = {
  '/api/bookmarks': {
    get: {
      tags: ['Bookmarks'],
      summary: 'Get all bookmarks',
      description: 'Retrieve all bookmarks for authenticated user with filtering',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
          description: 'Page number',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10 },
          description: 'Items per page',
        },
        {
          name: 'isFavorite',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by favorite status',
        },
        {
          name: 'isRead',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by read status',
        },
        {
          name: 'tags',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by tags (comma-separated)',
          example: 'typescript,tutorial',
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search in post title and bookmark note',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['createdAt', 'updatedAt', 'readAt'],
            default: 'createdAt',
          },
          description: 'Sort by field',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort order',
        },
      ],
      responses: {
        200: {
          description: 'Bookmarks retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmarks retrieved successfully',
                  },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/BookmarkListItemResponse' },
                  },
                  pagination: { $ref: '#/components/schemas/Pagination' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
    post: {
      tags: ['Bookmarks'],
      summary: 'Create bookmark',
      description: 'Bookmark a post for later reading',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateBookmarkRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Bookmark created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmark created successfully',
                  },
                  data: { $ref: '#/components/schemas/BookmarkResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/bookmarks/post/{postId}': {
    get: {
      tags: ['Bookmarks'],
      summary: 'Get bookmark by post ID',
      description: 'Check if user has bookmarked a specific post',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'postId',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Post ID',
        },
      ],
      responses: {
        200: {
          description: 'Bookmark status retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmark retrieved successfully',
                  },
                  data: {
                    oneOf: [
                      { $ref: '#/components/schemas/BookmarkResponse' },
                      { type: 'null' },
                    ],
                  },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/api/bookmarks/{id}': {
    get: {
      tags: ['Bookmarks'],
      summary: 'Get bookmark by ID',
      description: 'Retrieve single bookmark by ID',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Bookmark ID',
        },
      ],
      responses: {
        200: {
          description: 'Bookmark retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmark retrieved successfully',
                  },
                  data: { $ref: '#/components/schemas/BookmarkResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
    patch: {
      tags: ['Bookmarks'],
      summary: 'Update bookmark',
      description: 'Update bookmark note, tags, or status',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Bookmark ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateBookmarkRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Bookmark updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmark updated successfully',
                  },
                  data: { $ref: '#/components/schemas/BookmarkResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
    delete: {
      tags: ['Bookmarks'],
      summary: 'Delete bookmark',
      description: 'Remove bookmark permanently',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Bookmark ID',
        },
      ],
      responses: {
        200: {
          description: 'Bookmark deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmark deleted successfully',
                  },
                  data: { type: 'null' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/bookmarks/{id}/toggle-read': {
    post: {
      tags: ['Bookmarks'],
      summary: 'Toggle read status',
      description: 'Mark bookmark as read or unread',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Bookmark ID',
        },
      ],
      responses: {
        200: {
          description: 'Read status toggled successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Bookmark marked as read' },
                  data: { $ref: '#/components/schemas/BookmarkResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/bookmarks/{id}/toggle-favorite': {
    post: {
      tags: ['Bookmarks'],
      summary: 'Toggle favorite status',
      description: 'Add or remove bookmark from favorites',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Bookmark ID',
        },
      ],
      responses: {
        200: {
          description: 'Favorite status toggled successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Bookmark added to favorites',
                  },
                  data: { $ref: '#/components/schemas/BookmarkResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};
