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
  // In-app notification preferences
  commentOnPost: z.boolean().optional(),
  replyToComment: z.boolean().optional(),
  mentionInComment: z.boolean().optional(),
  reactionOnComment: z.boolean().optional(),
  postPublished: z.boolean().optional(),
  commentApproved: z.boolean().optional(),
  commentFeatured: z.boolean().optional(),
  moderationAction: z.boolean().optional(),

  // Email notification preferences
  emailCommentOnPost: z.boolean().optional(),
  emailReplyToComment: z.boolean().optional(),
  emailMentionInComment: z.boolean().optional(),
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
