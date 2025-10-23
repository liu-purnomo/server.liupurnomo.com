import { prisma } from '../lib/prisma.js';
import { ActivityAction, LogSeverity } from '@prisma/client';

/**
 * Activity Logger Helpers
 * Manual logging functions for specific actions
 */

interface LogActivityOptions {
  userId?: string | null;
  action: ActivityAction;
  entity: string;
  entityId?: string;
  description: string;
  oldData?: any;
  newData?: any;
  severity?: LogSeverity;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log Activity Manually
 * Use this for actions that don't go through HTTP middleware
 */
export async function logActivity(options: LogActivityOptions): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: options.userId || null,
        action: options.action,
        entity: options.entity,
        entityId: options.entityId || null,
        description: options.description,
        oldData: options.oldData ? JSON.parse(JSON.stringify(options.oldData)) : null,
        newData: options.newData ? JSON.parse(JSON.stringify(options.newData)) : null,
        severity: options.severity || 'INFO',
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
        success: true,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

/**
 * Log User Registration
 */
export async function logUserRegistration(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logActivity({
    userId,
    action: 'REGISTER',
    entity: 'User',
    entityId: userId,
    description: `New user registered: ${email}`,
    severity: 'INFO',
    ipAddress,
    userAgent,
  });
}

/**
 * Log User Login
 */
export async function logUserLogin(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logActivity({
    userId,
    action: 'LOGIN',
    entity: 'User',
    entityId: userId,
    description: `User logged in: ${email}`,
    severity: 'INFO',
    ipAddress,
    userAgent,
  });
}

/**
 * Log User Logout
 */
export async function logUserLogout(
  userId: string,
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  await logActivity({
    userId,
    action: 'LOGOUT',
    entity: 'User',
    entityId: userId,
    description: `User logged out: ${email}`,
    severity: 'INFO',
    ipAddress,
    userAgent,
  });
}

/**
 * Log Email Verification
 */
export async function logEmailVerification(
  userId: string,
  email: string
): Promise<void> {
  await logActivity({
    userId,
    action: 'VERIFY_EMAIL',
    entity: 'User',
    entityId: userId,
    description: `Email verified: ${email}`,
    severity: 'INFO',
  });
}

/**
 * Log Password Reset
 */
export async function logPasswordReset(
  userId: string,
  email: string,
  ipAddress?: string
): Promise<void> {
  await logActivity({
    userId,
    action: 'RESET_PASSWORD',
    entity: 'User',
    entityId: userId,
    description: `Password reset for: ${email}`,
    severity: 'WARNING',
    ipAddress,
  });
}

/**
 * Log Create Action
 */
export async function logCreate(
  userId: string | null,
  entity: string,
  entityId: string,
  description: string,
  data?: any
): Promise<void> {
  await logActivity({
    userId,
    action: 'CREATE',
    entity,
    entityId,
    description,
    newData: data,
    severity: 'INFO',
  });
}

/**
 * Log Update Action
 */
export async function logUpdate(
  userId: string | null,
  entity: string,
  entityId: string,
  description: string,
  oldData?: any,
  newData?: any
): Promise<void> {
  await logActivity({
    userId,
    action: 'UPDATE',
    entity,
    entityId,
    description,
    oldData,
    newData,
    severity: 'INFO',
  });
}

/**
 * Log Delete Action
 */
export async function logDelete(
  userId: string | null,
  entity: string,
  entityId: string,
  description: string,
  data?: any
): Promise<void> {
  await logActivity({
    userId,
    action: 'DELETE',
    entity,
    entityId,
    description,
    oldData: data,
    severity: 'WARNING',
  });
}

/**
 * Log Critical Error
 */
export async function logCriticalError(
  description: string,
  error: Error,
  userId?: string
): Promise<void> {
  await logActivity({
    userId,
    action: 'READ',
    entity: 'System',
    description: `Critical error: ${description}`,
    newData: {
      error: error.message,
      stack: error.stack,
    },
    severity: 'CRITICAL',
  });
}

/**
 * Get User Activity Logs
 * Retrieve activity logs for a specific user
 */
export async function getUserActivityLogs(
  userId: string,
  limit: number = 50,
  offset: number = 0
) {
  return await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    select: {
      id: true,
      action: true,
      entity: true,
      description: true,
      success: true,
      severity: true,
      createdAt: true,
    },
  });
}

/**
 * Get Entity Activity Logs
 * Retrieve activity logs for a specific entity
 */
export async function getEntityActivityLogs(
  entity: string,
  entityId: string,
  limit: number = 50
) {
  return await prisma.activityLog.findMany({
    where: {
      entity,
      entityId,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get Recent Activity Logs
 * Retrieve recent system-wide activity
 */
export async function getRecentActivityLogs(limit: number = 100) {
  return await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
}
