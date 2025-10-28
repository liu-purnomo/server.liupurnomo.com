/**
 * Activity Log Types
 * Type definitions for activity log management
 */

// ==================== ENUMS ====================

/**
 * Activity Action Types
 */
export enum ActivityAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
}

/**
 * HTTP Method Types
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

/**
 * Log Severity Levels
 */
export enum LogSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

// ==================== REQUEST TYPES ====================

/**
 * Update Activity Log Request
 * For updating activity log metadata (e.g., severity, notes)
 */
export interface UpdateActivityLogRequest {
  severity?: LogSeverity;
  description?: string;
  errorMessage?: string;
}

/**
 * Get Activity Logs Query Parameters
 */
export interface GetActivityLogsQuery {
  page?: number;
  limit?: number;
  userId?: string; // Filter by user
  action?: ActivityAction; // Filter by action type
  entity?: string; // Filter by entity type (User, Post, Comment, etc.)
  entityId?: string; // Filter by specific entity ID
  success?: boolean; // Filter by success/failure
  severity?: LogSeverity; // Filter by severity level
  method?: HttpMethod; // Filter by HTTP method
  startDate?: string; // Filter from date (ISO 8601)
  endDate?: string; // Filter to date (ISO 8601)
  search?: string; // Search in description
  sortBy?:
    | 'createdAt'
    | 'action'
    | 'entity'
    | 'severity'
    | 'duration'
    | 'userId';
  sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE TYPES ====================

/**
 * Activity Log Response
 * Full activity log information
 */
export interface ActivityLogResponse {
  id: string;
  userId: string | null;
  action: ActivityAction;
  entity: string;
  entityId: string | null;
  description: string;
  oldData: any | null; // JSON data
  newData: any | null; // JSON data
  ipAddress: string | null;
  userAgent: string | null;
  method: HttpMethod | null;
  endpoint: string | null;
  success: boolean;
  errorMessage: string | null;
  severity: LogSeverity;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    username: string;
    email: string;
    name: string | null;
  } | null;
}

/**
 * Activity Log List Item Response
 * For activity log lists
 */
export interface ActivityLogListItemResponse {
  id: string;
  userId: string | null;
  action: ActivityAction;
  entity: string;
  entityId: string | null;
  description: string;
  ipAddress: string | null;
  method: HttpMethod | null;
  endpoint: string | null;
  success: boolean;
  errorMessage: string | null;
  severity: LogSeverity;
  duration: number | null;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
    name: string | null;
  } | null;
}

/**
 * Activity Log Stats Response
 * Statistical data for activity logs
 */
export interface ActivityLogStatsResponse {
  totalLogs: number;
  successfulActions: number;
  failedActions: number;
  byAction: Record<ActivityAction, number>;
  bySeverity: Record<LogSeverity, number>;
  byEntity: Record<string, number>;
  averageDuration: number | null;
}
