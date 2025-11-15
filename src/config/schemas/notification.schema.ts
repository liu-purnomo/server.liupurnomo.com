/**
 * Notification Schemas
 * OpenAPI schema definitions for notifications
 */

export const notificationSchemas = {
  // ==================== RESPONSE SCHEMAS ====================

  Notification: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clnotif123abc456' },
      userId: { type: 'string', example: 'cluser123abc456' },
      type: {
        type: 'string',
        enum: [
          'COMMENT_ON_POST',
          'REPLY_TO_COMMENT',
          'MENTION_IN_COMMENT',
          'REACTION_ON_COMMENT',
          'POST_PUBLISHED',
          'COMMENT_APPROVED',
          'COMMENT_FEATURED',
          'SYSTEM_ANNOUNCEMENT',
          'MODERATION_ACTION',
          'INLINE_COMMENT_ON_POST',
          'REPLY_TO_INLINE_COMMENT',
          'MENTION_IN_INLINE_COMMENT',
          'REACTION_ON_INLINE_COMMENT',
          'HIGHLIGHT_ON_POST',
          'NOTE_ON_HIGHLIGHT',
          'REPLY_TO_HIGHLIGHT_NOTE',
          'MENTION_IN_HIGHLIGHT',
          'REACTION_ON_HIGHLIGHT',
          'SHARE_HIGHLIGHT',
        ],
        example: 'COMMENT_ON_POST',
      },
      title: { type: 'string', example: 'New comment on your post' },
      message: {
        type: 'string',
        example: 'John Doe commented on your post "Getting Started with TypeScript"',
      },
      postId: { type: 'string', nullable: true, example: 'clpost123abc456' },
      commentId: { type: 'string', nullable: true, example: 'clcomm123abc456' },
      reactionId: { type: 'string', nullable: true, example: 'clreact123abc456' },
      actorUserId: { type: 'string', nullable: true, example: 'cluser789xyz123' },
      actionUrl: { type: 'string', nullable: true, example: '/posts/getting-started-with-typescript#comment-123' },
      metadata: {
        type: 'object',
        nullable: true,
        example: { commentText: 'Great article!', authorName: 'John Doe' },
      },
      isRead: { type: 'boolean', example: false },
      readAt: { type: 'string', format: 'date-time', nullable: true, example: null },
      isEmailSent: { type: 'boolean', example: false },
      emailSentAt: { type: 'string', format: 'date-time', nullable: true, example: null },
      groupKey: { type: 'string', nullable: true, example: 'post-clpost123abc456-comments' },
      createdAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
      expiresAt: { type: 'string', format: 'date-time', nullable: true, example: null },
    },
  },

  NotificationListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Notifications retrieved successfully' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Notification' },
      },
      pagination: { $ref: '#/components/schemas/Pagination' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  NotificationResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Notification retrieved successfully' },
      data: { $ref: '#/components/schemas/Notification' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  UnreadCountResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Unread count retrieved successfully' },
      data: {
        type: 'object',
        properties: {
          count: { type: 'number', example: 5 },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  MarkAllAsReadResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'All notifications marked as read' },
      data: {
        type: 'object',
        properties: {
          count: { type: 'number', example: 5 },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  DeleteAllReadResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'All read notifications deleted successfully' },
      data: {
        type: 'object',
        properties: {
          count: { type: 'number', example: 10 },
        },
      },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },

  NotificationDeleteResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Notification deleted successfully' },
      data: { type: 'null', example: null },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },
};
