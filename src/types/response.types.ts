/**
 * API Response Type Definitions
 * Standardized response structure for all API endpoints
 */

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

/**
 * Error details for failed responses
 */
export interface ApiError {
  code?: string;
  field?: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Base API Response structure
 * All API responses should follow this format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: ApiError[];
  timestamp?: string;
  path?: string;
}

/**
 * Success Response (simplified type)
 */
export type SuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  timestamp?: string;
  path?: string;
};

/**
 * Error Response (simplified type)
 */
export type ErrorResponse = {
  success: false;
  message: string;
  errors?: ApiError[];
  timestamp?: string;
  path?: string;
};

/**
 * Pagination options for list queries
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated data result
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
