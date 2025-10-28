import { Router } from 'express';
import * as activityLogController from '../controllers/activity-log.controller.js';
import {
  authenticate,
  requireRole,
  validate,
} from '../middlewares/index.js';
import {
  getActivityLogByIdValidator,
  getActivityLogsQueryValidator,
  getActivityLogStatsQueryValidator,
  updateActivityLogValidator,
  deleteActivityLogValidator,
} from '../validators/activity-log.validator.js';

/**
 * Activity Log Routes
 * All routes for activity log management operations
 * All endpoints require ADMIN role
 */

const router = Router();

// ==================== ADMIN-ONLY ROUTES ====================
// All activity log endpoints require authentication and ADMIN role

/**
 * Get Activity Log Statistics
 * GET /api/activity-logs/stats
 * NOTE: Must come before /:id route
 */
router.get(
  '/stats',
  authenticate,
  requireRole('ADMIN'),
  validate(getActivityLogStatsQueryValidator, 'query'),
  activityLogController.getActivityLogStats
);

/**
 * Bulk Delete Activity Logs
 * POST /api/activity-logs/bulk-delete
 * For cleanup operations based on filters
 */
router.post(
  '/bulk-delete',
  authenticate,
  requireRole('ADMIN'),
  activityLogController.bulkDeleteActivityLogs
);

/**
 * Get All Activity Logs (Paginated with Filters)
 * GET /api/activity-logs
 */
router.get(
  '/',
  authenticate,
  requireRole('ADMIN'),
  validate(getActivityLogsQueryValidator, 'query'),
  activityLogController.getAllActivityLogs
);

/**
 * Get Activity Log by ID
 * GET /api/activity-logs/:id
 */
router.get(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(getActivityLogByIdValidator, 'params'),
  activityLogController.getActivityLogById
);

/**
 * Update Activity Log
 * PATCH /api/activity-logs/:id
 * Admin can update metadata like severity or add notes
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(deleteActivityLogValidator, 'params'),
  validate(updateActivityLogValidator),
  activityLogController.updateActivityLog
);

/**
 * Delete Activity Log
 * DELETE /api/activity-logs/:id
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  validate(deleteActivityLogValidator, 'params'),
  activityLogController.deleteActivityLog
);

export default router;
