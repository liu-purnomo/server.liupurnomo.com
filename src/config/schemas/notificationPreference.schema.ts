/**
 * Notification Preference Schemas
 * OpenAPI schema definitions for notification preference management
 */

export const notificationPreferenceSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  UpdateNotificationPreferenceRequest: {
    type: 'object',
    properties: {
      // In-app notification preferences
      commentOnPost: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone comments on user\'s post',
      },
      replyToComment: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone replies to user\'s comment',
      },
      mentionInComment: {
        type: 'boolean',
        example: true,
        description: 'Notify when user is mentioned in a comment',
      },
      reactionOnComment: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone reacts to user\'s comment',
      },
      postPublished: {
        type: 'boolean',
        example: false,
        description: 'Notify when followed author publishes a post',
      },
      commentApproved: {
        type: 'boolean',
        example: true,
        description: 'Notify when user\'s comment is approved',
      },
      commentFeatured: {
        type: 'boolean',
        example: true,
        description: 'Notify when user\'s comment is featured',
      },
      moderationAction: {
        type: 'boolean',
        example: true,
        description: 'Notify about moderation actions on user\'s content',
      },

      // Email notification preferences
      emailCommentOnPost: {
        type: 'boolean',
        example: true,
        description: 'Send email when someone comments on user\'s post',
      },
      emailReplyToComment: {
        type: 'boolean',
        example: true,
        description: 'Send email when someone replies to user\'s comment',
      },
      emailMentionInComment: {
        type: 'boolean',
        example: true,
        description: 'Send email when user is mentioned',
      },
      emailPostPublished: {
        type: 'boolean',
        example: false,
        description: 'Send email when followed author publishes',
      },
      emailDigest: {
        type: 'boolean',
        example: false,
        description: 'Enable daily/weekly email digest',
      },
      emailDigestFrequency: {
        type: 'string',
        enum: ['daily', 'weekly'],
        example: 'weekly',
        description: 'Frequency of email digest',
      },

      // System notifications
      systemAnnouncement: {
        type: 'boolean',
        example: true,
        description: 'Receive important system announcements',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  NotificationPreferenceResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      userId: {
        type: 'string',
        example: 'clxyz123abc456def',
      },

      // In-app notification preferences
      commentOnPost: {
        type: 'boolean',
        example: true,
      },
      replyToComment: {
        type: 'boolean',
        example: true,
      },
      mentionInComment: {
        type: 'boolean',
        example: true,
      },
      reactionOnComment: {
        type: 'boolean',
        example: true,
      },
      postPublished: {
        type: 'boolean',
        example: false,
      },
      commentApproved: {
        type: 'boolean',
        example: true,
      },
      commentFeatured: {
        type: 'boolean',
        example: true,
      },
      moderationAction: {
        type: 'boolean',
        example: true,
      },

      // Email notification preferences
      emailCommentOnPost: {
        type: 'boolean',
        example: true,
      },
      emailReplyToComment: {
        type: 'boolean',
        example: true,
      },
      emailMentionInComment: {
        type: 'boolean',
        example: true,
      },
      emailPostPublished: {
        type: 'boolean',
        example: false,
      },
      emailDigest: {
        type: 'boolean',
        example: false,
      },
      emailDigestFrequency: {
        type: 'string',
        enum: ['daily', 'weekly'],
        example: 'weekly',
      },

      // System notifications
      systemAnnouncement: {
        type: 'boolean',
        example: true,
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
};
