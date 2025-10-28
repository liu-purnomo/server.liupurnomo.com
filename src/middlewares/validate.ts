import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * Validation Middleware
 * Validate request using Zod schema
 */

/**
 * Validate Request Middleware
 * Validates request body, query, or params against Zod schema
 *
 * @param schema - Zod schema object
 * @param source - Which part to validate: 'body' (default), 'query', or 'params'
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate specific part of request against schema
      const dataToValidate = req[source];
      await schema.parseAsync(dataToValidate);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into user-friendly messages
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(
          new ValidationError(
            'Validation failed',
            errors
          )
        );
      } else {
        next(error);
      }
    }
  };
}
