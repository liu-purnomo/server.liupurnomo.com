import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { ActivityAction, HttpMethod, LogSeverity } from '@prisma/client';

/**
 * Extended Request with user info and start time
 */
export interface RequestWithUser extends Request {
  user?: {
    id: string;
    username?: string;
    email?: string;
    role?: string;
  };
  startTime?: number;
}

/**
 * Activity Logger Middleware
 * Logs HTTP requests and user actions to database
 */
export const activityLogger = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  // Record start time for duration calculation
  req.startTime = Date.now();

  // Capture original send function
  const originalSend = res.send;

  // Override send to capture response
  res.send = function (data): Response {
    // Calculate request duration
    const duration = req.startTime ? Date.now() - req.startTime : undefined;

    // Determine if request was successful
    const success = res.statusCode < 400;

    // Extract user ID if authenticated
    const userId = req.user?.id || null;

    // Get IP address (considering proxy)
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket.remoteAddress ||
      null;

    // Get user agent
    const userAgent = req.headers['user-agent'] || null;

    // Map Express method to Prisma HttpMethod enum
    const method = mapHttpMethod(req.method);

    // Determine action type from method and endpoint
    const action = determineAction(req.method, req.path);

    // Extract entity from path (e.g., /api/users/123 -> User)
    const entity = extractEntity(req.path);

    // Log activity asynchronously (don't block response)
    logActivity({
      userId,
      action,
      entity,
      entityId: extractEntityId(req.path),
      description: generateDescription(req, success),
      method,
      endpoint: req.originalUrl,
      ipAddress,
      userAgent,
      success,
      errorMessage: success ? null : extractErrorMessage(data),
      severity: determineSeverity(res.statusCode),
      duration,
    }).catch((error) => {
      // Log error but don't fail the request
      console.error('Failed to log activity:', error);
    });

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Log Activity to Database
 * Async function that creates activity log entry
 */
async function logActivity(data: {
  userId: string | null;
  action: ActivityAction;
  entity: string;
  entityId?: string | null;
  description: string;
  method: HttpMethod | null;
  endpoint: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  errorMessage: string | null;
  severity: LogSeverity;
  duration?: number;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        description: data.description,
        method: data.method,
        endpoint: data.endpoint,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        success: data.success,
        errorMessage: data.errorMessage,
        severity: data.severity,
        duration: data.duration,
      },
    });
  } catch (error) {
    // Silently fail to prevent logging from breaking the app
    console.error('Activity log creation failed:', error);
  }
}

/**
 * Map HTTP method to Prisma enum
 */
function mapHttpMethod(method: string): HttpMethod | null {
  const methodMap: Record<string, HttpMethod> = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  };
  return methodMap[method.toUpperCase()] || null;
}

/**
 * Determine action type from HTTP method and path
 */
function determineAction(method: string, path: string): ActivityAction {
  // Check for specific endpoints
  if (path.includes('/login')) return 'LOGIN';
  if (path.includes('/logout')) return 'LOGOUT';
  if (path.includes('/register')) return 'REGISTER';
  if (path.includes('/reset-password')) return 'RESET_PASSWORD';
  if (path.includes('/verify-email')) return 'VERIFY_EMAIL';

  // Default CRUD mapping
  switch (method.toUpperCase()) {
    case 'POST':
      return 'CREATE';
    case 'GET':
      return 'READ';
    case 'PUT':
    case 'PATCH':
      return 'UPDATE';
    case 'DELETE':
      return 'DELETE';
    default:
      return 'READ';
  }
}

/**
 * Extract entity name from API path
 * e.g., /api/posts/123 -> Post
 * e.g., /api/users/profile -> User
 */
function extractEntity(path: string): string {
  const parts = path.split('/').filter(Boolean);

  // Skip 'api' prefix
  const entityIndex = parts[0] === 'api' ? 1 : 0;
  const entity = parts[entityIndex];

  if (entity) {
    // Capitalize first letter and singularize
    const capitalized = entity.charAt(0).toUpperCase() + entity.slice(1);
    // Remove 's' if plural
    return capitalized.endsWith('s') ? capitalized.slice(0, -1) : capitalized;
  }

  return 'Unknown';
}

/**
 * Extract entity ID from path
 * e.g., /api/posts/123 -> 123
 */
function extractEntityId(path: string): string | null {
  const parts = path.split('/').filter(Boolean);

  // Look for ID-like patterns (cuid, uuid, or numeric)
  for (const part of parts) {
    if (/^[a-z0-9]{20,}$/i.test(part) || /^\d+$/.test(part)) {
      return part;
    }
  }

  return null;
}

/**
 * Generate human-readable description
 */
function generateDescription(req: RequestWithUser, success: boolean): string {
  const method = req.method.toUpperCase();
  const path = req.path;
  const user = req.user?.username || 'Guest';

  if (!success) {
    return `${user} attempted ${method} ${path} (failed)`;
  }

  // Custom descriptions for common actions
  if (path.includes('/login')) {
    return `${user} logged in`;
  }
  if (path.includes('/logout')) {
    return `${user} logged out`;
  }
  if (path.includes('/register')) {
    return `New user registered: ${user}`;
  }

  // Default description
  return `${user} ${method} ${path}`;
}

/**
 * Extract error message from response data
 */
function extractErrorMessage(data: any): string | null {
  try {
    if (typeof data === 'string') {
      const parsed = JSON.parse(data);
      return parsed.message || parsed.error || null;
    }
    return data?.message || data?.error || null;
  } catch {
    return null;
  }
}

/**
 * Determine log severity from status code
 */
function determineSeverity(statusCode: number): LogSeverity {
  if (statusCode >= 500) return 'CRITICAL';
  if (statusCode >= 400) return 'ERROR';
  if (statusCode >= 300) return 'WARNING';
  return 'INFO';
}

/**
 * Skip Activity Logger for specific paths
 * Use this middleware before activityLogger for paths you want to skip
 */
export const skipActivityLog = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.skipActivityLog = true;
  next();
};

/**
 * Conditional Activity Logger
 * Only logs if skipActivityLog wasn't called
 */
export const conditionalActivityLogger = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (res.locals.skipActivityLog) {
    return next();
  }
  return activityLogger(req, res, next);
};
