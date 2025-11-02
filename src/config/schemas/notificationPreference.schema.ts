/**
 * Notification Preference Schemas
 * OpenAPI schema definitions for notification preference management
 */

export const notificationPreferenceSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  UpdateNotificationPreferenceRequest: {
    type: 'object',
    properties: {
      // In-app notification preferences - Comments
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

      // In-app notification preferences - Inline Comments
      inlineCommentOnPost: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone adds an inline comment on user\'s post',
      },
      replyToInlineComment: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone replies to user\'s inline comment',
      },
      mentionInInlineComment: {
        type: 'boolean',
        example: true,
        description: 'Notify when user is mentioned in an inline comment',
      },
      reactionOnInlineComment: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone reacts to user\'s inline comment',
      },

      // In-app notification preferences - Highlights
      highlightOnPost: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone highlights text in user\'s post',
      },
      noteOnHighlight: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone adds a note to their highlight',
      },
      replyToHighlightNote: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone replies to user\'s highlight note',
      },
      mentionInHighlight: {
        type: 'boolean',
        example: true,
        description: 'Notify when user is mentioned in a highlight note',
      },
      reactionOnHighlight: {
        type: 'boolean',
        example: true,
        description: 'Notify when someone reacts to user\'s highlight',
      },
      shareHighlight: {
        type: 'boolean',
        example: false,
        description: 'Notify when someone shares user\'s highlight',
      },

      // In-app notification preferences - General
      postPublished: {
        type: 'boolean',
        example: false,
        description: 'Notify when followed author publishes a post',
      },
      moderationAction: {
        type: 'boolean',
        example: true,
        description: 'Notify about moderation actions on user\'s content',
      },

      // Email notification preferences - Comments
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
        description: 'Send email when user is mentioned in a comment',
      },

      // Email notification preferences - Inline Comments & Highlights
      emailInlineCommentOnPost: {
        type: 'boolean',
        example: false,
        description: 'Send email when someone adds an inline comment on user\'s post',
      },
      emailHighlightOnPost: {
        type: 'boolean',
        example: false,
        description: 'Send email when someone highlights text in user\'s post',
      },
      emailNoteOnHighlight: {
        type: 'boolean',
        example: false,
        description: 'Send email when someone adds a note to their highlight',
      },

      // Email notification preferences - General
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

      // In-app notification preferences - Comments
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
      commentApproved: {
        type: 'boolean',
        example: true,
      },
      commentFeatured: {
        type: 'boolean',
        example: true,
      },

      // In-app notification preferences - Inline Comments
      inlineCommentOnPost: {
        type: 'boolean',
        example: true,
      },
      replyToInlineComment: {
        type: 'boolean',
        example: true,
      },
      mentionInInlineComment: {
        type: 'boolean',
        example: true,
      },
      reactionOnInlineComment: {
        type: 'boolean',
        example: true,
      },

      // In-app notification preferences - Highlights
      highlightOnPost: {
        type: 'boolean',
        example: true,
      },
      noteOnHighlight: {
        type: 'boolean',
        example: true,
      },
      replyToHighlightNote: {
        type: 'boolean',
        example: true,
      },
      mentionInHighlight: {
        type: 'boolean',
        example: true,
      },
      reactionOnHighlight: {
        type: 'boolean',
        example: true,
      },
      shareHighlight: {
        type: 'boolean',
        example: false,
      },

      // In-app notification preferences - General
      postPublished: {
        type: 'boolean',
        example: false,
      },
      moderationAction: {
        type: 'boolean',
        example: true,
      },

      // Email notification preferences - Comments
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

      // Email notification preferences - Inline Comments & Highlights
      emailInlineCommentOnPost: {
        type: 'boolean',
        example: false,
      },
      emailHighlightOnPost: {
        type: 'boolean',
        example: false,
      },
      emailNoteOnHighlight: {
        type: 'boolean',
        example: false,
      },

      // Email notification preferences - General
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
