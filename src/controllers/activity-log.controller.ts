import { Request, Response } from 'express';
import { activityLogService } from '../services/index.js';
import {
  asyncHandler,
  logActivity,
  sendNoContent,
  sendSuccess,
} from '../utils/index.js';

/**
 * Activity Log Controllers
 * Handle HTTP requests for activity log management operations
 * All endpoints are admin-only access
 */

// ==================== READ OPERATIONS ====================

/**
 * Get All Activity Logs (Paginated with Filters)
 * GET /api/activity-logs
 * Requires authentication and ADMIN role
 */
export const getAllActivityLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query;

    const result = await activityLogService.getAllActivityLogs(query);

    return sendSuccess(
      res,
      200,
      'Activity logs retrieved successfully',
      { activityLogs: result.data },
      result.pagination
    );
  }
);

/**
 * Get Activity Log by ID
 * GET /api/activity-logs/:id
 * Requires authentication and ADMIN role
 */
export const getActivityLogById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const activityLog = await activityLogService.getActivityLogById(id!);

    return sendSuccess(res, 200, 'Activity log retrieved successfully', {
      activityLog,
    });
  }
);

/**
 * Get Activity Log Statistics
 * GET /api/activity-logs/stats
 * Requires authentication and ADMIN role
 */
export const getActivityLogStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, startDate, endDate, entity } = req.query;

    const stats = await activityLogService.getActivityLogStats({
      userId: userId as string,
      startDate: startDate as string,
      endDate: endDate as string,
      entity: entity as string,
    });

    return sendSuccess(res, 200, 'Activity log stats retrieved successfully', {
      stats,
    });
  }
);

// ==================== UPDATE OPERATIONS ====================

/**
 * Update Activity Log
 * PATCH /api/activity-logs/:id
 * Requires authentication and ADMIN role
 * Admin can update metadata like severity or add notes
 */
export const updateActivityLog = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;
    const updateData = req.body;

    const activityLog = await activityLogService.updateActivityLog(
      id!,
      updateData
    );

    // Log this activity
    await logActivity({
      userId,
      action: 'UPDATE',
      entity: 'ActivityLog',
      entityId: id,
      description: `Updated activity log metadata`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, 'Activity log updated successfully', {
      activityLog,
    });
  }
);

// ==================== DELETE OPERATIONS ====================

/**
 * Delete Activity Log
 * DELETE /api/activity-logs/:id
 * Requires authentication and ADMIN role
 */
export const deleteActivityLog = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { id } = req.params;

    await activityLogService.deleteActivityLog(id!);

    // Log this activity
    await logActivity({
      userId,
      action: 'DELETE',
      entity: 'ActivityLog',
      entityId: id,
      description: `Deleted activity log`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendNoContent(res);
  }
);

/**
 * Bulk Delete Activity Logs
 * POST /api/activity-logs/bulk-delete
 * Requires authentication and ADMIN role
 * For cleanup operations based on filters
 */
export const bulkDeleteActivityLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { userId: targetUserId, action, entity, success, severity, beforeDate } = req.body;

    const deletedCount = await activityLogService.bulkDeleteActivityLogs({
      userId: targetUserId,
      action,
      entity,
      success,
      severity,
      beforeDate,
    });

    // Log this activity
    await logActivity({
      userId,
      action: 'DELETE',
      entity: 'ActivityLog',
      description: `Bulk deleted ${deletedCount} activity logs`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    return sendSuccess(res, 200, `Successfully deleted ${deletedCount} activity logs`, {
      deletedCount,
    });
  }
);
