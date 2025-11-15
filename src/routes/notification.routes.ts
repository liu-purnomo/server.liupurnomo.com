/**
 * Notification Routes
 * Endpoints for notification management
 */

import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  getNotificationsQuerySchema,
  getNotificationByIdSchema,
  markAsReadSchema,
  markAllAsReadSchema,
  deleteNotificationSchema,
  deleteAllReadSchema,
} from '../validators/notification.validator.js';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications with pagination and filters
 * @access  Private
 */
router.get(
  '/',
  validate(getNotificationsQuerySchema, 'query'),
  notificationController.getUserNotifications
);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private
 */
router.get('/unread-count', notificationController.getUnreadCount);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch(
  '/read-all',
  validate(markAllAsReadSchema, 'body'),
  notificationController.markAllAsRead
);

/**
 * @route   DELETE /api/notifications/read
 * @desc    Delete all read notifications
 * @access  Private
 */
router.delete(
  '/read',
  validate(deleteAllReadSchema, 'body'),
  notificationController.deleteAllRead
);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get single notification by ID
 * @access  Private
 */
router.get(
  '/:id',
  validate(getNotificationByIdSchema, 'params'),
  notificationController.getNotificationById
);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.patch(
  '/:id/read',
  validate(markAsReadSchema, 'params'),
  notificationController.markAsRead
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete(
  '/:id',
  validate(deleteNotificationSchema, 'params'),
  notificationController.deleteNotification
);

export default router;
