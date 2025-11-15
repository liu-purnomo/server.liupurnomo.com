/**
 * Notification Controller
 * Handles HTTP requests for notification management
 */

import { Request, Response } from 'express';
import * as notificationService from '../services/notification.service.js';
import { sendSuccess, sendPaginatedSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  GetNotificationsQueryInput,
  GetNotificationByIdInput,
  MarkAsReadInput,
  DeleteNotificationInput,
} from '../validators/notification.validator.js';

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications with pagination and filters
 * @access  Private
 */
export const getUserNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const query = req.query as unknown as GetNotificationsQueryInput;

    const result = await notificationService.getUserNotifications(
      userId,
      query
    );

    return sendPaginatedSuccess(
      res,
      'Notifications retrieved successfully',
      result.data,
      result.pagination
    );
  }
);

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private
 */
export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const count = await notificationService.getUnreadCount(userId);

    return sendSuccess(res, 200, 'Unread count retrieved successfully', {
      count,
    });
  }
);

/**
 * @route   GET /api/notifications/:id
 * @desc    Get single notification by ID
 * @access  Private
 */
export const getNotificationById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as GetNotificationByIdInput;

    const notification = await notificationService.getNotificationById(
      id,
      userId
    );

    return sendSuccess(
      res,
      200,
      'Notification retrieved successfully',
      notification
    );
  }
);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
export const markAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as MarkAsReadInput;

    const notification = await notificationService.markNotificationAsRead(
      id,
      userId
    );

    return sendSuccess(
      res,
      200,
      'Notification marked as read',
      notification
    );
  }
);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await notificationService.markAllNotificationsAsRead(userId);

    return sendSuccess(res, 200, 'All notifications marked as read', result);
  }
);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { id } = req.params as DeleteNotificationInput;

    await notificationService.deleteNotification(id, userId);

    return sendSuccess(res, 200, 'Notification deleted successfully', null);
  }
);

/**
 * @route   DELETE /api/notifications/read
 * @desc    Delete all read notifications
 * @access  Private
 */
export const deleteAllRead = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await notificationService.deleteAllReadNotifications(userId);

    return sendSuccess(
      res,
      200,
      'All read notifications deleted successfully',
      result
    );
  }
);
