import { z } from 'zod';
import {
  ActivityAction,
  HttpMethod,
  LogSeverity,
} from '../types/activity-log.types.js';

/**
 * Activity Log Validators
 * Zod schemas for validating activity log management requests
 */

// ==================== REQUEST VALIDATORS ====================

/**
 * Update Activity Log Validator
 * Validates request for updating activity log metadata
 * Only admin can update logs (e.g., severity, add notes)
 */
export const updateActivityLogValidator = z.object({
  severity: z.enum([
    LogSeverity.INFO,
    LogSeverity.WARNING,
    LogSeverity.ERROR,
    LogSeverity.CRITICAL,
  ]).optional(),
  description: z.string().min(1).max(1000).trim().optional(),
  errorMessage: z.string().max(2000).trim().optional(),
});

/**
 * Get Activity Log by ID Validator (for params only)
 * Validates request for getting a single activity log
 */
export const getActivityLogByIdValidator = z.object({
  id: z.cuid(),
});

/**
 * Delete Activity Log Validator (for params only)
 * Validates request for deleting an activity log
 */
export const deleteActivityLogValidator = z.object({
  id: z.cuid(),
});

/**
 * Get Activity Logs Query Validator
 * Validates query parameters for listing activity logs
 */
export const getActivityLogsQueryValidator = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    userId: z.cuid().optional(),
    action: z.enum([
      ActivityAction.CREATE,
      ActivityAction.READ,
      ActivityAction.UPDATE,
      ActivityAction.DELETE,
      ActivityAction.LOGIN,
      ActivityAction.LOGOUT,
      ActivityAction.REGISTER,
      ActivityAction.RESET_PASSWORD,
      ActivityAction.VERIFY_EMAIL,
    ]).optional(),
    entity: z.string().trim().optional(),
    entityId: z.cuid().optional(),
    success: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    severity: z.enum([
      LogSeverity.INFO,
      LogSeverity.WARNING,
      LogSeverity.ERROR,
      LogSeverity.CRITICAL,
    ]).optional(),
    method: z.enum([
      HttpMethod.GET,
      HttpMethod.POST,
      HttpMethod.PUT,
      HttpMethod.PATCH,
      HttpMethod.DELETE,
    ]).optional(),
    startDate: z.string().pipe(z.coerce.date()).optional(),
    endDate: z.string().pipe(z.coerce.date()).optional(),
    search: z.string().trim().optional(),
    sortBy: z
      .enum(['createdAt', 'action', 'entity', 'severity', 'duration', 'userId'])
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .optional();

/**
 * Get Activity Log Stats Query Validator
 * Validates query parameters for activity log statistics
 */
export const getActivityLogStatsQueryValidator = z
  .object({
    userId: z.cuid().optional(),
    startDate: z.string().pipe(z.coerce.date()).optional(),
    endDate: z.string().pipe(z.coerce.date()).optional(),
    entity: z.string().trim().optional(),
  })
  .optional();

// ==================== TYPE EXPORTS ====================

export type UpdateActivityLogInput = z.infer<
  typeof updateActivityLogValidator
>;
export type GetActivityLogsQuery = z.infer<
  typeof getActivityLogsQueryValidator
>;
export type GetActivityLogStatsQuery = z.infer<
  typeof getActivityLogStatsQueryValidator
>;
