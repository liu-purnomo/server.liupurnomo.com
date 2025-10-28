import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type {
  ActivityLogListItemResponse,
  ActivityLogResponse,
  ActivityLogStatsResponse,
  GetActivityLogsQuery,
  UpdateActivityLogRequest,
} from '../types/index.js';
import { PaginatedResult } from '../types/response.types.js';
import { NotFoundError } from '../utils/errors.js';
import { calculatePagination } from '../utils/index.js';

/**
 * Activity Log Service
 * Handles all activity log-related business logic
 */

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert Prisma ActivityLog to ActivityLogResponse
 */
function toActivityLogResponse(log: any): ActivityLogResponse {
  return {
    id: log.id,
    userId: log.userId,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    description: log.description,
    oldData: log.oldData,
    newData: log.newData,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    method: log.method,
    endpoint: log.endpoint,
    success: log.success,
    errorMessage: log.errorMessage,
    severity: log.severity,
    duration: log.duration,
    createdAt: log.createdAt,
    updatedAt: log.updatedAt,
    user: log.user
      ? {
          id: log.user.id,
          username: log.user.username,
          email: log.user.email,
          name: log.user.name,
        }
      : null,
  };
}

/**
 * Convert to ActivityLogListItemResponse
 */
function toActivityLogListItem(log: any): ActivityLogListItemResponse {
  return {
    id: log.id,
    userId: log.userId,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    description: log.description,
    ipAddress: log.ipAddress,
    method: log.method,
    endpoint: log.endpoint,
    success: log.success,
    errorMessage: log.errorMessage,
    severity: log.severity,
    duration: log.duration,
    createdAt: log.createdAt,
    user: log.user
      ? {
          id: log.user.id,
          username: log.user.username,
          name: log.user.name,
        }
      : null,
  };
}

// ==================== READ OPERATIONS ====================

/**
 * Get All Activity Logs (with pagination and filters)
 * Admin-only access
 */
export async function getAllActivityLogs(
  query: GetActivityLogsQuery = {}
): Promise<PaginatedResult<ActivityLogListItemResponse>> {
  const {
    page = 1,
    limit = 20,
    userId,
    action,
    entity,
    entityId,
    success,
    severity,
    method,
    startDate,
    endDate,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // Ensure numbers (query params are strings!)
  const pageNum =
    typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum =
    typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 20;

  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: Prisma.ActivityLogWhereInput = {};

  if (userId) {
    where.userId = userId;
  }

  if (action) {
    where.action = action;
  }

  if (entity) {
    where.entity = entity;
  }

  if (entityId) {
    where.entityId = entityId;
  }

  if (typeof success === 'boolean') {
    where.success = success;
  }

  if (severity) {
    where.severity = severity;
  }

  if (method) {
    where.method = method;
  }

  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  // Search in description
  if (search) {
    where.description = {
      contains: search,
      mode: 'insensitive',
    };
  }

  // Count total items
  const totalItems = await prisma.activityLog.count({ where });

  // Fetch logs with pagination
  const logs = await prisma.activityLog.findMany({
    where,
    skip,
    take: limitNum,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
    },
  });

  // Calculate pagination
  const pagination = calculatePagination(totalItems, pageNum, limitNum);

  return {
    data: logs.map(toActivityLogListItem),
    pagination,
  };
}

/**
 * Get Activity Log by ID
 * Admin-only access
 */
export async function getActivityLogById(id: string): Promise<ActivityLogResponse> {
  const log = await prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!log) {
    throw new NotFoundError('Activity log not found');
  }

  return toActivityLogResponse(log);
}

/**
 * Get Activity Log Statistics
 * Admin-only access
 */
export async function getActivityLogStats(query: {
  userId?: string;
  startDate?: string;
  endDate?: string;
  entity?: string;
} = {}): Promise<ActivityLogStatsResponse> {
  const { userId, startDate, endDate, entity } = query;

  // Build where clause
  const where: Prisma.ActivityLogWhereInput = {};

  if (userId) {
    where.userId = userId;
  }

  if (entity) {
    where.entity = entity;
  }

  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  // Get total logs
  const totalLogs = await prisma.activityLog.count({ where });

  // Get successful and failed actions
  const successfulActions = await prisma.activityLog.count({
    where: { ...where, success: true },
  });

  const failedActions = await prisma.activityLog.count({
    where: { ...where, success: false },
  });

  // Group by action
  const actionGroups = await prisma.activityLog.groupBy({
    by: ['action'],
    where,
    _count: {
      action: true,
    },
  });

  const byAction: Record<string, number> = {};
  actionGroups.forEach((group) => {
    byAction[group.action] = group._count.action;
  });

  // Group by severity
  const severityGroups = await prisma.activityLog.groupBy({
    by: ['severity'],
    where,
    _count: {
      severity: true,
    },
  });

  const bySeverity: Record<string, number> = {};
  severityGroups.forEach((group) => {
    bySeverity[group.severity] = group._count.severity;
  });

  // Group by entity
  const entityGroups = await prisma.activityLog.groupBy({
    by: ['entity'],
    where,
    _count: {
      entity: true,
    },
  });

  const byEntity: Record<string, number> = {};
  entityGroups.forEach((group) => {
    byEntity[group.entity] = group._count.entity;
  });

  // Calculate average duration
  const avgDuration = await prisma.activityLog.aggregate({
    where: { ...where, duration: { not: null } },
    _avg: {
      duration: true,
    },
  });

  return {
    totalLogs,
    successfulActions,
    failedActions,
    byAction: byAction as any,
    bySeverity: bySeverity as any,
    byEntity,
    averageDuration: avgDuration._avg.duration,
  };
}

// ==================== UPDATE OPERATIONS ====================

/**
 * Update Activity Log
 * Admin-only access - for updating metadata like severity or adding notes
 */
export async function updateActivityLog(
  id: string,
  data: UpdateActivityLogRequest
): Promise<ActivityLogResponse> {
  // Check if log exists
  const existingLog = await prisma.activityLog.findUnique({
    where: { id },
  });

  if (!existingLog) {
    throw new NotFoundError('Activity log not found');
  }

  // Update log
  const updatedLog = await prisma.activityLog.update({
    where: { id },
    data: {
      severity: data.severity,
      description: data.description,
      errorMessage: data.errorMessage,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return toActivityLogResponse(updatedLog);
}

// ==================== DELETE OPERATIONS ====================

/**
 * Delete Activity Log
 * Admin-only access
 */
export async function deleteActivityLog(id: string): Promise<void> {
  // Check if log exists
  const existingLog = await prisma.activityLog.findUnique({
    where: { id },
  });

  if (!existingLog) {
    throw new NotFoundError('Activity log not found');
  }

  // Delete log
  await prisma.activityLog.delete({
    where: { id },
  });
}

/**
 * Delete Activity Logs in Bulk
 * Admin-only access - for cleanup operations
 */
export async function bulkDeleteActivityLogs(query: {
  userId?: string;
  action?: string;
  entity?: string;
  success?: boolean;
  severity?: string;
  beforeDate?: string;
}): Promise<number> {
  const { userId, action, entity, success, severity, beforeDate } = query;

  // Build where clause
  const where: Prisma.ActivityLogWhereInput = {};

  if (userId) {
    where.userId = userId;
  }

  if (action) {
    where.action = action as any;
  }

  if (entity) {
    where.entity = entity;
  }

  if (typeof success === 'boolean') {
    where.success = success;
  }

  if (severity) {
    where.severity = severity as any;
  }

  if (beforeDate) {
    where.createdAt = {
      lt: new Date(beforeDate),
    };
  }

  // Delete logs
  const result = await prisma.activityLog.deleteMany({
    where,
  });

  return result.count;
}
