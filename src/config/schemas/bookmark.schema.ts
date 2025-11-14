/**
 * Bookmark OpenAPI Schemas
 */

export const bookmarkSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  CreateBookmarkRequest: {
    type: 'object',
    required: ['postId'],
    properties: {
      postId: {
        type: 'string',
        description: 'ID of the post to bookmark',
        example: 'clx1y2z3a0000qwerty12345',
      },
      note: {
        type: 'string',
        maxLength: 5000,
        description: 'Personal note about this bookmark',
        example: 'Great article about TypeScript best practices',
      },
      tags: {
        type: 'array',
        items: { type: 'string', maxLength: 50 },
        maxItems: 20,
        description: 'Custom tags for organizing bookmarks',
        example: ['typescript', 'tutorial', 'must-read'],
      },
      isFavorite: {
        type: 'boolean',
        default: false,
        description: 'Mark as favorite bookmark',
        example: false,
      },
    },
  },

  UpdateBookmarkRequest: {
    type: 'object',
    properties: {
      note: {
        type: 'string',
        maxLength: 5000,
        description: 'Personal note about this bookmark',
      },
      tags: {
        type: 'array',
        items: { type: 'string', maxLength: 50 },
        maxItems: 20,
        description: 'Custom tags for organizing bookmarks',
      },
      isFavorite: {
        type: 'boolean',
        description: 'Mark as favorite bookmark',
      },
      isRead: {
        type: 'boolean',
        description: 'Mark as read/unread',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  BookmarkResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clx1y2z3a0000qwerty12345',
      },
      userId: {
        type: 'string',
        example: 'clx1y2z3a0000qwerty12345',
      },
      postId: {
        type: 'string',
        example: 'clx1y2z3a0000qwerty12345',
      },
      note: {
        type: 'string',
        nullable: true,
        example: 'Great article about TypeScript best practices',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        example: ['typescript', 'tutorial', 'must-read'],
      },
      isFavorite: {
        type: 'boolean',
        example: true,
      },
      isRead: {
        type: 'boolean',
        example: false,
      },
      readAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-14T10:00:00Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-14T10:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-14T10:00:00Z',
      },
      post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string', example: 'TypeScript Best Practices' },
          slug: { type: 'string', example: 'typescript-best-practices' },
          excerpt: { type: 'string', nullable: true },
          featuredImageUrl: { type: 'string', nullable: true },
          readingTime: { type: 'integer', nullable: true, example: 10 },
          author: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', nullable: true, example: 'John Doe' },
              username: { type: 'string', example: 'johndoe' },
              avatarUrl: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
  },

  BookmarkListItemResponse: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      postId: { type: 'string' },
      note: { type: 'string', nullable: true },
      tags: { type: 'array', items: { type: 'string' } },
      isFavorite: { type: 'boolean' },
      isRead: { type: 'boolean' },
      readAt: { type: 'string', format: 'date-time', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          excerpt: { type: 'string', nullable: true },
          featuredImageUrl: { type: 'string', nullable: true },
          readingTime: { type: 'integer', nullable: true },
          author: {
            type: 'object',
            properties: {
              name: { type: 'string', nullable: true },
              username: { type: 'string' },
              avatarUrl: { type: 'string', nullable: true },
            },
          },
        },
      },
    },
  },
};
