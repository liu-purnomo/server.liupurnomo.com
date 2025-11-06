/**
 * Comment Management API Documentation
 * OpenAPI paths for comment CRUD endpoints
 */

export const commentPaths = {
  // ==================== PUBLIC ENDPOINTS ====================

  '/api/comments': {
    get: {
      tags: ['Comments'],
      summary: 'Get comments (Paginated)',
      description: 'Get paginated list of comments with filtering and sorting. Public can see approved comments.',
      security: [],
      parameters: [
        {
          name: 'postId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by post ID',
          example: 'clpost123abc456',
        },
        {
          name: 'userId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by user ID',
          example: 'cluser123abc456',
        },
        {
          name: 'parentId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by parent comment ID or "root" for top-level comments',
          example: 'root',
        },
        {
          name: 'isApproved',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by approval status',
          example: true,
        },
        {
          name: 'isFeatured',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by featured status',
          example: false,
        },
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
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Items per page',
          example: 20,
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['createdAt', 'helpfulCount', 'likeCount'], default: 'createdAt' },
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
          description: 'Comments retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentListResponse' },
            },
          },
        },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/comments/{id}': {
    get: {
      tags: ['Comments'],
      summary: 'Get comment by ID',
      description: 'Get a single comment by ID with its replies',
      security: [],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Comment ID',
          example: 'clcomm123abc456',
        },
      ],
      responses: {
        200: {
          description: 'Comment retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentResponse' },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/comments/guest': {
    post: {
      tags: ['Comments'],
      summary: 'Create guest comment (unauthenticated)',
      description: 'Create a comment as a guest user. Requires approval before being visible.',
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateGuestCommentRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Guest comment created and pending approval',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  // ==================== AUTHENTICATED ENDPOINTS ====================

  '/api/comments (authenticated)': {
    post: {
      tags: ['Comments'],
      summary: 'Create comment (authenticated)',
      description: 'Create a comment as authenticated user. Auto-approved if user is post author.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateCommentRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Comment created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentResponse' },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/comments/{id} (authenticated)': {
    patch: {
      tags: ['Comments'],
      summary: 'Update comment',
      description: 'Update comment content. Only comment author can update.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Comment ID',
          example: 'clcomm123abc456',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateCommentRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Comment updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentResponse' },
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
      tags: ['Comments'],
      summary: 'Delete comment',
      description: 'Soft delete a comment. Comment author or post author can delete.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Comment ID',
          example: 'clcomm123abc456',
        },
      ],
      responses: {
        200: {
          description: 'Comment deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentDeleteResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/comments/{id}/moderate': {
    patch: {
      tags: ['Comments'],
      summary: 'Moderate comment',
      description: 'Approve, feature, or pin a comment. Only post author can moderate.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Comment ID',
          example: 'clcomm123abc456',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ModerateCommentRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Comment moderation updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommentResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
};
