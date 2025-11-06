/**
 * Comment Schemas
 * OpenAPI schema definitions for comment management
 * Follows the pattern from post.schema.ts
 */

export const commentSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  CreateCommentRequest: {
    type: 'object',
    required: ['postId', 'content'],
    properties: {
      postId: {
        type: 'string',
        example: 'clpost123abc456',
        description: 'ID of the post to comment on',
      },
      parentId: {
        type: 'string',
        nullable: true,
        example: 'clcomm123abc456',
        description: 'ID of parent comment for replies (null for top-level comments)',
      },
      content: {
        type: 'object',
        properties: {
          time: { type: 'number', example: 1642156800000 },
          blocks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'block_1' },
                type: { type: 'string', example: 'paragraph' },
                data: { type: 'object' },
              },
            },
          },
          version: { type: 'string', example: '2.28.0' },
        },
        example: {
          time: 1642156800000,
          blocks: [
            {
              id: 'block_1',
              type: 'paragraph',
              data: { text: 'This is a great article!' },
            },
          ],
          version: '2.28.0',
        },
        description: 'EditorJS format content',
      },
    },
  },

  CreateGuestCommentRequest: {
    type: 'object',
    required: ['postId', 'authorName', 'authorEmail', 'content'],
    properties: {
      postId: {
        type: 'string',
        example: 'clpost123abc456',
        description: 'ID of the post to comment on',
      },
      parentId: {
        type: 'string',
        nullable: true,
        example: 'clcomm123abc456',
        description: 'ID of parent comment for replies',
      },
      authorName: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'John Doe',
        description: 'Guest commenter name',
      },
      authorEmail: {
        type: 'string',
        format: 'email',
        example: 'john@example.com',
        description: 'Guest commenter email',
      },
      authorUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://johndoe.com',
        description: 'Guest commenter website URL',
      },
      content: {
        type: 'object',
        description: 'EditorJS format content (same as CreateCommentRequest)',
      },
    },
  },

  UpdateCommentRequest: {
    type: 'object',
    required: ['content'],
    properties: {
      content: {
        type: 'object',
        description: 'EditorJS format content',
      },
    },
  },

  ModerateCommentRequest: {
    type: 'object',
    properties: {
      isApproved: {
        type: 'boolean',
        example: true,
        description: 'Approve comment for public display',
      },
      isFeatured: {
        type: 'boolean',
        example: false,
        description: 'Feature this comment',
      },
      isPinned: {
        type: 'boolean',
        example: false,
        description: 'Pin comment to top',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  Comment: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clcomm123abc456' },
      postId: { type: 'string', example: 'clpost123abc456' },
      userId: { type: 'string', nullable: true, example: 'cluser123abc456' },
      parentId: { type: 'string', nullable: true, example: null },
      authorName: { type: 'string', nullable: true, example: 'Guest User' },
      authorEmail: { type: 'string', nullable: true, example: 'guest@example.com' },
      authorUrl: { type: 'string', nullable: true, example: null },
      content: { type: 'object' },
      contentText: { type: 'string', example: 'This is a great article!' },
      wordCount: { type: 'number', example: 5 },
      isFeatured: { type: 'boolean', example: false },
      isApproved: { type: 'boolean', example: true },
      isPinned: { type: 'boolean', example: false },
      isAuthorReply: { type: 'boolean', example: false },
      helpfulCount: { type: 'number', example: 10 },
      likeCount: { type: 'number', example: 25 },
      replyCount: { type: 'number', example: 3 },
      spamScore: { type: 'number', example: 0 },
      isEdited: { type: 'boolean', example: false },
      editedAt: { type: 'string', format: 'date-time', nullable: true },
      moderatedBy: { type: 'string', nullable: true },
      moderatedAt: { type: 'string', format: 'date-time', nullable: true },
      createdAt: { type: 'string', format: 'date-time', example: '2025-01-15T10:30:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-01-15T10:30:00Z' },
      deletedAt: { type: 'string', format: 'date-time', nullable: true },
      user: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          name: { type: 'string', nullable: true },
          avatarUrl: { type: 'string', nullable: true },
        },
      },
      _count: {
        type: 'object',
        properties: {
          replies: { type: 'number' },
          commentReactions: { type: 'number' },
        },
      },
    },
  },

  CommentResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Comment created successfully' },
      data: {
        type: 'object',
        properties: {
          comment: { $ref: '#/components/schemas/Comment' },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  CommentListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Comments retrieved successfully' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Comment' },
      },
      pagination: {
        type: 'object',
        properties: {
          currentPage: { type: 'number', example: 1 },
          perPage: { type: 'number', example: 20 },
          totalItems: { type: 'number', example: 45 },
          totalPages: { type: 'number', example: 3 },
          hasNextPage: { type: 'boolean', example: true },
          hasPreviousPage: { type: 'boolean', example: false },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  CommentDeleteResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Comment deleted successfully' },
      data: { type: 'null' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },
};
