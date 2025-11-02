/**
 * Notification Preference Validator
 * Validation schemas for notification preference operations
 */

import { z } from 'zod';

/**
 * Email digest frequency options
 */
const emailDigestFrequencySchema = z.enum(['daily', 'weekly']);

/**
 * Update Notification Preference Schema
 * All fields are optional - user can update specific preferences
 */
export const updateNotificationPreferenceSchema = z.object({
  // In-app notification preferences - Comments
  commentOnPost: z.boolean().optional(),
  replyToComment: z.boolean().optional(),
  mentionInComment: z.boolean().optional(),
  reactionOnComment: z.boolean().optional(),
  commentApproved: z.boolean().optional(),
  commentFeatured: z.boolean().optional(),

  // In-app notification preferences - Inline Comments
  inlineCommentOnPost: z.boolean().optional(),
  replyToInlineComment: z.boolean().optional(),
  mentionInInlineComment: z.boolean().optional(),
  reactionOnInlineComment: z.boolean().optional(),

  // In-app notification preferences - Highlights
  highlightOnPost: z.boolean().optional(),
  noteOnHighlight: z.boolean().optional(),
  replyToHighlightNote: z.boolean().optional(),
  mentionInHighlight: z.boolean().optional(),
  reactionOnHighlight: z.boolean().optional(),
  shareHighlight: z.boolean().optional(),

  // In-app notification preferences - General
  postPublished: z.boolean().optional(),
  moderationAction: z.boolean().optional(),

  // Email notification preferences - Comments
  emailCommentOnPost: z.boolean().optional(),
  emailReplyToComment: z.boolean().optional(),
  emailMentionInComment: z.boolean().optional(),

  // Email notification preferences - Inline Comments & Highlights
  emailInlineCommentOnPost: z.boolean().optional(),
  emailHighlightOnPost: z.boolean().optional(),
  emailNoteOnHighlight: z.boolean().optional(),

  // Email notification preferences - General
  emailPostPublished: z.boolean().optional(),
  emailDigest: z.boolean().optional(),
  emailDigestFrequency: emailDigestFrequencySchema.optional(),

  // System notifications
  systemAnnouncement: z.boolean().optional(),
});

/**
 * Type inference for update input
 */
export type UpdateNotificationPreferenceInput = z.infer<
  typeof updateNotificationPreferenceSchema
>;
