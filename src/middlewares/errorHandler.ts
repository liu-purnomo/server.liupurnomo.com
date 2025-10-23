import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { z } from 'zod';

/**
 * Prisma Error Types (checked by name since classes aren't exported)
 */
interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
    [key: string]: unknown;
  };
}

/**
 * Global Error Handler Middleware
 * Catches all errors and sends appropriate response
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: Array<{ field: string; message: string }> | undefined;

  // Operational errors (known errors)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  }
  // Prisma known request errors
  else if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as PrismaError;
    statusCode = 400;

    switch (prismaErr.code) {
      case 'P2002':
        // Unique constraint violation
        const target = prismaErr.meta?.target;
        const field = target?.[0] || 'field';
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        errors = [{ field, message: 'This value is already taken' }];
        break;

      case 'P2025':
        // Record not found
        statusCode = 404;
        message = 'Resource not found';
        break;

      case 'P2003':
        // Foreign key constraint violation
        message = 'Related resource not found';
        break;

      case 'P2014':
        // Required relation violation
        message = 'Invalid relation reference';
        break;

      default:
        message = 'Database operation failed';
    }
  }
  // Prisma validation errors
  else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }
  // Zod validation errors
  else if (err instanceof z.ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }
  // JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Multer errors (file upload)
  else if (err.name === 'MulterError') {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...(err instanceof AppError && { statusCode: err.statusCode }),
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err.message,
    }),
  });
};

/**
 * Not Found Handler
 * Catches all undefined routes
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404
  );
  next(error);
};
