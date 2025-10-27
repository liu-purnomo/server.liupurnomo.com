import { Response } from 'express';
import {
  ApiError,
  PaginationMeta,
  SuccessResponse,
  ErrorResponse,
} from '../types/response.types.js';

/**
 * API Response Utility
 * Provides standardized methods for sending API responses
 */

/**
 * Send a success response
 * @param res - Express response object
 * @param statusCode - HTTP status code (default: 200)
 * @param message - Success message
 * @param data - Response data (optional)
 * @param pagination - Pagination metadata (optional)
 */
export const sendSuccess = <T = unknown>(
  res: Response,
  statusCode: number = 200,
  message: string,
  data?: T,
  pagination?: PaginationMeta
): Response<SuccessResponse<T>> => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data: data as T,
    timestamp: new Date().toISOString(),
    path: res.req?.originalUrl || res.req?.url,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param res - Express response object
 * @param statusCode - HTTP status code (default: 500)
 * @param message - Error message
 * @param errors - Array of error details (optional)
 */
export const sendError = (
  res: Response,
  statusCode: number = 500,
  message: string,
  errors?: ApiError[]
): Response<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path: res.req?.originalUrl || res.req?.url,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a paginated success response
 * @param res - Express response object
 * @param message - Success message
 * @param data - Array of data items
 * @param pagination - Pagination metadata
 */
export const sendPaginatedSuccess = <T = unknown>(
  res: Response,
  message: string,
  data: T[],
  pagination: PaginationMeta
): Response<SuccessResponse<T[]>> => {
  // Add helper flags for pagination
  const enrichedPagination: PaginationMeta = {
    ...pagination,
    hasNextPage: pagination.currentPage < pagination.totalPages,
    hasPreviousPage: pagination.currentPage > 1,
  };

  return sendSuccess(res, 200, message, data, enrichedPagination);
};

/**
 * Send a created response (201)
 * @param res - Express response object
 * @param message - Success message
 * @param data - Created resource data
 */
export const sendCreated = <T = unknown>(
  res: Response,
  message: string,
  data: T
): Response<SuccessResponse<T>> => {
  return sendSuccess(res, 201, message, data);
};

/**
 * Send a no content response (204)
 * @param res - Express response object
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Send a bad request error (400)
 * @param res - Express response object
 * @param message - Error message
 * @param errors - Array of error details (optional)
 */
export const sendBadRequest = (
  res: Response,
  message: string,
  errors?: ApiError[]
): Response<ErrorResponse> => {
  return sendError(res, 400, message, errors);
};

/**
 * Send an unauthorized error (401)
 * @param res - Express response object
 * @param message - Error message (default: 'Unauthorized')
 */
export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized'
): Response<ErrorResponse> => {
  return sendError(res, 401, message);
};

/**
 * Send a forbidden error (403)
 * @param res - Express response object
 * @param message - Error message (default: 'Forbidden')
 */
export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden'
): Response<ErrorResponse> => {
  return sendError(res, 403, message);
};

/**
 * Send a not found error (404)
 * @param res - Express response object
 * @param message - Error message (default: 'Resource not found')
 */
export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found'
): Response<ErrorResponse> => {
  return sendError(res, 404, message);
};

/**
 * Send a conflict error (409)
 * @param res - Express response object
 * @param message - Error message
 * @param errors - Array of error details (optional)
 */
export const sendConflict = (
  res: Response,
  message: string,
  errors?: ApiError[]
): Response<ErrorResponse> => {
  return sendError(res, 409, message, errors);
};

/**
 * Send a validation error (422)
 * @param res - Express response object
 * @param message - Error message
 * @param errors - Array of validation error details
 */
export const sendValidationError = (
  res: Response,
  message: string,
  errors: ApiError[]
): Response<ErrorResponse> => {
  return sendError(res, 422, message, errors);
};

/**
 * Send an internal server error (500)
 * @param res - Express response object
 * @param message - Error message (default: 'Internal server error')
 */
export const sendInternalError = (
  res: Response,
  message: string = 'Internal server error'
): Response<ErrorResponse> => {
  return sendError(res, 500, message);
};

/**
 * Calculate pagination metadata
 * @param totalItems - Total number of items
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Pagination metadata
 */
export const calculatePagination = (
  totalItems: number,
  page: number = 1,
  limit: number = 10
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  return {
    currentPage,
    perPage: limit,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

/**
 * Default export object with all response utilities
 */
export default {
  success: sendSuccess,
  error: sendError,
  paginated: sendPaginatedSuccess,
  created: sendCreated,
  noContent: sendNoContent,
  badRequest: sendBadRequest,
  unauthorized: sendUnauthorized,
  forbidden: sendForbidden,
  notFound: sendNotFound,
  conflict: sendConflict,
  validationError: sendValidationError,
  internalError: sendInternalError,
  calculatePagination,
};
