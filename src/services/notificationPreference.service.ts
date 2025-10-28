/**
 * Notification Preference Service
 * Business logic for notification preference operations
 */

import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import type { UpdateNotificationPreferenceInput } from '../validators/notificationPreference.validator.js';

// ==================== READ ====================

/**
 * Get current user's notification preferences
 * Creates default preferences if they don't exist
 */
export async function getUserNotificationPreferences(userId: string) {
  // Check if preferences exist
  let preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  // Create default preferences if they don't exist
  if (!preferences) {
    preferences = await prisma.notificationPreference.create({
      data: { userId },
    });
  }

  return preferences;
}

// ==================== UPDATE ====================

/**
 * Update current user's notification preferences
 */
export async function updateUserNotificationPreferences(
  userId: string,
  data: UpdateNotificationPreferenceInput
) {
  // Ensure preferences exist first
  await getUserNotificationPreferences(userId);

  // Update preferences
  const updatedPreferences = await prisma.notificationPreference.update({
    where: { userId },
    data,
  });

  return updatedPreferences;
}

// ==================== DELETE ====================

/**
 * Reset notification preferences to default
 * Deletes existing preferences, which will be recreated with defaults on next access
 */
export async function resetUserNotificationPreferences(userId: string) {
  // Check if preferences exist
  const preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  if (!preferences) {
    throw new NotFoundError('Notification preferences not found');
  }

  // Delete existing preferences
  await prisma.notificationPreference.delete({
    where: { userId },
  });

  // Create new preferences with defaults
  const newPreferences = await prisma.notificationPreference.create({
    data: { userId },
  });

  return newPreferences;
}
