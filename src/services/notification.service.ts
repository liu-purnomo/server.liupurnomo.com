/**
 * Notification Service
 * Business logic for notification management
 */

import { NotificationType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { PaginatedResult } from '../types/response.types.js';
import { calculatePagination } from '../utils/index.js';
import { NotFoundError } from '../utils/errors.js';

// ==================== TYPES ====================

export interface NotificationResponse {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  postId: string | null;
  commentId: string | null;
  reactionId: string | null;
  actorUserId: string | null;
  actionUrl: string | null;
  metadata: any;
  isRead: boolean;
  readAt: Date | null;
  isEmailSent: boolean;
  emailSentAt: Date | null;
  groupKey: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
}

export interface GetNotificationsQuery {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== SERVICE FUNCTIONS ====================

/**
 * Get user's notifications with pagination and filters
 */
export async function getUserNotifications(
  userId: string,
  query: GetNotificationsQuery = {}
): Promise<PaginatedResult<NotificationResponse>> {
  const {
    page = 1,
    limit = 20,
    isRead,
    type,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // Defensive type coercion for pagination
  const pageNum =
    typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum =
    typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 20;

  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: any = { userId };

  if (typeof isRead === 'boolean') {
    where.isRead = isRead;
  }

  if (type) {
    where.type = type as NotificationType;
  }

  // Query notifications
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limitNum,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    data: notifications,
    pagination: calculatePagination(total, pageNum, limitNum),
  };
}

/**
 * Get single notification by ID
 */
export async function getNotificationById(
  notificationId: string,
  userId: string
): Promise<NotificationResponse> {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId, // Ensure user owns this notification
    },
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  return notification;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<NotificationResponse> {
  // Check if notification exists and belongs to user
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  // Update notification
  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return updatedNotification;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ count: number }> {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return { count: result.count };
}

/**
 * Delete notification
 */
export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<void> {
  // Check if notification exists and belongs to user
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  // Delete notification
  await prisma.notification.delete({
    where: { id: notificationId },
  });
}

/**
 * Delete all read notifications for a user
 */
export async function deleteAllReadNotifications(
  userId: string
): Promise<{ count: number }> {
  const result = await prisma.notification.deleteMany({
    where: {
      userId,
      isRead: true,
    },
  });

  return { count: result.count };
}
