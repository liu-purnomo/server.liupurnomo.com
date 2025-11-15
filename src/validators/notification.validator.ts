/**
 * Notification Validators
 * Zod schemas for validating notification requests
 */

import { z } from 'zod';

/**
 * Get Notifications Query Validator
 * For listing user's notifications with filters
 */
export const getNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isRead: z.coerce.boolean().optional(), // Filter by read/unread status
  type: z.string().optional(), // Filter by notification type
  sortBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetNotificationsQueryInput = z.infer<
  typeof getNotificationsQuerySchema
>;

/**
 * Get Notification by ID Validator
 */
export const getNotificationByIdSchema = z.object({
  id: z.cuid('Invalid notification ID format'),
});

export type GetNotificationByIdInput = z.infer<
  typeof getNotificationByIdSchema
>;

/**
 * Mark Notification as Read Validator
 */
export const markAsReadSchema = z.object({
  id: z.cuid('Invalid notification ID format'),
});

export type MarkAsReadInput = z.infer<typeof markAsReadSchema>;

/**
 * Mark All Notifications as Read Validator
 * No additional validation needed - just uses authenticated user
 */
export const markAllAsReadSchema = z.object({});

export type MarkAllAsReadInput = z.infer<typeof markAllAsReadSchema>;

/**
 * Delete Notification Validator
 */
export const deleteNotificationSchema = z.object({
  id: z.cuid('Invalid notification ID format'),
});

export type DeleteNotificationInput = z.infer<typeof deleteNotificationSchema>;

/**
 * Delete All Read Notifications Validator
 * No additional validation needed - just uses authenticated user
 */
export const deleteAllReadSchema = z.object({});

export type DeleteAllReadInput = z.infer<typeof deleteAllReadSchema>;
