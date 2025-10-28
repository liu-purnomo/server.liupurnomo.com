/**
 * Notification Preference Controller
 * HTTP request handlers for notification preference operations
 */

import { Request, Response, NextFunction } from 'express';
import * as notificationPreferenceService from '../services/notificationPreference.service.js';
import type { UpdateNotificationPreferenceInput } from '../validators/notificationPreference.validator.js';

// ==================== READ ====================

/**
 * Get Current User's Notification Preferences
 * GET /api/users/me/notification-preferences
 */
export async function getUserNotificationPreferences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;

    const preferences = await notificationPreferenceService.getUserNotificationPreferences(
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Notification preferences retrieved successfully',
      data: { preferences },
    });
  } catch (error) {
    next(error);
  }
}

// ==================== UPDATE ====================

/**
 * Update Current User's Notification Preferences
 * PATCH /api/users/me/notification-preferences
 */
export async function updateUserNotificationPreferences(
  req: Request<object, object, UpdateNotificationPreferenceInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const data = req.body;

    const preferences = await notificationPreferenceService.updateUserNotificationPreferences(
      userId,
      data
    );

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: { preferences },
    });
  } catch (error) {
    next(error);
  }
}

// ==================== DELETE ====================

/**
 * Reset Notification Preferences to Default
 * POST /api/users/me/notification-preferences/reset
 */
export async function resetUserNotificationPreferences(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;

    const preferences = await notificationPreferenceService.resetUserNotificationPreferences(
      userId
    );

    res.status(200).json({
      success: true,
      message: 'Notification preferences reset to defaults successfully',
      data: { preferences },
    });
  } catch (error) {
    next(error);
  }
}
